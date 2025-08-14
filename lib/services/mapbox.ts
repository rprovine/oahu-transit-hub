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

export class MapboxService {
  private accessToken: string;
  private baseUrl = 'https://api.mapbox.com';

  constructor() {
    this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
  }

  async geocodeAddress(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // Bias results toward Oahu
      const proximity = bias || [-157.8583, 21.3099]; // Honolulu coordinates
      const bbox = [-158.2878,21.2044,-157.6417,21.7135]; // Oahu bounding box
      
      const response = await fetch(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
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
    } catch (error) {
      console.error('Geocoding error:', error);
      return this.getFallbackSuggestions(query);
    }
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
            cost: 2.75
          }
        ]
      };
    } catch (error) {
      console.error('Transit directions error:', error);
      return { routes: [] };
    }
  }

  private getFallbackSuggestions(query: string): LocationSuggestion[] {
    const oahuLocations = [
      { text: 'Waikiki Beach', place_name: 'Waikiki Beach, Honolulu, HI', center: [-157.8293, 21.2793] },
      { text: 'Ala Moana Center', place_name: 'Ala Moana Center, Honolulu, HI', center: [-157.8420, 21.2906] },
      { text: 'University of Hawaii', place_name: 'University of Hawaii at Manoa, Honolulu, HI', center: [-157.8167, 21.2969] },
      { text: 'Diamond Head', place_name: 'Diamond Head State Monument, Honolulu, HI', center: [-157.8055, 21.2619] },
      { text: 'Pearl Harbor', place_name: 'Pearl Harbor, HI', center: [-157.9623, 21.3649] },
      { text: 'Kailua Beach', place_name: 'Kailua Beach, Kailua, HI', center: [-157.7394, 21.3972] },
      { text: 'North Shore', place_name: 'North Shore, Haleiwa, HI', center: [-158.0430, 21.5944] }
    ].filter(loc => 
      loc.text.toLowerCase().includes(query.toLowerCase()) ||
      loc.place_name.toLowerCase().includes(query.toLowerCase())
    );

    return oahuLocations.map((loc, index) => ({
      id: `fallback-${index}`,
      text: loc.text,
      place_name: loc.place_name,
      center: loc.center as [number, number],
      properties: {}
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