// Direct integration with TheBus HEA API
// Documentation: https://hea.thebus.org/api_info.asp

const THEBUS_API_KEY = process.env.THEBUS_API_KEY || '4F08EE2E-5612-41F9-B527-854EAD77AC2B';
const THEBUS_BASE_URL = 'https://api.thebus.org';

export interface TheBusArrival {
  id: string;
  trip: string;
  route: string;
  headsign: string;
  vehicle: string;
  direction: string;
  stopTime: string;
  arrivalTime: string;
  estimated: string;
  latitude: number;
  longitude: number;
  shape: string;
  canceled: boolean;
}

export interface TheBusVehicle {
  number: string;
  trip: string;
  driver: string;
  latitude: number;
  longitude: number;
  adherence: number;
  lastMessage: string;
  routeShortName: string;
  headsign: string;
}

export interface TheBusRoute {
  shape: string;
  shapeID: string;
  routeID: string;
  routeShortName: string;
  routeLongName: string;
  firstStopTime: string;
  lastStopTime: string;
  points: Array<{lat: number, lon: number}>;
}

export class TheBusAPI {
  // Get arrivals for a specific stop
  async getArrivals(stopId: string): Promise<TheBusArrival[]> {
    try {
      const url = `${THEBUS_BASE_URL}/arrivals?key=${THEBUS_API_KEY}&stop=${stopId}`;
      console.log(`Fetching arrivals for stop ${stopId}...`);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`TheBus API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return this.parseArrivals(data);
    } catch (error) {
      console.error('Error fetching arrivals:', error);
      return [];
    }
  }

  // Get vehicle location
  async getVehicle(vehicleId: string): Promise<TheBusVehicle | null> {
    try {
      const url = `${THEBUS_BASE_URL}/vehicle?key=${THEBUS_API_KEY}&num=${vehicleId}`;
      console.log(`Fetching vehicle ${vehicleId} location...`);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`TheBus API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return this.parseVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return null;
    }
  }

  // Get route shape/geometry
  async getRoute(routeId: string): Promise<TheBusRoute | null> {
    try {
      const url = `${THEBUS_BASE_URL}/route?key=${THEBUS_API_KEY}&route=${routeId}`;
      console.log(`Fetching route ${routeId} information...`);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`TheBus API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return this.parseRoute(data);
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  }

  // Parse arrivals response
  private parseArrivals(data: any): TheBusArrival[] {
    if (!data || !data.arrivals) return [];
    
    return data.arrivals.map((arrival: any) => ({
      id: arrival.id || '',
      trip: arrival.trip || '',
      route: arrival.route || '',
      headsign: arrival.headsign || '',
      vehicle: arrival.vehicle || '',
      direction: arrival.direction || '',
      stopTime: arrival.stopTime || '',
      arrivalTime: arrival.date || arrival.arrivalTime || '',
      estimated: arrival.estimated || '',
      latitude: parseFloat(arrival.latitude) || 0,
      longitude: parseFloat(arrival.longitude) || 0,
      shape: arrival.shape || '',
      canceled: arrival.canceled === '1' || arrival.canceled === true
    }));
  }

  // Parse vehicle response
  private parseVehicle(data: any): TheBusVehicle | null {
    if (!data || !data.vehicle) return null;
    
    const vehicle = data.vehicle;
    return {
      number: vehicle.number || '',
      trip: vehicle.trip || '',
      driver: vehicle.driver || '',
      latitude: parseFloat(vehicle.latitude) || 0,
      longitude: parseFloat(vehicle.longitude) || 0,
      adherence: parseInt(vehicle.adherence) || 0,
      lastMessage: vehicle.lastMessage || '',
      routeShortName: vehicle.routeShortName || '',
      headsign: vehicle.headsign || ''
    };
  }

  // Parse route response
  private parseRoute(data: any): TheBusRoute | null {
    if (!data || !data.route) return null;
    
    const route = data.route;
    const points: Array<{lat: number, lon: number}> = [];
    
    // Parse shape points if available
    if (route.shapePoints) {
      const shapePoints = route.shapePoints.split(' ');
      for (let i = 0; i < shapePoints.length; i += 2) {
        if (shapePoints[i] && shapePoints[i + 1]) {
          points.push({
            lat: parseFloat(shapePoints[i]),
            lon: parseFloat(shapePoints[i + 1])
          });
        }
      }
    }
    
    return {
      shape: route.shape || '',
      shapeID: route.shapeID || '',
      routeID: route.routeID || '',
      routeShortName: route.routeShortName || '',
      routeLongName: route.routeLongName || '',
      firstStopTime: route.firstStopTime || '',
      lastStopTime: route.lastStopTime || '',
      points
    };
  }
}

// Export singleton instance
export const theBusAPI = new TheBusAPI();