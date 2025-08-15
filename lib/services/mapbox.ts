interface LocationSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties: {
    category?: string;
    landmark?: boolean;
    address?: string;
  };
}

interface RouteOptions {
  origin: [number, number];
  destination: [number, number];
  profile: 'walking' | 'cycling' | 'driving' | 'transit';
  alternatives?: boolean;
  steps?: boolean;
}

interface Route {
  duration: number; // in seconds
  distance: number; // in meters
  geometry: string; // encoded polyline
  steps?: RouteStep[];
  legs: RouteLeg[];
}

interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  maneuver: {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
    location: [number, number];
  };
}

interface RouteLeg {
  distance: number;
  duration: number;
  steps: RouteStep[];
}

import { findDestination, TOURIST_DESTINATIONS } from '@/lib/data/tourist-destinations';
import { DEFAULT_TRIP_FARE } from '@/lib/constants/transit-fares';

export class MapboxService {
  private accessToken: string;
  private baseUrl = 'https://api.mapbox.com';

  constructor() {
    this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.error('⚠️ WARNING: No Mapbox access token found! API calls will fail and use fallback.');
    } else {
      console.log('✅ Mapbox service initialized with token:', this.accessToken.substring(0, 10) + '...');
    }
  }

  async geocodeAddress(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // Use Mapbox API directly with query expansion
      return await this.getMapboxSuggestions(query, bias);
    } catch (error) {
      console.error('Geocoding error:', error);
      // Try tourist destinations as fallback
      const touristDest = findDestination(query);
      if (touristDest) {
        return [{
          id: `tourist-${touristDest.name}`,
          text: touristDest.name,
          place_name: `${touristDest.name}, Honolulu, HI`,
          center: touristDest.coordinates,
          properties: {
            category: touristDest.category,
            landmark: true
          }
        }];
      }
      return this.getFallbackSuggestions(query);
    }
  }

  private async getMapboxSuggestions(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    // Clean up the query - remove duplicates of Hawaii/United States
    let searchQuery = query
      .replace(/, United States/gi, '')
      .replace(/, USA/gi, '')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Ensure proper Hawaii context for better Mapbox results
    // Check if Hawaii context is missing
    const hasHawaiiContext = searchQuery.toLowerCase().includes('hawaii') || 
                            searchQuery.toLowerCase().includes(', hi') ||
                            searchQuery.toLowerCase().includes(' hi ') ||
                            searchQuery.toLowerCase().includes('honolulu') ||
                            searchQuery.toLowerCase().includes('oahu');
    
    // Add Hawaii context if missing - this helps Mapbox find the right location
    if (!hasHawaiiContext) {
      // Check if it's a city-specific query
      if (searchQuery.toLowerCase().includes('kapolei') || 
          searchQuery.toLowerCase().includes('aiea') || 
          searchQuery.toLowerCase().includes('pearl city') ||
          searchQuery.toLowerCase().includes('kaneohe') ||
          searchQuery.toLowerCase().includes('kailua')) {
        searchQuery = `${searchQuery}, Hawaii`;
      } else if (searchQuery.toLowerCase().includes('waikiki') ||
                 searchQuery.toLowerCase().includes('diamond head') ||
                 searchQuery.toLowerCase().includes('ala moana')) {
        searchQuery = `${searchQuery}, Honolulu, Hawaii`;
      } else {
        // Default to adding Hawaii for context
        searchQuery = `${searchQuery}, Hawaii`;
      }
    }
    
    // Use appropriate proximity bias based on location
    let proximity = bias || [-157.8583, 21.3099]; // Default to Honolulu
    
    // Adjust proximity for known areas to improve results
    const queryLower = searchQuery.toLowerCase();
    if (queryLower.includes('kapolei')) {
      proximity = [-158.086, 21.3285];
    } else if (queryLower.includes('pearl')) {
      proximity = [-157.9623, 21.3649];
    } else if (queryLower.includes('waikiki')) {
      proximity = [-157.8294, 21.2793];
    } else if (queryLower.includes('kailua')) {
      proximity = [-157.7394, 21.3972];
    } else if (queryLower.includes('kaneohe')) {
      proximity = [-157.8036, 21.4098];
    }
    
    const bbox = [-158.2878,21.2044,-157.6417,21.7135]; // Oahu bounding box
    
    console.log('Mapbox query:', searchQuery, 'Proximity:', proximity);
    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
      `access_token=${this.accessToken}&` +
      `proximity=${proximity[0]},${proximity[1]}&` +
      `bbox=${bbox.join(',')}&` +
      `country=US&` +
      `limit=10&` +
      `types=address,poi,place,locality,neighborhood&` +
      `language=en`;
    
    console.log('Mapbox URL:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Mapbox API error:', response.status, response.statusText);
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    console.log(`Mapbox returned ${data.features?.length || 0} results for "${searchQuery}"`);
    
    // Log the first result for debugging
    if (data.features?.length > 0) {
      console.log('First result:', {
        text: data.features[0].text,
        place_name: data.features[0].place_name,
        center: data.features[0].center,
        relevance: data.features[0].relevance
      });
    }
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      text: feature.text,
      place_name: feature.place_name,
      center: feature.center,
      properties: {
        category: feature.properties?.category,
        landmark: feature.properties?.landmark,
        address: feature.properties?.address
      }
    }));
  }

  async getDirections(options: RouteOptions): Promise<Route[]> {
    try {
      const { origin, destination, profile, alternatives = true, steps = true } = options;
      
      console.log('🗺️ Mapbox getDirections called with:', {
        origin,
        destination,
        profile,
        originLonLat: `[${origin[0]}, ${origin[1]}]`,
        destLonLat: `[${destination[0]}, ${destination[1]}]`
      });
      
      const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
      
      const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordinates}?` +
        `access_token=${this.accessToken}&` +
        `alternatives=${alternatives}&` +
        `steps=${steps}&` +
        `geometries=geojson&` +
        `overview=full`;
      
      console.log('📍 Mapbox API URL:', url.replace(this.accessToken, 'REDACTED'));
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error('❌ Mapbox API failed:', response.status, response.statusText);
        throw new Error('Directions failed');
      }

      const data = await response.json();
      
      console.log('✅ Mapbox API response:', {
        routes: data.routes?.length || 0,
        firstRouteDistance: data.routes?.[0]?.distance,
        firstRouteDuration: data.routes?.[0]?.duration,
        distanceInKm: data.routes?.[0]?.distance ? (data.routes[0].distance / 1000).toFixed(2) : 'N/A',
        rawResponse: data.routes?.[0] // Log the full first route for debugging
      });
      
      return data.routes.map((route: any) => ({
        duration: route.duration,
        distance: route.distance,
        geometry: route.geometry,
        steps: route.legs[0]?.steps?.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.maneuver.instruction,
          maneuver: step.maneuver
        })),
        legs: route.legs
      }));
    } catch (error) {
      console.error('❌ Directions error, using fallback:', error);
      return this.getFallbackRoute(options);
    }
  }

  async getTransitDirections(origin: [number, number], destination: [number, number]): Promise<any> {
    // For now, we'll integrate with Oahu's transit system
    // This would typically connect to GTFS or a transit API
    try {
      // Mock implementation - in reality, this would call TheHandi-Van API or similar
      return {
        routes: [
          {
            id: 'route-1',
            duration: 1800, // 30 minutes
            transfers: 1,
            legs: [
              {
                mode: 'WALK',
                duration: 300,
                distance: 400,
                from: { name: 'Origin' },
                to: { name: 'Bus Stop A' }
              },
              {
                mode: 'BUS',
                duration: 1200,
                route: 'Route 8',
                from: { name: 'Bus Stop A' },
                to: { name: 'Bus Stop B' }
              },
              {
                mode: 'WALK',
                duration: 300,
                distance: 300,
                from: { name: 'Bus Stop B' },
                to: { name: 'Destination' }
              }
            ],
            cost: DEFAULT_TRIP_FARE // $3.00 with free transfers
          }
        ]
      };
    } catch (error) {
      console.error('Transit directions error:', error);
      return { routes: [] };
    }
  }

  private getFallbackSuggestions(query: string): LocationSuggestion[] {
    // Use our verified tourist destinations
    const normalizedQuery = query.toLowerCase().trim();
    const matchingDestinations = TOURIST_DESTINATIONS.filter(dest => 
      dest.name.toLowerCase().includes(normalizedQuery) ||
      dest.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))
    );

    return matchingDestinations.map((dest, index) => ({
      id: `fallback-${index}`,
      text: dest.name,
      place_name: `${dest.name}, Honolulu, HI`,
      center: dest.coordinates,
      properties: {
        category: dest.category,
        landmark: true
      }
    }));
  }

  private getFallbackRoute(options: RouteOptions): Route[] {
    console.log('⚠️ Using fallback route calculation for:', {
      origin: options.origin,
      destination: options.destination,
      profile: options.profile
    });
    
    // Simple fallback route calculation
    const distanceMiles = this.calculateDistance(options.origin, options.destination);
    const distanceMeters = distanceMiles * 1609.34;
    const durationMinutes = distanceMiles * (options.profile === 'walking' ? 20 : options.profile === 'cycling' ? 4 : 2); // rough estimates
    
    console.log('📏 Fallback distance calculation:', {
      distanceMiles: distanceMiles.toFixed(2),
      distanceMeters: distanceMeters.toFixed(0),
      distanceKm: (distanceMeters / 1000).toFixed(2),
      durationMinutes: durationMinutes.toFixed(0)
    });

    return [{
      duration: Math.round(durationMinutes * 60), // convert to seconds
      distance: Math.round(distanceMiles * 1609.34), // convert miles to meters
      geometry: '', // would need actual polyline
      legs: [{
        distance: Math.round(distanceMiles * 1609.34), // convert miles to meters
        duration: Math.round(durationMinutes * 60),
        steps: []
      }]
    }];
  }

  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.deg2rad(coord2[1] - coord1[1]);
    const dLon = this.deg2rad(coord2[0] - coord1[0]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1[1])) * Math.cos(this.deg2rad(coord2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Oahu-specific common destinations
  static getCommonDestinations() {
    return [
      { name: 'Waikiki Beach', coords: [-157.8293, 21.2793] },
      { name: 'Ala Moana Center', coords: [-157.8420, 21.2906] },
      { name: 'Honolulu Airport (HNL)', coords: [-157.9180, 21.3187] },
      { name: 'University of Hawaii', coords: [-157.8167, 21.2969] },
      { name: 'Downtown Honolulu', coords: [-157.8583, 21.3099] },
      { name: 'Pearl Harbor', coords: [-157.9623, 21.3649] },
      { name: 'Kailua Beach', coords: [-157.7394, 21.3972] },
      { name: 'Hanauma Bay', coords: [-157.6942, 21.2693] },
      { name: 'Diamond Head', coords: [-157.8055, 21.2619] },
      { name: 'North Shore (Haleiwa)', coords: [-158.0430, 21.5944] }
    ];
  }
}