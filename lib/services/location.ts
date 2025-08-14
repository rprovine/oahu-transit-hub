// Real-time location service for contextual experiences
import { TouristDestination, getNearbyDestinations } from '@/lib/data/tourist-destinations';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  district?: string;
  islandRegion?: 'Honolulu' | 'Windward' | 'North Shore' | 'Leeward' | 'Central';
}

export interface LocationContext {
  location: UserLocation;
  nearbyDestinations: TouristDestination[];
  currentWeather?: any;
  transitOptions: {
    nearbyStops: any[];
    walkingDistance: number;
  };
  culturalContext?: {
    historicalSignificance: string;
    respectfulBehavior: string[];
  };
  sustainabilityTips: string[];
  crowdAlerts?: {
    level: 'Low' | 'Medium' | 'High';
    message: string;
    alternatives?: string[];
  };
}

export class LocationService {
  private currentLocation: UserLocation | null = null;
  private watchId: number | null = null;
  private locationCallbacks: ((location: UserLocation) => void)[] = [];

  constructor() {
    this.startLocationTracking();
  }

  // Start continuous location tracking
  async startLocationTracking(): Promise<void> {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    // Get initial position
    try {
      const position = await this.getCurrentPosition();
      this.currentLocation = await this.enrichLocationData(position);
      this.notifyLocationCallbacks();
    } catch (error) {
      console.error('Initial location failed:', error);
    }

    // Watch for location changes
    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        this.currentLocation = await this.enrichLocationData(position);
        this.notifyLocationCallbacks();
      },
      (error) => console.error('Location watch error:', error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // 30 seconds
      }
    );
  }

  // Get comprehensive location context
  async getLocationContext(): Promise<LocationContext | null> {
    if (!this.currentLocation) {
      await this.refreshLocation();
      if (!this.currentLocation) return null;
    }

    const context: LocationContext = {
      location: this.currentLocation,
      nearbyDestinations: getNearbyDestinations([
        this.currentLocation.longitude,
        this.currentLocation.latitude
      ], 2), // 2km radius
      transitOptions: await this.getNearbyTransitOptions(),
      sustainabilityTips: this.getLocationBasedSustainabilityTips(),
    };

    // Add weather if available
    try {
      const weather = await this.getCurrentWeather();
      context.currentWeather = weather;
    } catch (error) {
      console.log('Weather unavailable for location context');
    }

    // Add cultural context
    context.culturalContext = this.getCulturalContext();

    // Add crowd alerts
    context.crowdAlerts = await this.getCrowdAlerts();

    return context;
  }

  // Enhanced destination routing with real-time location
  async getDirectionsFromCurrentLocation(destinationName: string): Promise<any> {
    if (!this.currentLocation) {
      await this.refreshLocation();
      if (!this.currentLocation) {
        throw new Error('Location unavailable for directions');
      }
    }

    // Get destination coordinates
    const destination = await this.geocodeDestination(destinationName);
    if (!destination) {
      throw new Error('Destination not found');
    }

    // Plan trip with real-time location
    const tripPlan = await fetch('/api/transit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'plan_trip',
        origin: {
          lat: this.currentLocation.latitude,
          lon: this.currentLocation.longitude
        },
        destination: {
          lat: destination.coordinates[1],
          lon: destination.coordinates[0]
        }
      })
    });

    const result = await tripPlan.json();
    
    // Enhance with location-based context
    if (result.success && result.tripPlan) {
      result.locationContext = {
        startingFrom: this.currentLocation.address || 'Your current location',
        district: this.currentLocation.district,
        walkingToStop: this.calculateWalkingTime(result.tripPlan.plans[0]?.legs[0]),
        culturalTips: this.getCulturalTipsForRoute(destination),
        sustainabilityInfo: this.getSustainabilityInfoForTrip(result.tripPlan)
      };
    }

    return result;
  }

  // Smart recommendations based on current location
  async getSmartRecommendations(): Promise<any> {
    if (!this.currentLocation) return [];

    const context = await this.getLocationContext();
    if (!context) return [];

    const recommendations = [];

    // Time-based recommendations
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 9) {
      recommendations.push({
        type: 'morning',
        title: 'Perfect Morning Activity',
        suggestion: this.getMorningRecommendation(context),
        reason: 'Great lighting and fewer crowds'
      });
    }

    // Weather-based recommendations
    if (context.currentWeather) {
      recommendations.push(...this.getWeatherBasedRecommendations(context));
    }

    // Crowd-based recommendations
    if (context.crowdAlerts?.level === 'High') {
      recommendations.push({
        type: 'alternative',
        title: 'Beat the Crowds',
        suggestion: context.crowdAlerts.alternatives,
        reason: 'Nearby attractions are less crowded right now'
      });
    }

    // Cultural event recommendations
    recommendations.push(...await this.getCulturalEventRecommendations(context));

    return recommendations;
  }

  // Register for location updates
  onLocationUpdate(callback: (location: UserLocation) => void): void {
    this.locationCallbacks.push(callback);
    
    // Immediately call with current location if available
    if (this.currentLocation) {
      callback(this.currentLocation);
    }
  }

  // Clean up
  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Private helper methods
  private async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  private async enrichLocationData(position: GeolocationPosition): Promise<UserLocation> {
    const location: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };

    // Reverse geocode to get address
    try {
      const response = await fetch(
        `/api/geocode?lat=${location.latitude}&lon=${location.longitude}&reverse=true`
      );
      const data = await response.json();
      
      if (data.success) {
        location.address = data.address;
        location.district = this.determineDistrict(location.latitude, location.longitude);
        location.islandRegion = this.determineIslandRegion(location.latitude, location.longitude);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }

    return location;
  }

  private determineDistrict(lat: number, lon: number): string {
    // Oahu district boundaries (approximate)
    if (lat >= 21.25 && lat <= 21.35 && lon >= -157.9 && lon <= -157.8) {
      return 'Waikiki/Honolulu';
    } else if (lat >= 21.35 && lat <= 21.45 && lon >= -157.8 && lon <= -157.7) {
      return 'Kailua/Windward';
    } else if (lat >= 21.55 && lat <= 21.65 && lon >= -158.3 && lon <= -157.9) {
      return 'North Shore';
    } else if (lon <= -158.0) {
      return 'West/Leeward Oahu';
    } else {
      return 'Central Oahu';
    }
  }

  private determineIslandRegion(lat: number, lon: number): 'Honolulu' | 'Windward' | 'North Shore' | 'Leeward' | 'Central' {
    if (lat >= 21.55) return 'North Shore';
    if (lon >= -157.8) return 'Windward';
    if (lon <= -158.0) return 'Leeward';
    if (lat >= 21.25 && lat <= 21.35 && lon >= -157.9 && lon <= -157.8) return 'Honolulu';
    return 'Central';
  }

  private async getNearbyTransitOptions(): Promise<{ nearbyStops: any[], walkingDistance: number }> {
    if (!this.currentLocation) return { nearbyStops: [], walkingDistance: 0 };

    try {
      const response = await fetch(
        `/api/transit?action=nearby_stops&lat=${this.currentLocation.latitude}&lon=${this.currentLocation.longitude}&radius=400`
      );
      const data = await response.json();
      
      return {
        nearbyStops: data.success ? data.stops : [],
        walkingDistance: data.stops?.[0] ? this.calculateDistance(
          [this.currentLocation.longitude, this.currentLocation.latitude],
          [data.stops[0].stop_lon, data.stops[0].stop_lat]
        ) : 0
      };
    } catch (error) {
      console.error('Transit options failed:', error);
      return { nearbyStops: [], walkingDistance: 0 };
    }
  }

  private getLocationBasedSustainabilityTips(): string[] {
    if (!this.currentLocation) return [];

    const tips = [
      'Use public transit to reduce your carbon footprint',
      'Bring a reusable water bottle to reduce plastic waste'
    ];

    // Region-specific tips
    if (this.currentLocation.islandRegion === 'North Shore') {
      tips.push('Respect turtle nesting areas on beaches');
    } else if (this.currentLocation.district?.includes('Waikiki')) {
      tips.push('Choose reef-safe sunscreen to protect coral reefs');
    }

    return tips;
  }

  private getCulturalContext(): { historicalSignificance: string; respectfulBehavior: string[] } {
    if (!this.currentLocation) {
      return {
        historicalSignificance: 'You are on the sacred land of Oahu, home to Native Hawaiian culture.',
        respectfulBehavior: ['Respect local customs', 'Learn basic Hawaiian words']
      };
    }

    const region = this.currentLocation.islandRegion;
    
    const contexts = {
      'Honolulu': {
        historicalSignificance: 'You are in Honolulu, the historic capital of the Hawaiian Kingdom.',
        respectfulBehavior: ['Remove shoes when entering homes', 'Respect sacred sites', 'Learn about Hawaiian sovereignty']
      },
      'Windward': {
        historicalSignificance: 'You are on the windward side, traditionally known for fishing and farming communities.',
        respectfulBehavior: ['Respect residential areas', 'Keep beaches clean', 'Be mindful of local fishing spots']
      },
      'North Shore': {
        historicalSignificance: 'You are on the North Shore, sacred to surfers and home to ancient Hawaiian settlements.',
        respectfulBehavior: ['Respect surf lineup etiquette', 'Protect turtle habitats', 'Support local businesses']
      },
      'Leeward': {
        historicalSignificance: 'You are on the leeward side, traditionally drier and home to important cultural sites.',
        respectfulBehavior: ['Conserve water', 'Respect ancient Hawaiian sites', 'Be mindful of wildlife']
      },
      'Central': {
        historicalSignificance: 'You are in central Oahu, important for agriculture and transportation.',
        respectfulBehavior: ['Respect agricultural areas', 'Support local farmers', 'Use designated trails']
      }
    };

    return contexts[region || 'Honolulu'] || contexts['Honolulu'];
  }

  private async getCrowdAlerts(): Promise<{ level: 'Low' | 'Medium' | 'High'; message: string; alternatives?: string[] } | undefined> {
    // This would integrate with real-time crowd data
    // For now, return time-based estimates
    const hour = new Date().getHours();
    
    if (hour >= 10 && hour <= 14) {
      return {
        level: 'High',
        message: 'Popular attractions are busy during midday hours',
        alternatives: ['Visit less crowded local spots', 'Try beach activities', 'Explore cultural sites']
      };
    }
    
    return undefined;
  }

  private async refreshLocation(): Promise<void> {
    try {
      const position = await this.getCurrentPosition();
      this.currentLocation = await this.enrichLocationData(position);
    } catch (error) {
      console.error('Location refresh failed:', error);
    }
  }

  private notifyLocationCallbacks(): void {
    if (this.currentLocation) {
      this.locationCallbacks.forEach(callback => callback(this.currentLocation!));
    }
  }

  private async geocodeDestination(name: string): Promise<TouristDestination | null> {
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(name)}`);
      const data = await response.json();
      
      if (data.success && data.suggestions.length > 0) {
        const suggestion = data.suggestions[0];
        return {
          name: suggestion.text,
          aliases: [],
          coordinates: suggestion.center,
          category: suggestion.properties?.category || 'Unknown',
          description: ''
        };
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
    
    return null;
  }

  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateWalkingTime(leg: any): string {
    if (leg?.mode === 'WALK' && leg?.duration) {
      const minutes = Math.ceil(leg.duration / 60);
      return `${minutes} minute walk`;
    }
    return 'Short walk';
  }

  private getCulturalTipsForRoute(destination: TouristDestination): string[] {
    return [
      `You're visiting ${destination.name}`,
      'Respect local customs and sacred spaces',
      'Support local businesses along your route'
    ];
  }

  private getSustainabilityInfoForTrip(tripPlan: any): any {
    return {
      carbonSaved: 'Using public transit saves approximately 2.5kg CO2 vs driving',
      reefProtection: 'Thank you for choosing sustainable transportation',
      localSupport: 'Your bus fare supports local transit workers and infrastructure'
    };
  }

  private getMorningRecommendation(context: LocationContext): string {
    const nearby = context.nearbyDestinations[0];
    if (nearby) {
      return `${nearby.name} is nearby and perfect for morning visits`;
    }
    return 'Great time to explore outdoor attractions with cooler temperatures';
  }

  private getWeatherBasedRecommendations(context: LocationContext): any[] {
    const recommendations = [];
    const weather = context.currentWeather;
    
    if (weather?.weather?.condition?.includes('rain')) {
      recommendations.push({
        type: 'weather',
        title: 'Rainy Day Activities',
        suggestion: 'Visit indoor attractions like museums or shopping centers',
        reason: 'Current weather is rainy'
      });
    } else if (weather?.weather?.uvIndex > 7) {
      recommendations.push({
        type: 'weather',
        title: 'High UV Alert',
        suggestion: 'Use reef-safe sunscreen and seek shade during peak hours',
        reason: `UV index is high (${weather.weather.uvIndex})`
      });
    }
    
    return recommendations;
  }

  private async getCulturalEventRecommendations(context: LocationContext): Promise<any[]> {
    // This would integrate with cultural event APIs
    // For now, return location-based cultural suggestions
    const recommendations = [];
    
    if (context.location.district?.includes('Honolulu')) {
      recommendations.push({
        type: 'cultural',
        title: 'Cultural Learning Opportunity',
        suggestion: 'Visit Iolani Palace to learn about Hawaiian monarchy',
        reason: 'You are in the historic district'
      });
    }
    
    return recommendations;
  }

  private async getCurrentWeather(): Promise<any> {
    if (!this.currentLocation) return null;
    
    try {
      const response = await fetch(
        `/api/weather?lat=${this.currentLocation.latitude}&lon=${this.currentLocation.longitude}`
      );
      return await response.json();
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return null;
    }
  }
}

// Global location service instance
export const locationService = new LocationService();