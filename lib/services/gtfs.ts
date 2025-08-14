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
  private baseUrl = 'https://api.thebus.org'; // This would be the actual API endpoint
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.THEBUS_API_KEY || '';
  }

  async getRoutes(): Promise<BusRoute[]> {
    try {
      // In a real implementation, this would call the actual GTFS API
      // For now, returning Oahu's actual bus routes
      return this.getOahuBusRoutes();
    } catch (error) {
      console.error('GTFS routes error:', error);
      return this.getOahuBusRoutes();
    }
  }

  async getNearbyStops(lat: number, lon: number, radius: number = 500): Promise<BusStop[]> {
    try {
      // In a real implementation, this would query the GTFS API
      return this.getOahuBusStops().filter(stop => {
        const distance = this.calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon);
        return distance <= radius;
      });
    } catch (error) {
      console.error('GTFS nearby stops error:', error);
      return [];
    }
  }

  async getStopArrivals(stopId: string): Promise<BusArrival[]> {
    try {
      // This would call real-time API for actual arrival predictions
      return this.getMockArrivals(stopId);
    } catch (error) {
      console.error('GTFS arrivals error:', error);
      return [];
    }
  }

  async getServiceAlerts(): Promise<ServiceAlert[]> {
    try {
      // This would fetch current service alerts
      return this.getCurrentAlerts();
    } catch (error) {
      console.error('GTFS alerts error:', error);
      return [];
    }
  }

  async planTrip(origin: [number, number], destination: [number, number], time?: string): Promise<any> {
    try {
      // This would use GTFS trip planning
      return this.generateTripPlan(origin, destination, time);
    } catch (error) {
      console.error('GTFS trip planning error:', error);
      return null;
    }
  }

  private getOahuBusRoutes(): BusRoute[] {
    return [
      {
        route_id: '1',
        route_short_name: '1',
        route_long_name: 'Keeaumoku - Kapahulu',
        route_desc: 'Serves Keeaumoku and Kapahulu areas',
        route_type: 3, // Bus
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '2',
        route_short_name: '2',
        route_long_name: 'School - Middle',
        route_desc: 'School and Middle Street route',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '8',
        route_short_name: '8',
        route_long_name: 'Waikiki - Ala Moana Center',
        route_desc: 'Major tourist and shopping route',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '13',
        route_short_name: '13',
        route_long_name: 'Liliha - Downtown',
        route_desc: 'Connects Liliha to downtown Honolulu',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '20',
        route_short_name: '20',
        route_long_name: 'Airport - Hickam',
        route_desc: 'Airport and military base service',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '42',
        route_short_name: '42',
        route_long_name: 'Ewa Beach - Honolulu',
        route_desc: 'West Oahu to Honolulu express',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '55',
        route_short_name: '55',
        route_long_name: 'Kaneohe - Circle Island',
        route_desc: 'Windward side circular route',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      },
      {
        route_id: '72',
        route_short_name: '72',
        route_long_name: 'Kailua - Honolulu',
        route_desc: 'Beach communities to city',
        route_type: 3,
        route_color: '0066CC',
        route_text_color: 'FFFFFF'
      }
    ];
  }

  private getOahuBusStops(): BusStop[] {
    return [
      {
        stop_id: 'stop_ala_moana',
        stop_name: 'Ala Moana Center',
        stop_desc: 'Major transit hub and shopping center',
        stop_lat: 21.2906,
        stop_lon: -157.8420,
        location_type: 1 // Station
      },
      {
        stop_id: 'stop_waikiki_beach',
        stop_name: 'Waikiki Beach & Seaside Ave',
        stop_desc: 'Tourist area stop near beach',
        stop_lat: 21.2793,
        stop_lon: -157.8293,
        location_type: 0 // Stop
      },
      {
        stop_id: 'stop_uh_manoa',
        stop_name: 'University of Hawaii',
        stop_desc: 'Campus transit center',
        stop_lat: 21.2969,
        stop_lon: -157.8167,
        location_type: 1
      },
      {
        stop_id: 'stop_downtown',
        stop_name: 'Downtown Transit Center',
        stop_desc: 'Central business district hub',
        stop_lat: 21.3099,
        stop_lon: -157.8583,
        location_type: 1
      },
      {
        stop_id: 'stop_airport',
        stop_name: 'Honolulu International Airport',
        stop_desc: 'Airport terminal stops',
        stop_lat: 21.3187,
        stop_lon: -157.9180,
        location_type: 1
      },
      {
        stop_id: 'stop_pearl_harbor',
        stop_name: 'Pearl Harbor',
        stop_desc: 'Historic site and naval base',
        stop_lat: 21.3649,
        stop_lon: -157.9623,
        location_type: 0
      }
    ];
  }

  private getMockArrivals(stopId: string): BusArrival[] {
    const now = new Date();
    const arrivals: BusArrival[] = [];

    // Generate realistic arrival times
    [5, 12, 18, 25, 35].forEach((minutes, index) => {
      const arrivalTime = new Date(now.getTime() + minutes * 60000);
      arrivals.push({
        route_id: ['8', '20', '42', '13', '2'][index] || '8',
        route_name: ['Route 8', 'Route 20', 'Route 42', 'Route 13', 'Route 2'][index] || 'Route 8',
        stop_id: stopId,
        stop_name: 'Current Stop',
        arrival_time: arrivalTime.toISOString(),
        departure_time: arrivalTime.toISOString(),
        realtime_arrival: arrivalTime.toLocaleTimeString(),
        delay_minutes: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        vehicle_id: `bus_${Math.floor(Math.random() * 1000)}`,
        direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
        headsign: ['Ala Moana', 'Airport', 'Ewa Beach', 'Downtown', 'Kalihi'][index] || 'Ala Moana'
      });
    });

    return arrivals;
  }

  private getCurrentAlerts(): ServiceAlert[] {
    return [
      {
        alert_id: 'alert_1',
        title: 'Route 8 Delay',
        description: 'Route 8 experiencing 10-15 minute delays due to traffic on Kalakaua Avenue.',
        severity: 'warning',
        effect: 'SIGNIFICANT_DELAYS',
        cause: 'TRAFFIC',
        affected_routes: ['8'],
        affected_stops: [],
        active_period: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
        }
      },
      {
        alert_id: 'alert_2',
        title: 'UH Football Game Traffic',
        description: 'Expect heavy traffic and delays around University area due to football game.',
        severity: 'info',
        effect: 'DETOUR',
        cause: 'SPECIAL_EVENT',
        affected_routes: ['1', '4', '6', '18'],
        affected_stops: ['stop_uh_manoa'],
        active_period: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
        }
      }
    ];
  }

  private generateTripPlan(origin: [number, number], destination: [number, number], time?: string): any {
    // Mock trip planning response
    return {
      plans: [
        {
          duration: 1800, // 30 minutes
          walking_distance: 800, // meters
          transfers: 1,
          cost: 2.75,
          legs: [
            {
              mode: 'WALK',
              from: { lat: origin[1], lon: origin[0], name: 'Origin' },
              to: { lat: 21.2906, lon: -157.8420, name: 'Ala Moana Center' },
              duration: 600,
              distance: 400
            },
            {
              mode: 'TRANSIT',
              route: '8',
              from: { lat: 21.2906, lon: -157.8420, name: 'Ala Moana Center' },
              to: { lat: destination[1], lon: destination[0], name: 'Destination' },
              duration: 900,
              headsign: 'Waikiki'
            },
            {
              mode: 'WALK',
              from: { lat: destination[1], lon: destination[0], name: 'Bus Stop' },
              to: { lat: destination[1], lon: destination[0], name: 'Destination' },
              duration: 300,
              distance: 200
            }
          ]
        }
      ]
    };
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