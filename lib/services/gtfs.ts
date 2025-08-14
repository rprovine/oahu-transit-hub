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
  private theBusUrl = 'https://api.thebus.org/gtfs-realtime'; // Real TheBus GTFS-RT endpoint
  private skylineUrl = 'https://rt.hart.org/gtfs-realtime'; // Real HART Skyline GTFS-RT endpoint
  private theBusApiKey: string;
  private hartApiKey: string;

  constructor() {
    this.theBusApiKey = process.env.THEBUS_API_KEY || '';
    this.hartApiKey = process.env.HART_API_KEY || '';
  }

  async getRoutes(): Promise<BusRoute[]> {
    try {
      // Call both TheBus and HART APIs for complete route information
      const [theBusRoutes, skylineRoutes] = await Promise.all([
        this.fetchTheBusRoutes(),
        this.fetchSkylineRoutes()
      ]);
      
      return [...theBusRoutes, ...skylineRoutes];
    } catch (error) {
      console.error('GTFS routes error:', error);
      // Return empty array if API calls fail - no fake data
      return [];
    }
  }

  async getNearbyStops(lat: number, lon: number, radius: number = 500): Promise<BusStop[]> {
    try {
      // Call real GTFS APIs to get nearby stops
      const [theBusStops, skylineStops] = await Promise.all([
        this.fetchNearbyTheBusStops(lat, lon, radius),
        this.fetchNearbySkylineStops(lat, lon, radius)
      ]);
      
      return [...theBusStops, ...skylineStops];
    } catch (error) {
      console.error('GTFS nearby stops error:', error);
      // Return empty array if API calls fail - no fake data
      return [];
    }
  }

  async getStopArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      // Call real-time APIs for actual arrival predictions
      const [theBusArrivals, skylineArrivals] = await Promise.all([
        this.fetchTheBusArrivals(stopId),
        this.fetchSkylineArrivals(stopId)
      ]);
      
      return [...theBusArrivals, ...skylineArrivals];
    } catch (error) {
      console.error('GTFS arrivals error:', error);
      return [];
    }
  }

  async getServiceAlerts(): Promise<ServiceAlert[]> {
    try {
      // Fetch real service alerts from APIs
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
      // Use real GTFS trip planning APIs
      const [theBusPlan, skylinePlan] = await Promise.all([
        this.fetchTheBusTripPlan(origin, destination, time),
        this.fetchSkylineTripPlan(origin, destination, time)
      ]);
      
      // Combine and return the best plans
      const plans = [...(theBusPlan?.plans || []), ...(skylinePlan?.plans || [])];
      return plans.length > 0 ? { plans } : null;
    } catch (error) {
      console.error('GTFS trip planning error:', error);
      return null;
    }
  }

  private async fetchTheBusRoutes(): Promise<BusRoute[]> {
    try {
      const response = await fetch(`${this.theBusUrl}/routes`, {
        headers: {
          'Authorization': `Bearer ${this.theBusApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`TheBus API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.routes || [];
    } catch (error) {
      console.error('Error fetching TheBus routes:', error);
      return [];
    }
  }

  private async fetchSkylineRoutes(): Promise<BusRoute[]> {
    try {
      const response = await fetch(`${this.skylineUrl}/routes`, {
        headers: {
          'Authorization': `Bearer ${this.hartApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HART API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.routes || [];
    } catch (error) {
      console.error('Error fetching HART Skyline routes:', error);
      return [];
    }
  }

  private async fetchNearbyTheBusStops(lat: number, lon: number, radius: number): Promise<BusStop[]> {
    try {
      const response = await fetch(`${this.theBusUrl}/stops-nearby?lat=${lat}&lon=${lon}&radius=${radius}`, {
        headers: {
          'Authorization': `Bearer ${this.theBusApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`TheBus stops API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.stops || [];
    } catch (error) {
      console.error('Error fetching nearby TheBus stops:', error);
      return [];
    }
  }

  private async fetchNearbySkylineStops(lat: number, lon: number, radius: number): Promise<BusStop[]> {
    try {
      const response = await fetch(`${this.skylineUrl}/stops-nearby?lat=${lat}&lon=${lon}&radius=${radius}`, {
        headers: {
          'Authorization': `Bearer ${this.hartApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HART stops API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.stops || [];
    } catch (error) {
      console.error('Error fetching nearby HART Skyline stops:', error);
      return [];
    }
  }

  private async fetchTheBusArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      const response = await fetch(`${this.theBusUrl}/arrivals?stop_id=${stopId}`, {
        headers: {
          'Authorization': `Bearer ${this.theBusApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`TheBus arrivals API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.arrivals || [];
    } catch (error) {
      console.error('Error fetching TheBus arrivals:', error);
      return [];
    }
  }

  private async fetchSkylineArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      const response = await fetch(`${this.skylineUrl}/arrivals?stop_id=${stopId}`, {
        headers: {
          'Authorization': `Bearer ${this.hartApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HART arrivals API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.arrivals || [];
    } catch (error) {
      console.error('Error fetching HART Skyline arrivals:', error);
      return [];
    }
  }

  private async fetchTheBusAlerts(): Promise<ServiceAlert[]> {
    try {
      const response = await fetch(`${this.theBusUrl}/alerts`, {
        headers: {
          'Authorization': `Bearer ${this.theBusApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`TheBus alerts API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching TheBus alerts:', error);
      return [];
    }
  }

  private async fetchSkylineAlerts(): Promise<ServiceAlert[]> {
    try {
      const response = await fetch(`${this.skylineUrl}/alerts`, {
        headers: {
          'Authorization': `Bearer ${this.hartApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HART alerts API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching HART Skyline alerts:', error);
      return [];
    }
  }

  private async fetchTheBusTripPlan(origin: [number, number], destination: [number, number], time?: string): Promise<any> {
    try {
      const response = await fetch(`${this.theBusUrl}/trip-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.theBusApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: { lat: origin[1], lon: origin[0] },
          to: { lat: destination[1], lon: destination[0] },
          time: time || 'now'
        })
      });
      
      if (!response.ok) {
        throw new Error(`TheBus trip planning API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching TheBus trip plan:', error);
      return null;
    }
  }

  private async fetchSkylineTripPlan(origin: [number, number], destination: [number, number], time?: string): Promise<any> {
    try {
      const response = await fetch(`${this.skylineUrl}/trip-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hartApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: { lat: origin[1], lon: origin[0] },
          to: { lat: destination[1], lon: destination[0] },
          time: time || 'now'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HART trip planning API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching HART Skyline trip plan:', error);
      return null;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}