import { DEFAULT_TRIP_FARE } from '@/lib/constants/transit-fares';

interface BusRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
}

interface BusStop {
  stop_id: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  stop_url?: string;
  location_type: number;
  parent_station?: string;
}

interface BusArrival {
  route_id: string;
  route_name: string;
  stop_id: string;
  stop_name: string;
  arrival_time: string;
  departure_time: string;
  realtime_arrival?: string;
  delay_minutes?: number;
  vehicle_id?: string;
  direction: 'inbound' | 'outbound';
  headsign: string;
}

interface ServiceAlert {
  alert_id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  effect: string;
  cause: string;
  affected_routes: string[];
  affected_stops: string[];
  active_period: {
    start: string;
    end?: string;
  };
}

export class GTFSService {
  private theBusBaseUrl = 'https://hea.thebus.org/api';
  private theBusAppId = process.env.THEBUS_API_KEY || '4F08EE2E-5612-41F9-B527-854EAD77AC2B';
  private skylineUrl = 'https://api.hartskyrail.org'; // Placeholder for future HART API
  private claudeApiKey = process.env.ANTHROPIC_API_KEY;
  private hartApiKey = process.env.HART_API_KEY;

  async getRoutes(): Promise<BusRoute[]> {
    try {
      return await this.fetchTheBusRoutes();
    } catch (error) {
      console.error('GTFS routes error:', error);
      return [];
    }
  }

  async getNearbyStops(lat: number, lon: number, radius: number = 500): Promise<BusStop[]> {
    try {
      return await this.fetchNearbyStops(lat, lon, radius);
    } catch (error) {
      console.error('GTFS nearby stops error:', error);
      return [];
    }
  }

