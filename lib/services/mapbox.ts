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
  }

  async geocodeAddress(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // First, check if this is a known tourist destination
      const touristDest = findDestination(query);
      if (touristDest) {
        // Return the verified coordinates as the first result
        const touristSuggestion: LocationSuggestion = {
          id: `tourist-${touristDest.name}`,
          text: touristDest.name,
          place_name: `${touristDest.name}, Honolulu, HI`,
          center: touristDest.coordinates,
          properties: {
            category: touristDest.category,
            landmark: true
          }
        };
        
        // Also get Mapbox suggestions but tourist destination comes first
        const mapboxSuggestions = await this.getMapboxSuggestions(query, bias);
        return [touristSuggestion, ...mapboxSuggestions.filter(s => 
          !s.text.toLowerCase().includes(touristDest.name.toLowerCase())
        )];
      }
      
      // If not a known tourist destination, use Mapbox API
      return await this.getMapboxSuggestions(query, bias);
    } catch (error) {
      console.error('Geocoding error:', error);
      return this.getFallbackSuggestions(query);
    }
  }

  private async getMapboxSuggestions(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    // Clean up the query - remove duplicates of Hawaii/United States
    let searchQuery = query
      .replace(/, United States/gi, '')
      .replace(/, USA/gi, '')
      .trim();
    
    // Ensure Hawaii context is in the query
    if (!searchQuery.toLowerCase().includes('hawaii') && 
        !searchQuery.toLowerCase().includes(' hi ') &&
        !searchQuery.toLowerCase().includes(', hi')) {
      searchQuery = `${searchQuery}, Hawaii`;
    }
    
    // Known problematic addresses - return corrected coordinates
    if (searchQuery.toLowerCase().includes('91-1020 palala') || 
        (searchQuery.toLowerCase().includes('palala') && searchQuery.toLowerCase().includes('kapolei'))) {
      // This is near KAMOKILA BL + KAPOLEI PKWY bus stop
      return [{
        id: 'corrected-kapolei-palala',
        text: '91-1020 Palala Street',
        place_name: '91-1020 Palala Street, Kapolei, HI 96707',
        center: [-158.0865, 21.3283], // Corrected coordinates near bus stop
        properties: {
          address: '91-1020 Palala Street'
        }
      }];
    }
    
    if (searchQuery.toLowerCase().includes('845 gulick') || 
        (searchQuery.toLowerCase().includes('gulick') && searchQuery.toLowerCase().includes('honolulu'))) {
      // This is near DILLINGHAM BL + MCNEILL ST bus stop
      return [{
        id: 'corrected-gulick',
        text: '845 Gulick Avenue',
        place_name: '845 Gulick Avenue, Honolulu, HI 96819',
        center: [-157.8775, 21.3246], // Corrected coordinates near bus stop
        properties: {
          address: '845 Gulick Avenue'
        }
      }];
    }
    
    // For Kapolei addresses, use specific bias
    const isKapolei = searchQuery.toLowerCase().includes('kapolei');
    const proximity = isKapolei ? [-158.086, 21.3285] : (bias || [-157.8583, 21.3099]);
    const bbox = [-158.2878,21.2044,-157.6417,21.7135]; // Oahu bounding box
    
    const response = await fetch(
      `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
      `access_token=${this.accessToken}&` +
      `proximity=${proximity[0]},${proximity[1]}&` +
      `bbox=${bbox.join(',')}&` +
      `country=US&` +
      `limit=8&` +
      `types=address,poi,place`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();
    
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
      
      const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
      
      const response = await fetch(
        `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordinates}?` +
        `access_token=${this.accessToken}&` +
        `alternatives=${alternatives}&` +
        `steps=${steps}&` +
        `geometries=geojson&` +
        `overview=full`
      );

      if (!response.ok) throw new Error('Directions failed');

      const data = await response.json();
      
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
      console.error('Directions error:', error);
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
    // Simple fallback route calculation
    const distance = this.calculateDistance(options.origin, options.destination);
    const duration = distance * (options.profile === 'walking' ? 12 : options.profile === 'cycling' ? 4 : 2); // rough estimates

    return [{
      duration: Math.round(duration * 60), // convert to seconds
      distance: Math.round(distance * 1000), // convert to meters
      geometry: '', // would need actual polyline
      legs: [{
        distance: Math.round(distance * 1000),
        duration: Math.round(duration * 60),
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