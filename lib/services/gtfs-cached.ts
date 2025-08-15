// Lightweight GTFS service using pre-generated cache
import gtfsCache from '@/lib/data/gtfs-cache.json';

interface CachedStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  distance?: number;
}

interface CachedRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
}

export class GTFSCachedService {
  private stops: CachedStop[];
  private routes: CachedRoute[];
  private stopRoutes: Record<string, string[]>;

  constructor() {
    this.stops = gtfsCache.stops as CachedStop[];
    this.routes = gtfsCache.routes as CachedRoute[];
    this.stopRoutes = gtfsCache.stopRoutes as Record<string, string[]>;
  }

  findNearbyStops(lat: number, lon: number, radiusKm: number = 0.8): CachedStop[] {
    const nearbyStops = this.stops
      .map(stop => ({
        ...stop,
        distance: this.calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon)
      }))
      .filter(stop => stop.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return nearbyStops;
  }

  getRoutesForStop(stopId: string): CachedRoute[] {
    const routeIds = this.stopRoutes[stopId] || [];
    return routeIds
      .map(routeId => this.routes.find(r => r.route_id === routeId))
      .filter(route => route !== undefined) as CachedRoute[];
  }

  findDirectRoutes(originLat: number, originLon: number, destLat: number, destLon: number) {
    // Find nearby stops - try expanding radius if needed
    let originStops = this.findNearbyStops(originLat, originLon, 0.8);
    let destStops = this.findNearbyStops(destLat, destLon, 0.8);
    
    // If no stops within 800m, try 1.5km
    if (originStops.length === 0) {
      console.log('No stops within 800m of origin, expanding to 1.5km');
      originStops = this.findNearbyStops(originLat, originLon, 1.5);
    }
    if (destStops.length === 0) {
      console.log('No stops within 800m of destination, expanding to 1.5km');
      destStops = this.findNearbyStops(destLat, destLon, 1.5);
    }
    
    // If still no stops, try 2km (for places like airport)
    if (originStops.length === 0) {
      console.log('No stops within 1.5km of origin, expanding to 2km');
      originStops = this.findNearbyStops(originLat, originLon, 2.0);
    }
    if (destStops.length === 0) {
      console.log('No stops within 1.5km of destination, expanding to 2km');
      destStops = this.findNearbyStops(destLat, destLon, 2.0);
    }

    if (originStops.length === 0 || destStops.length === 0) {
      console.log(`No bus stops found even at 2km: origin=${originStops.length}, dest=${destStops.length}`);
      return [];
    }

    const routes = [];

    // Check for direct routes
    for (const originStop of originStops.slice(0, 5)) { // Limit to nearest 5 stops
      for (const destStop of destStops.slice(0, 5)) {
        const originRoutes = this.getRoutesForStop(originStop.stop_id);
        const destRoutes = this.getRoutesForStop(destStop.stop_id);
        
        // Find common routes
        const commonRoutes = originRoutes.filter(oRoute =>
          destRoutes.some(dRoute => dRoute.route_id === oRoute.route_id)
        );

        for (const route of commonRoutes) {
          const walkToStopTime = Math.round((originStop.distance! * 1000) / 80); // 80m/min
          const walkFromStopTime = Math.round((destStop.distance! * 1000) / 80);
          const transitTime = this.estimateTransitTime(originStop, destStop);

          routes.push({
            duration: (walkToStopTime + transitTime + walkFromStopTime) * 60,
            walking_distance: Math.round((originStop.distance! + destStop.distance!) * 1000),
            transfers: 0,
            cost: 3.00,
            legs: [
              {
                mode: 'WALK',
                from: { lat: originLat, lon: originLon, name: 'Starting Location' },
                to: { lat: originStop.stop_lat, lon: originStop.stop_lon, name: originStop.stop_name },
                duration: walkToStopTime * 60,
                distance: Math.round(originStop.distance! * 1000),
                instruction: `Walk ${walkToStopTime} min to ${originStop.stop_name}`
              },
              {
                mode: 'TRANSIT',
                route: route.route_short_name || route.route_id,
                routeName: route.route_long_name || route.route_short_name,
                from: { lat: originStop.stop_lat, lon: originStop.stop_lon, name: originStop.stop_name },
                to: { lat: destStop.stop_lat, lon: destStop.stop_lon, name: destStop.stop_name },
                duration: transitTime * 60,
                instruction: `Take Route ${route.route_short_name || route.route_id} to ${destStop.stop_name}`
              },
              {
                mode: 'WALK',
                from: { lat: destStop.stop_lat, lon: destStop.stop_lon, name: destStop.stop_name },
                to: { lat: destLat, lon: destLon, name: 'Destination' },
                duration: walkFromStopTime * 60,
                distance: Math.round(destStop.distance! * 1000),
                instruction: `Walk ${walkFromStopTime} min to destination`
              }
            ]
          });
        }
      }
    }

    // Sort by duration and return top 3
    return routes.sort((a, b) => a.duration - b.duration).slice(0, 3);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
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

  private estimateTransitTime(origin: CachedStop, dest: CachedStop): number {
    const distance = this.calculateDistance(
      origin.stop_lat, origin.stop_lon,
      dest.stop_lat, dest.stop_lon
    );
    // Estimate: 25 km/h average bus speed in urban areas
    return Math.round(distance / 25 * 60); // minutes
  }
}