// Real-time Transit Data Service
// Integrates with TheBus HEA API and GTFS-realtime feeds

interface VehiclePosition {
  vehicleId: string;
  routeId: string;
  lat: number;
  lon: number;
  speed?: number;
  bearing?: number;
  timestamp: number;
  occupancyStatus?: 'EMPTY' | 'MANY_SEATS' | 'FEW_SEATS' | 'STANDING_ROOM' | 'CRUSHED' | 'FULL';
  currentStopSequence?: number;
  stopId?: string;
}

interface StopArrival {
  routeId: string;
  routeShortName: string;
  headsign: string;
  arrivalTime: Date;
  departureTime: Date;
  realtime: boolean;
  delay?: number; // seconds
  vehicleId?: string;
  tripId?: string;
  stopSequence?: number;
}

interface ServiceAlert {
  id: string;
  alertType: 'NO_SERVICE' | 'REDUCED_SERVICE' | 'SIGNIFICANT_DELAYS' | 'DETOUR' | 'ADDITIONAL_SERVICE' | 'MODIFIED_SERVICE' | 'STOP_MOVED' | 'OTHER';
  headerText: string;
  descriptionText: string;
  severity: 'UNKNOWN' | 'INFO' | 'WARNING' | 'SEVERE';
  cause?: string;
  effect?: string;
  activePeriods: Array<{
    start: number;
    end?: number;
  }>;
  informedEntities: Array<{
    agencyId?: string;
    routeId?: string;
    stopId?: string;
    tripId?: string;
  }>;
}