  async getStopArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      return await this.fetchStopArrivals(stopId);
    } catch (error) {
      console.error('GTFS arrivals error:', error);
      return [];
    }
  }

  async getServiceAlerts(): Promise<ServiceAlert[]> {
    try {
      // Combine alerts from TheBus and HART Skyline
      const [theBusAlerts, skylineAlerts] = await Promise.all([
        this.fetchTheBusAlerts(),
        this.fetchSkylineAlerts()
      ]);
      return [...theBusAlerts, ...skylineAlerts];
    } catch (error) {
      console.error('GTFS alerts error:', error);
      return [];
    }
  }

  async planTrip(origin: [number, number], destination: [number, number], time?: string): Promise<any> {
    try {
      console.log(`🚌 TRIP PLANNING: [${origin[1]}, ${origin[0]}] → [${destination[1]}, ${destination[0]}]`);
      
      const originLat = origin[1];
      const originLon = origin[0];
      const destLat = destination[1];
      const destLon = destination[0];
      
      // Debug: Check if these look like real Oahu coordinates
      if (originLat < 21.2 || originLat > 21.7 || originLon > -157.6 || originLon < -158.3) {
        console.log('⚠️  WARNING: Origin coordinates look suspicious - outside Oahu range');
      }
      if (destLat < 21.2 || destLat > 21.7 || destLon > -157.6 || destLon < -158.3) {
        console.log('⚠️  WARNING: Destination coordinates look suspicious - outside Oahu range');
      }
      
      // First try coordinate-based routing
      const coordinateRoutes = await this.generateRealOahuRoutes(originLat, originLon, destLat, destLon);
      if (coordinateRoutes && coordinateRoutes.length > 0) {
        return {
          plans: coordinateRoutes,
          success: true
        };
      }
      
      // Use Claude API for intelligent routing - prioritize for complex routes
      if (this.claudeApiKey) {
        console.log('🤖 Trying Claude AI for intelligent routing...');
        const intelligentRoutes = await this.getClaudeRouting(originLat, originLon, destLat, destLon);
        if (intelligentRoutes && intelligentRoutes.length > 0) {
          console.log('✅ Claude AI provided routing solution');
          return {
            plans: intelligentRoutes,
            success: true
          };
        } else {
          console.log('❌ Claude AI routing failed or returned no routes');
        }
      } else {
        console.log('❌ No Claude API key available');
      }
      
      // Final fallback with real routes
      return this.getFallbackTripPlan(originLat, originLon, destLat, destLon);
    } catch (error) {
      console.error('Trip planning error:', error);
      return this.getFallbackTripPlan(origin[1], origin[0], destination[1], destination[0]);
    }
  }

  private async getClaudeRouting(originLat: number, originLon: number, destLat: number, destLon: number): Promise<any[]> {
    try {
      const prompt = `Plan a realistic transit route on Oahu, Hawaii from coordinates [${originLat}, ${originLon}] to [${destLat}, ${destLon}]. 

CRITICAL: If no reasonable public transit route exists, return "NO_TRANSIT_AVAILABLE" instead of a JSON array.

IMPORTANT ROUTING RULES:
- Only use REAL routes that actually exist and make geographic sense
- Route 23 (Hawaii Kai-Sea Life Park) serves EAST Oahu (Diamond Head, Hawaii Kai) - NOT Kalihi/North Shore
- For Kapolei to Kalihi: Use Route C to Downtown, then Route 1 to Kalihi
- For West Oahu to anywhere: Route C (Country Express) goes to Downtown first
- Never create fake routes or use inappropriate routes

Real Oahu bus routes with actual service patterns:
- Route C (Country Express): Kapolei/West Oahu ↔ Downtown (fast express, limited stops)
- Route 1: Kalihi-Palama ↔ Downtown (serves Kalihi area)
- Route 40: Ewa Beach ↔ Ala Moana (express service)
- Route 42: Ewa Beach ↔ Waikiki via Ala Moana
- Route 20: Airport ↔ Waikiki/Downtown
- Route 23: Hawaii Kai ↔ Sea Life Park via Diamond Head (EAST Oahu ONLY)
- Route 8: Waikiki ↔ Ala Moana (frequent urban service)
- Routes 56/57: Ala Moana ↔ Kailua/Lanikai beaches

Key transit hubs: Downtown (for Kalihi), Ala Moana Center (for central/south), Kapolei Transit Center.

If transit IS available, return ONLY a JSON array:
[{
  "duration": 2700,
  "walking_distance": 600,
  "transfers": 0,
  "cost": 3.00,
  "legs": [{
    "mode": "WALK",
    "from": {"lat": ${originLat}, "lon": ${originLon}, "name": "Starting Location"},
    "to": {"lat": ${originLat + 0.001}, "lon": ${originLon + 0.001}, "name": "Bus Stop"},
    "duration": 300,
    "distance": 250
  }, {
    "mode": "TRANSIT", 
    "route": "C",
    "routeName": "Country Express",
    "from": {"lat": ${originLat + 0.001}, "lon": ${originLon + 0.001}, "name": "Transit Center"},
    "to": {"lat": ${destLat - 0.001}, "lon": ${destLon - 0.001}, "name": "Destination Area"},
    "duration": 2100,
    "headsign": "Downtown Honolulu"
  }, {
    "mode": "WALK",
    "from": {"lat": ${destLat - 0.001}, "lon": ${destLon - 0.001}, "name": "Bus Stop"},
    "to": {"lat": ${destLat}, "lon": ${destLon}, "name": "Destination"},
    "duration": 300,
    "distance": 250
  }]
}]

If NO reasonable transit exists, return exactly: NO_TRANSIT_AVAILABLE`;

      console.log('Using Claude API for intelligent routing...');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });
      
      if (!response.ok) {
        console.error('Claude API error:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      const routeText = data.content[0].text;
      
      // Parse Claude's response
      try {
        // Check if Claude says no transit is available
        if (routeText.trim() === 'NO_TRANSIT_AVAILABLE') {
          console.log('🚕 Claude determined no transit available - will suggest rideshare');
          return [];
        }
        
        const routes = JSON.parse(routeText);
        if (Array.isArray(routes)) {
          console.log('✅ Claude provided', routes.length, 'route options');
          return routes;
        }
      } catch (parseError) {
        console.error('Error parsing Claude response:', parseError);
        console.log('Claude response was:', routeText);
      }
      
      return [];
    } catch (error) {
      console.error('Claude routing error:', error);
      return [];
    }
  }

  private getFallbackTripPlan(originLat: number, originLon: number, destLat: number, destLon: number): any {
    console.log('🚕 No transit options found - suggesting rideshare/taxi');
    
    // Calculate approximate distance for rideshare estimates
    const distanceKm = this.calculateDistance(originLat, originLon, destLat, destLon);
    const estimatedDuration = Math.max(900, distanceKm * 120); // Min 15 min, ~2 min per km
    const estimatedCost = Math.max(15, distanceKm * 3.5); // Oahu taxi rates: ~$3.50/km + base fare
    
    return {
      plans: [
        {
          duration: estimatedDuration,
          walking_distance: 100, // Just to car pickup
          transfers: 0,
          cost: estimatedCost,
          mode: 'RIDESHARE',
          legs: [
            {
              mode: 'RIDESHARE',
              provider: 'Uber/Lyft/Taxi',
              from: { lat: originLat, lon: originLon, name: 'Current Location' },
              to: { lat: destLat, lon: destLon, name: 'Destination' },
              duration: estimatedDuration,
              distance: distanceKm * 1000,
              instruction: `No public transit available. Consider rideshare (~$${estimatedCost.toFixed(0)}) or taxi service.`,
              headsign: 'Direct Ride',
              alternatives: [
                'Uber - Download app or call',
                'Lyft - Available in most areas',
                'Local taxi companies',
                'Hotel shuttle (if available)'
              ]
            }
          ],
          note: `Distance: ${distanceKm.toFixed(1)} km. Public transit may not serve this route efficiently.`
        }
      ],
      success: true,
      transitUnavailable: true,
      message: 'No efficient public transit route found. Rideshare or taxi recommended.'
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  private async generateRealOahuRoutes(originLat: number, originLon: number, destLat: number, destLon: number): Promise<any[]> {
    console.log(`🚌 Dynamic route generation: [${originLat}, ${originLon}] → [${destLat}, ${destLon}]`);
    
    // First try to get actual bus routes from TheBus API
    try {
      const busRoutes = await this.queryTheBusAPI(originLat, originLon, destLat, destLon);
      if (busRoutes && busRoutes.length > 0) {
        console.log('✅ Found real bus routes from TheBus API');
        return busRoutes;
      }
    } catch (error) {
      console.error('TheBus API query failed:', error);
    }

    // No bus routes found - return empty to trigger Claude API or fallback
    console.log('❌ No real bus routes found from API - need to use Claude or rideshare');
    return [];
  }

  private async queryTheBusAPI(originLat: number, originLon: number, destLat: number, destLon: number): Promise<any[]> {
    try {
      // Try TheBus trip planning API endpoints
      const endpoints = [
        `${this.theBusBaseUrl}/tripplanner?appID=${this.theBusAppId}&from=${originLat},${originLon}&to=${destLat},${destLon}&format=json`,
        `${this.theBusBaseUrl}/directions?appID=${this.theBusAppId}&origin=${originLat},${originLon}&destination=${destLat},${destLon}&format=json`
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Querying TheBus API: ${endpoint.replace(this.theBusAppId!, 'API_KEY')}`);
          
          const response = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('TheBus API response received');
            
            // Transform TheBus API response to our format
            if (data && (data.routes || data.directions || data.trips)) {
              return this.transformTheBusResponse(data, originLat, originLon, destLat, destLon);
            }
          } else {
            console.log(`TheBus API ${response.status}: ${response.statusText}`);
          }
        } catch (endpointError) {
          console.error(`TheBus endpoint failed:`, endpointError);
        }
      }

      return [];
    } catch (error) {
      console.error('TheBus API integration error:', error);
      return [];
    }
  }

  private transformTheBusResponse(data: any, originLat: number, originLon: number, destLat: number, destLon: number): any[] {
    try {
      // Transform actual TheBus API response into our route format
      const routes = data.routes || data.directions || data.trips || [];
      
      return routes.map((route: any) => ({
        duration: route.duration || route.time || 2700,
        walking_distance: route.walkDistance || 600,
        transfers: route.transfers || 0,
        cost: DEFAULT_TRIP_FARE,
        legs: this.transformBusLegs(route.legs || [], originLat, originLon, destLat, destLon)
      }));
    } catch (error) {
      console.error('Error transforming TheBus response:', error);
      return [];
    }
  }

  private transformBusLegs(legs: any[], originLat: number, originLon: number, destLat: number, destLon: number): any[] {
    if (!legs || legs.length === 0) {
      // Create basic transit leg if no detailed legs provided
      return [
        {
          mode: 'WALK',
          from: { lat: originLat, lon: originLon, name: 'Starting Location' },
          to: { lat: originLat + 0.001, lon: originLon + 0.001, name: 'Bus Stop' },
          duration: 300,
          distance: 200
        },
        {
          mode: 'TRANSIT',
          route: 'Bus',
          routeName: 'TheBus Route',
          from: { lat: originLat + 0.001, lon: originLon + 0.001, name: 'Bus Stop' },
          to: { lat: destLat - 0.001, lon: destLon - 0.001, name: 'Destination Stop' },
          duration: 2100,
          headsign: 'To Destination'
        },
        {
          mode: 'WALK',
          from: { lat: destLat - 0.001, lon: destLon - 0.001, name: 'Bus Stop' },
          to: { lat: destLat, lon: destLon, name: 'Destination' },
          duration: 300,
          distance: 200
        }
      ];
    }

    return legs.map((leg: any) => ({
      mode: leg.mode === 'TRANSIT' || leg.routeId ? 'TRANSIT' : 'WALK',
      route: leg.routeId || leg.route,
      routeName: leg.routeName || `Route ${leg.routeId || leg.route}`,
      from: {
        lat: leg.from?.lat || originLat,
        lon: leg.from?.lon || originLon,
        name: leg.from?.name || 'Location'
      },
      to: {
        lat: leg.to?.lat || destLat,
        lon: leg.to?.lon || destLon,
        name: leg.to?.name || 'Destination'
      },
      duration: leg.duration || 600,
      distance: leg.distance || 300,
      headsign: leg.headsign || leg.routeName
    }));
  }
  
  // Helper methods for coordinate detection
  private isInWestOahu(lat: number, lon: number): boolean {
    // Expanded range for West Oahu (Kapolei, Ewa Beach, etc.)
    console.log(`  🔍 West Oahu check: ${lat}, ${lon}`);
    return lat >= 21.29 && lat <= 21.37 && lon >= -158.15 && lon <= -157.95;
  }
  
  private isKoOlina(lat: number, lon: number): boolean {
    console.log(`  🔍 Ko Olina check: ${lat}, ${lon}`);
    // Ko Olina Resort area - expanded range
    return lat >= 21.315 && lat <= 21.325 && lon >= -158.135 && lon <= -158.115;
  }
  
  private isAlaMoana(lat: number, lon: number): boolean {
    // Ala Moana Center area
    console.log(`  🔍 Ala Moana check: ${lat}, ${lon}`);
    return lat >= 21.28 && lat <= 21.30 && lon >= -157.86 && lon <= -157.83;
  }
  
  private isInWaikiki(lat: number, lon: number): boolean {
    // Expanded Waikiki area
    console.log(`  🔍 Waikiki check: ${lat}, ${lon}`);
    return lat >= 21.26 && lat <= 21.29 && lon >= -157.84 && lon <= -157.81;
  }
  
  private isDiamondHead(lat: number, lon: number): boolean {
    console.log(`  🔍 Diamond Head check: ${lat}, ${lon}`);
    return lat >= 21.25 && lat <= 21.27 && lon >= -157.82 && lon <= -157.80; // Diamond Head area
  }
  
  private isHonoluluAirport(lat: number, lon: number): boolean {
    // HNL Airport area
    console.log(`  🔍 Airport check: ${lat}, ${lon}`);
    return lat >= 21.31 && lat <= 21.33 && lon >= -157.94 && lon <= -157.91;
  }
  
  private isInKalihi(lat: number, lon: number): boolean {
    // Kalihi area - north of downtown Honolulu
    console.log(`  🔍 Kalihi check: ${lat}, ${lon}`);
    return lat >= 21.32 && lat <= 21.34 && lon >= -157.88 && lon <= -157.85;
  }

  private async fetchTheBusRoutes(): Promise<BusRoute[]> {
    try {
      console.log('Attempting to fetch TheBus routes...');
      
      // Try multiple API endpoints with the valid key
      const endpoints = [
        `${this.theBusBaseUrl}/route/?appID=${this.theBusAppId}&format=json`,
        `${this.theBusBaseUrl}/route?appID=${this.theBusAppId}&format=json`,
        `https://api.thebus.org/gtfs-realtime/routes`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const headers: any = { 'Content-Type': 'application/json' };
          if (endpoint.includes('gtfs-realtime')) {
            headers['Authorization'] = `Bearer ${this.theBusAppId}`;
          }
          
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, { 
            headers
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('TheBus API success:', endpoint);
            
            if (data && Array.isArray(data)) {
              return data.map((route: any) => ({
                route_id: route.route || route.id || route.route_id,
                route_short_name: route.route || route.shortName || route.route_short_name,
                route_long_name: route.name || route.longName || route.route_long_name || 'Bus Route',
                route_desc: route.description || route.desc || '',
                route_type: 3, // Bus
                route_color: '0066CC',
                route_text_color: 'FFFFFF'
              }));
            }
          }
        } catch (endpointError) {
          console.error(`Endpoint ${endpoint} failed:`, endpointError);
        }
      }
      
      console.log('All API endpoints failed, using real route data');
      return this.getRealOahuRoutes();
    } catch (error) {
      console.error('Error fetching TheBus routes:', error);
      return this.getRealOahuRoutes();
    }
  }

  private getRealOahuRoutes(): BusRoute[] {
    // Real TheBus routes that actually exist on Oahu
    console.log('Using comprehensive real Oahu bus routes');
    return [
      {
        route_id: 'C',
        route_short_name: 'C',
        route_long_name: 'Country Express',
        route_desc: 'Express service from West Oahu (Kapolei) to Downtown Honolulu',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '40',
        route_short_name: '40',
        route_long_name: 'Honolulu-Ewa Beach Express',
        route_desc: 'Express service between West Oahu and Downtown/Ala Moana',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '42',
        route_short_name: '42',
        route_long_name: 'Ewa Beach-Waikiki',
        route_desc: 'Service from Ewa Beach to Waikiki via Ala Moana Center',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '20',
        route_short_name: '20',
        route_long_name: 'Airport-Hickam',
        route_desc: 'Airport service to Waikiki/Downtown via Nimitz Highway',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '23',
        route_short_name: '23',
        route_long_name: 'Hawaii Kai-Sea Life Park',
        route_desc: 'Service to Diamond Head, Hawaii Kai, and Sea Life Park',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '8',
        route_short_name: '8',
        route_long_name: 'Waikiki-Ala Moana',
        route_desc: 'Frequent service between Waikiki and Ala Moana Center',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '56',
        route_short_name: '56',
        route_long_name: 'Kailua-Kaneohe',
        route_desc: 'Service to Kailua Beach and Lanikai via Pali Highway',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '57',
        route_short_name: '57',
        route_long_name: 'Kailua-Sea Life Park',
        route_desc: 'Alternative service to Kailua via Kalanianaole Highway',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '19',
        route_short_name: '19',
        route_long_name: 'Airport-Hickam-Arizona Memorial',
        route_desc: 'Airport and Pearl Harbor service',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '1',
        route_short_name: '1',
        route_long_name: 'Kalihi-Palama-Downtown',
        route_desc: 'Service to Kalihi and downtown areas',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      }
    ];
  }


  private async fetchNearbyStops(lat: number, lon: number, radius: number): Promise<BusStop[]> {
    try {
      // TODO: Implement real TheBus stops API call
      console.log(`Real TheBus API integration needed for stops near ${lat}, ${lon}`);
      return [];
    } catch (error) {
      console.error('Error fetching nearby stops:', error);
      return [];
    }
  }

  private async fetchStopArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      console.log(`Fetching real arrivals for stop ${stopId}...`);
      const response = await fetch(`${this.theBusBaseUrl}/arrivals?appID=${this.theBusAppId}&stop=${stopId}&format=json`);
      
      if (!response.ok) {
        console.error(`TheBus arrivals API error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      console.log('TheBus arrivals response:', data);
      
      // Transform TheBus arrivals to our format
      if (data && Array.isArray(data)) {
        return data.map((arrival: any) => ({
          route_id: arrival.route || arrival.routeId,
          route_name: arrival.headsign || arrival.routeName || `Route ${arrival.route}`,
          stop_id: stopId,
          stop_name: arrival.stopName || 'Bus Stop',
          arrival_time: arrival.arrivalTime || arrival.arrival_time,
          departure_time: arrival.departureTime || arrival.arrival_time,
          realtime_arrival: arrival.estimated || arrival.realtime_arrival,
          delay_minutes: arrival.delay || 0,
          vehicle_id: arrival.vehicle || arrival.vehicleId,
          direction: arrival.direction || 'inbound',
          headsign: arrival.headsign || `Route ${arrival.route}`
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching stop arrivals:', error);
      return [];
    }
  }

  private async fetchTheBusAlerts(): Promise<ServiceAlert[]> {
    try {
      // TODO: Implement real TheBus alerts API call
      console.log('Real TheBus API integration needed for service alerts');
      return [];
    } catch (error) {
      console.error('Error fetching TheBus alerts:', error);
      return [];
    }
  }

  private async fetchSkylineAlerts(): Promise<ServiceAlert[]> {
    try {
      // TODO: Implement real HART Skyline alerts API call
      console.log('Real HART Skyline API integration needed for service alerts');
      return [];
    } catch (error) {
      console.error('Error fetching HART Skyline alerts:', error);
      return [];
    }
  }
}