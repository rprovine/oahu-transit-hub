export interface User {
  id: string;
  email: string;
  fullName?: string;
  userType: 'local' | 'tourist';
  subscriptionTier: 'free' | 'premium';
}

export interface Route {
  id: string;
  name: string;
  type: 'bus' | 'rail' | 'mixed';
  duration: number;
  distance: number;
  steps: RouteStep[];
  weatherImpact?: string;
  fare?: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  mode: 'walk' | 'bus' | 'rail';
  transitLine?: string;
  stopName?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
}

export interface TransitStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
  type: 'bus' | 'rail';
}

export interface TripPlan {
  id: string;
  userId: string;
  origin: Location;
  destination: Location;
  departureTime: Date;
  routes: Route[];
  preferences: TripPreferences;
}

export interface TripPreferences {
  mode?: 'bus' | 'rail' | 'mixed';
  maxWalkDistance?: number;
  avoidRain?: boolean;
  accessibility?: boolean;
}