export class RealtimeTransitService {
  private theBusApiKey: string;
  private baseUrl: string = 'http://api.thebus.org';
  private gtfsRealtimeUrl: string = 'http://webapps.thebus.org/transitdata/';
  private updateInterval: number = 30000; // 30 seconds
  private activeSubscriptions: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.theBusApiKey = process.env.THEBUS_APP_ID || '4F08EE2E-5612-41F9-B527-854EAD77AC2B';
  }

  // Get real-time vehicle positions for a route
  async getVehiclePositions(routeId?: string): Promise<VehiclePosition[]> {
    try {
      // TheBus vehicle location endpoint
      const url = `${this.baseUrl}/api/where/vehicles-for-agency/oahu-transit-services.json?key=${this.theBusApiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle positions: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.list) {
        let vehicles: VehiclePosition[] = data.data.list.map((vehicle: any) => ({
          vehicleId: vehicle.vehicleId,
          routeId: vehicle.tripStatus?.activeTrip?.routeId || '',
          lat: vehicle.location?.lat || 0,
          lon: vehicle.location?.lon || 0,
          speed: vehicle.tripStatus?.velocity,
          bearing: vehicle.tripStatus?.orientation,
          timestamp: vehicle.tripStatus?.lastUpdateTime || Date.now(),
          occupancyStatus: this.mapOccupancyStatus(vehicle.tripStatus?.occupancyStatus),
          currentStopSequence: vehicle.tripStatus?.currentStopSequence,
          stopId: vehicle.tripStatus?.closestStop
        }));

        // Filter by route if specified
        if (routeId) {
          vehicles = vehicles.filter(v => v.routeId === routeId);
        }

        return vehicles;
      }

      // Fallback to GTFS-realtime if primary API fails
      return this.getGTFSRealtimeVehicles(routeId);
    } catch (error) {
      console.error('Error fetching vehicle positions:', error);
      return [];
    }
  }

  // Get GTFS-realtime vehicle positions
  private async getGTFSRealtimeVehicles(routeId?: string): Promise<VehiclePosition[]> {
    try {
      // GTFS-realtime vehicle positions feed
      const url = `${this.gtfsRealtimeUrl}vehicle-positions.pb`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GTFS realtime: ${response.status}`);
      }

      // Note: GTFS-realtime uses Protocol Buffers
      // In production, you'd decode this with gtfs-realtime-bindings
      // For now, we'll use the JSON endpoint if available
      const jsonUrl = `${this.gtfsRealtimeUrl}vehicle-positions.json`;
      const jsonResponse = await fetch(jsonUrl);
      
      if (jsonResponse.ok) {
        const data = await jsonResponse.json();
        return this.parseGTFSVehicles(data, routeId);
      }

      return [];
    } catch (error) {
      console.error('Error fetching GTFS realtime:', error);
      return [];
    }
  }

  // Get real-time arrivals for a stop
  async getStopArrivals(stopId: string, minutesOut: number = 60): Promise<StopArrival[]> {
    try {
      // TheBus arrivals endpoint
      const url = `${this.baseUrl}/arrivals?appID=${this.theBusApiKey}&stop=${stopId}&minutes=${minutesOut}&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch arrivals: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.arrivals) {
        return data.arrivals.map((arrival: any) => ({
          routeId: arrival.route,
          routeShortName: arrival.route,
          headsign: arrival.headsign,
          arrivalTime: new Date(arrival.arrivalTime),
          departureTime: new Date(arrival.departureTime || arrival.arrivalTime),
          realtime: arrival.predicted === 'true',
          delay: arrival.adherence ? parseInt(arrival.adherence) * 60 : undefined,
          vehicleId: arrival.vehicle,
          tripId: arrival.trip,
          stopSequence: arrival.stopSequence
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching stop arrivals:', error);
      return [];
    }
  }

  // Get arrivals for multiple stops (useful for trip planning)
  async getMultipleStopArrivals(stopIds: string[]): Promise<Map<string, StopArrival[]>> {
    const arrivals = new Map<string, StopArrival[]>();
    
    // Fetch in parallel for better performance
    const promises = stopIds.map(stopId => 
      this.getStopArrivals(stopId).then(data => ({ stopId, data }))
    );
    
    const results = await Promise.all(promises);
    results.forEach(({ stopId, data }) => {
      arrivals.set(stopId, data);
    });
    
    return arrivals;
  }

  // Get service alerts
  async getServiceAlerts(routeId?: string): Promise<ServiceAlert[]> {
    try {
      // TheBus service alerts endpoint
      const url = `${this.baseUrl}/api/where/service-alerts-for-agency/oahu-transit-services.json?key=${this.theBusApiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service alerts: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.list) {
        let alerts: ServiceAlert[] = data.data.list.map((alert: any) => ({
          id: alert.id,
          alertType: alert.consequenceMessage || 'OTHER',
          headerText: alert.summary?.value || '',
          descriptionText: alert.description?.value || '',
          severity: this.mapSeverity(alert.severity),
          cause: alert.cause,
          effect: alert.effect,
          activePeriods: alert.activePeriods || [{ start: Date.now() }],
          informedEntities: alert.informedEntities || []
        }));

        // Filter by route if specified
        if (routeId) {
          alerts = alerts.filter(a => 
            a.informedEntities.some(e => e.routeId === routeId)
          );
        }

        return alerts;
      }

      return [];
    } catch (error) {
      console.error('Error fetching service alerts:', error);
      return [];
    }
  }

  // Subscribe to real-time updates for a route
  subscribeToRoute(routeId: string, callback: (data: any) => void): string {
    const subscriptionId = `route_${routeId}_${Date.now()}`;
    
    // Initial fetch
    this.fetchRouteUpdates(routeId, callback);
    
    // Set up polling interval
    const interval = setInterval(() => {
      this.fetchRouteUpdates(routeId, callback);
    }, this.updateInterval);
    
    this.activeSubscriptions.set(subscriptionId, interval);
    
    return subscriptionId;
  }

  // Subscribe to real-time updates for a stop
  subscribeToStop(stopId: string, callback: (arrivals: StopArrival[]) => void): string {
    const subscriptionId = `stop_${stopId}_${Date.now()}`;
    
    // Initial fetch
    this.getStopArrivals(stopId).then(callback);
    
    // Set up polling interval
    const interval = setInterval(async () => {
      const arrivals = await this.getStopArrivals(stopId);
      callback(arrivals);
    }, this.updateInterval);
    
    this.activeSubscriptions.set(subscriptionId, interval);
    
    return subscriptionId;
  }

  // Unsubscribe from updates
  unsubscribe(subscriptionId: string): void {
    const interval = this.activeSubscriptions.get(subscriptionId);
    if (interval) {
      clearInterval(interval);
      this.activeSubscriptions.delete(subscriptionId);
    }
  }

  // Unsubscribe from all updates
  unsubscribeAll(): void {
    this.activeSubscriptions.forEach(interval => clearInterval(interval));
    this.activeSubscriptions.clear();
  }

  // Get real-time trip updates (delays, cancellations, etc.)
  async getTripUpdates(tripId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/api/where/trip-details/${tripId}.json?key=${this.theBusApiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trip updates: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching trip updates:', error);
      return null;
    }
  }

  // Get estimated arrival time for a specific trip at a stop
  async getEstimatedArrival(tripId: string, stopId: string): Promise<Date | null> {
    try {
      const tripUpdates = await this.getTripUpdates(tripId);
      
      if (tripUpdates && tripUpdates.status) {
        const stopTime = tripUpdates.status.stopTimes?.find(
          (st: any) => st.stopId === stopId
        );
        
        if (stopTime) {
          const estimatedTime = stopTime.predictedArrivalTime || stopTime.scheduledArrivalTime;
          return new Date(estimatedTime * 1000);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting estimated arrival:', error);
      return null;
    }
  }

  // Private helper methods
  private async fetchRouteUpdates(routeId: string, callback: (data: any) => void): Promise<void> {
    try {
      const [vehicles, alerts] = await Promise.all([
        this.getVehiclePositions(routeId),
        this.getServiceAlerts(routeId)
      ]);
      
      callback({
        vehicles,
        alerts,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error fetching route updates:', error);
    }
  }

  private mapOccupancyStatus(status: string | undefined): VehiclePosition['occupancyStatus'] {
    switch (status) {
      case 'EMPTY': return 'EMPTY';
      case 'MANY_SEATS_AVAILABLE': return 'MANY_SEATS';
      case 'FEW_SEATS_AVAILABLE': return 'FEW_SEATS';
      case 'STANDING_ROOM_ONLY': return 'STANDING_ROOM';
      case 'CRUSHED_STANDING_ROOM_ONLY': return 'CRUSHED';
      case 'FULL': return 'FULL';
      default: return undefined;
    }
  }

  private mapSeverity(severity: string | undefined): ServiceAlert['severity'] {
    switch (severity) {
      case 'INFO': return 'INFO';
      case 'WARNING': return 'WARNING';
      case 'SEVERE': return 'SEVERE';
      default: return 'UNKNOWN';
    }
  }

  private parseGTFSVehicles(data: any, routeId?: string): VehiclePosition[] {
    // Parse GTFS-realtime JSON format
    if (!data.entity) return [];
    
    return data.entity
      .filter((entity: any) => entity.vehicle)
      .map((entity: any) => ({
        vehicleId: entity.vehicle.vehicle?.id || entity.id,
        routeId: entity.vehicle.trip?.routeId || '',
        lat: entity.vehicle.position?.latitude || 0,
        lon: entity.vehicle.position?.longitude || 0,
        speed: entity.vehicle.position?.speed,
        bearing: entity.vehicle.position?.bearing,
        timestamp: entity.vehicle.timestamp * 1000,
        occupancyStatus: this.mapOccupancyStatus(entity.vehicle.occupancyStatus),
        currentStopSequence: entity.vehicle.currentStopSequence,
        stopId: entity.vehicle.stopId
      }))
      .filter((v: VehiclePosition) => !routeId || v.routeId === routeId);
  }

  // Get real-time data for a complete trip
  async getTripRealtimeData(tripPlan: any): Promise<any> {
    const realtimeData = {
      vehicles: [],
      arrivals: new Map(),
      alerts: [],
      lastUpdate: Date.now()
    };

    // Extract unique route IDs and stop IDs from the trip plan
    const routeIds = new Set<string>();
    const stopIds = new Set<string>();

    if (tripPlan.legs) {
      tripPlan.legs.forEach((leg: any) => {
        if (leg.routeId) routeIds.add(leg.routeId);
        if (leg.from?.stopId) stopIds.add(leg.from.stopId);
        if (leg.to?.stopId) stopIds.add(leg.to.stopId);
      });
    }

    // Fetch real-time data in parallel
    const promises = [];

    // Get vehicle positions for all routes
    if (routeIds.size > 0) {
      promises.push(
        Promise.all([...routeIds].map(id => this.getVehiclePositions(id)))
          .then(results => {
            realtimeData.vehicles = results.flat();
          })
      );
    }

    // Get arrivals for all stops
    if (stopIds.size > 0) {
      promises.push(
        this.getMultipleStopArrivals([...stopIds])
          .then(arrivals => {
            realtimeData.arrivals = arrivals;
          })
      );
    }

    // Get service alerts
    promises.push(
      this.getServiceAlerts()
        .then(alerts => {
          realtimeData.alerts = alerts;
        })
    );

    await Promise.all(promises);

    return realtimeData;
  }
}