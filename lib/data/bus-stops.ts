export interface BusStop {
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  stop_desc?: string;
  stop_lat: number;
  stop_lon: number;
  routes: string[];
  location_type: 'stop' | 'station';
  wheelchair_accessible: boolean;
  distance?: number; // Distance from origin point (added during nearest stop search)
}

// Import comprehensive database
import { getAllOahuStops } from './bus-stops-database';

// Use the comprehensive island-wide database
export const OAHU_BUS_STOPS: BusStop[] = getAllOahuStops();

// Legacy stops (kept for compatibility)
const LEGACY_STOPS: BusStop[] = [
  // Kapolei residential area - Palala Street vicinity
  {
    stop_id: 'KAP001',
    stop_name: 'Farrington Hwy + Palala St',
    stop_lat: 21.3285,
    stop_lon: -158.0860,
    routes: ['C', '401'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAP001B',
    stop_name: 'Palala St + Farrington Hwy (Eastbound)',
    stop_lat: 21.3288,
    stop_lon: -158.0858,
    routes: ['C', '401'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAP002', 
    stop_name: 'Farrington Hwy + Kapolei Pkwy',
    stop_lat: 21.3301,
    stop_lon: -158.0823,
    routes: ['C', '401', '402'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAP003',
    stop_name: 'Farrington Hwy + Makakilo Dr',
    stop_lat: 21.3320,
    stop_lon: -158.0780,
    routes: ['C', '401'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAP004',
    stop_name: 'Kapolei Transit Center',
    stop_lat: 21.3342,
    stop_lon: -158.0756,
    routes: ['C', '40', '42', '401', '402', '403'],
    location_type: 'station',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAP005',
    stop_name: 'Kapolei Pkwy + Kamokila Blvd',
    stop_lat: 21.3310,
    stop_lon: -158.0798,
    routes: ['401', '402'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  
  // Downtown Honolulu stops for Route C
  {
    stop_id: 'DT001',
    stop_name: 'Downtown Honolulu - Alakea St',
    stop_lat: 21.3110,
    stop_lon: -157.8580,
    routes: ['C', '1', '20'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'DT002',
    stop_name: 'King St + Alakea St',
    stop_lat: 21.3088,
    stop_lon: -157.8575,
    routes: ['1', '2', '13'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  
  // Kalihi area stops
  {
    stop_id: 'KAL001',
    stop_name: 'Gulick Ave + School St',
    stop_lat: 21.3295,
    stop_lon: -157.8712,
    routes: ['1', '7'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  {
    stop_id: 'KAL002',
    stop_name: 'School St + Gulick Ave',
    stop_lat: 21.3298,
    stop_lon: -157.8708,
    routes: ['1', '7'],
    location_type: 'stop',
    wheelchair_accessible: true
  },
  
  // Ala Moana area
  {
    stop_id: 'AM001',
    stop_name: 'Ala Moana Center',
    stop_lat: 21.2909,
    stop_lon: -157.8427,
    routes: ['8', '40', '42', '19', '20'],
    location_type: 'station',
    wheelchair_accessible: true
  }
];

// Distance calculation helper function (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI/180);
}

// Find nearest bus stops within walking distance
export function findNearestStops(
  lat: number, 
  lon: number, 
  maxWalkingDistanceKm: number = 0.8 // 800 meters default
): BusStop[] {
  const nearbyStops = OAHU_BUS_STOPS
    .map(stop => ({
      ...stop,
      distance: calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon)
    }))
    .filter(stop => stop.distance <= maxWalkingDistanceKm)
    .sort((a, b) => a.distance - b.distance);
    
  return nearbyStops;
}

// Find stops that serve specific routes
export function getStopsForRoute(routeId: string): BusStop[] {
  return OAHU_BUS_STOPS.filter(stop => 
    stop.routes.includes(routeId)
  );
}

// Get walking time in minutes (assuming 5 km/h walking speed)
export function getWalkingTime(distanceKm: number): number {
  const walkingSpeedKmh = 5;
  return Math.round((distanceKm / walkingSpeedKmh) * 60);
}