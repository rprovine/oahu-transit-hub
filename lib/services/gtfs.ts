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
  private theBusBaseUrl = 'https://hea.thebus.org/api/v2';
  private theBusAppId = process.env.THEBUS_APP_ID || 'demo';
  private skylineUrl = 'https://api.hartskyrail.org'; // Placeholder for future HART API

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
      console.log(`Trip planning requested from [${origin[1]}, ${origin[0]}] to [${destination[1]}, ${destination[0]}]`);
      
      // Return honest message about data availability
      return {
        plans: [],
        message: 'Real-time trip planning requires TheBus API integration',
        error: 'REAL_API_INTEGRATION_NEEDED',
        coordinates: {
          origin: { lat: origin[1], lon: origin[0] },
          destination: { lat: destination[1], lon: destination[0] }
        }
      };
    } catch (error) {
      console.error('GTFS trip planning error:', error);
      return null;
    }
  }

  private async fetchTheBusRoutes(): Promise<BusRoute[]> {
    try {
      // TODO: Implement real TheBus API call
      // const response = await fetch(`${this.theBusBaseUrl}/route?appID=${this.theBusAppId}&format=json`);
      
      console.log('Real TheBus API integration needed for routes data');
      return [];
    } catch (error) {
      console.error('Error fetching TheBus routes:', error);
      return [];
    }
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
      // TODO: Implement real TheBus arrivals API call
      console.log(`Real TheBus API integration needed for arrivals at stop ${stopId}`);
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