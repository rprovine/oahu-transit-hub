// GTFS Data Processor for Serverless Environment - Stores data in memory
import { parse } from 'csv-parse/sync';
import AdmZip from 'adm-zip';

// GTFS Data Types
export interface GTFSStop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  stop_url?: string;
  location_type: number;
  parent_station?: string;
  wheelchair_boarding: number;
  distance?: number; // Added for nearby stop calculations
}

export interface GTFSRoute {
  route_id: string;
  agency_id?: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_type: number;
  route_url?: string;
  route_color: string;
  route_text_color: string;
}

export interface GTFSTrip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id: number;
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible: number;
}

export interface GTFSStopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  stop_headsign?: string;
  pickup_type: number;
  drop_off_type: number;
  shape_dist_traveled?: number;
}

export interface GTFSCalendar {
  service_id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_date: string;
  end_date: string;
}

class GTFSMemoryProcessor {
  private readonly gtfsUrl = 'https://www.thebus.org/transitdata/production/google_transit.zip';
  private gtfsData: {
    stops: GTFSStop[];
    routes: GTFSRoute[];
    trips: GTFSTrip[];
    stopTimes: GTFSStopTime[];
    calendar: GTFSCalendar[];
    lastUpdate: Date | null;
  } = {
    stops: [],
    routes: [],
    trips: [],
    stopTimes: [],
    calendar: [],
    lastUpdate: null
  };

  // In-memory cache duration (24 hours)
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

  async downloadAndProcessGTFS(): Promise<void> {
    // Check if we have cached data that's still fresh
    if (this.gtfsData.lastUpdate) {
      const age = Date.now() - this.gtfsData.lastUpdate.getTime();
      if (age < this.CACHE_DURATION_MS && this.gtfsData.stops.length > 0) {
        console.log('✅ Using cached GTFS data');
        return;
      }
    }

    console.log('📥 Downloading GTFS data from TheBus...');
    
    try {
      // Download GTFS zip file
      const response = await fetch(this.gtfsUrl);
      if (!response.ok) {
        throw new Error(`Failed to download GTFS: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`✅ Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
      
      // Extract and parse in memory
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();
      
      for (const entry of zipEntries) {
        const fileName = entry.entryName;
        const content = entry.getData().toString('utf8');
        
        switch (fileName) {
          case 'stops.txt':
            this.gtfsData.stops = this.parseStops(content);
            console.log(`✅ Loaded ${this.gtfsData.stops.length} bus stops`);
            break;
          case 'routes.txt':
            this.gtfsData.routes = this.parseRoutes(content);
            console.log(`✅ Loaded ${this.gtfsData.routes.length} bus routes`);
            break;
          case 'trips.txt':
            this.gtfsData.trips = this.parseTrips(content);
            console.log(`✅ Loaded ${this.gtfsData.trips.length} trips`);
            break;
          case 'stop_times.txt':
            // Parse all stop times - needed for route associations
            this.gtfsData.stopTimes = this.parseStopTimes(content);
            console.log(`✅ Loaded ${this.gtfsData.stopTimes.length} stop times`);
            break;
          case 'calendar.txt':
            this.gtfsData.calendar = this.parseCalendar(content);
            console.log(`✅ Loaded ${this.gtfsData.calendar.length} calendar entries`);
            break;
        }
      }
      
      this.gtfsData.lastUpdate = new Date();
      console.log('✅ GTFS data processing complete');
    } catch (error) {
      console.error('❌ Failed to download/process GTFS data:', error);
      throw error;
    }
  }

  private parseStops(content: string): GTFSStop[] {
    const records = parse(content, { 
      columns: true, 
      skip_empty_lines: true,
      relaxColumnCount: true
    });
    
    return records.map((record: any) => ({
      stop_id: record.stop_id || '',
      stop_code: record.stop_code || '',
      stop_name: record.stop_name || '',
      stop_desc: record.stop_desc || '',
      stop_lat: parseFloat(record.stop_lat) || 0,
      stop_lon: parseFloat(record.stop_lon) || 0,
      zone_id: record.zone_id,
      stop_url: record.stop_url,
      location_type: parseInt(record.location_type) || 0,
      parent_station: record.parent_station,
      wheelchair_boarding: parseInt(record.wheelchair_boarding) || 0
    }));
  }

  private parseRoutes(content: string): GTFSRoute[] {
    const records = parse(content, { 
      columns: true, 
      skip_empty_lines: true,
      relaxColumnCount: true
    });
    
    return records.map((record: any) => ({
      route_id: record.route_id || '',
      agency_id: record.agency_id,
      route_short_name: record.route_short_name || '',
      route_long_name: record.route_long_name || '',
      route_desc: record.route_desc,
      route_type: parseInt(record.route_type) || 3,
      route_url: record.route_url,
      route_color: record.route_color || '0066CC',
      route_text_color: record.route_text_color || 'FFFFFF'
    }));
  }

  private parseTrips(content: string): GTFSTrip[] {
    const records = parse(content, { 
      columns: true, 
      skip_empty_lines: true,
      relaxColumnCount: true
    });
    
    return records.map((record: any) => ({
      route_id: record.route_id || '',
      service_id: record.service_id || '',
      trip_id: record.trip_id || '',
      trip_headsign: record.trip_headsign,
      trip_short_name: record.trip_short_name,
      direction_id: parseInt(record.direction_id) || 0,
      block_id: record.block_id,
      shape_id: record.shape_id,
      wheelchair_accessible: parseInt(record.wheelchair_accessible) || 0
    }));
  }

  private parseStopTimes(content: string): GTFSStopTime[] {
    const records = parse(content, { 
      columns: true, 
      skip_empty_lines: true,
      relaxColumnCount: true
    });
    
    return records.map((record: any) => ({
      trip_id: record.trip_id || '',
      arrival_time: record.arrival_time || '',
      departure_time: record.departure_time || '',
      stop_id: record.stop_id || '',
      stop_sequence: parseInt(record.stop_sequence) || 0,
      stop_headsign: record.stop_headsign,
      pickup_type: parseInt(record.pickup_type) || 0,
      drop_off_type: parseInt(record.drop_off_type) || 0,
      shape_dist_traveled: record.shape_dist_traveled ? parseFloat(record.shape_dist_traveled) : undefined
    }));
  }

  private parseCalendar(content: string): GTFSCalendar[] {
    const records = parse(content, { 
      columns: true, 
      skip_empty_lines: true,
      relaxColumnCount: true
    });
    
    return records.map((record: any) => ({
      service_id: record.service_id || '',
      monday: record.monday === '1',
      tuesday: record.tuesday === '1',
      wednesday: record.wednesday === '1',
      thursday: record.thursday === '1',
      friday: record.friday === '1',
      saturday: record.saturday === '1',
      sunday: record.sunday === '1',
      start_date: record.start_date || '',
      end_date: record.end_date || ''
    }));
  }

  // Get all data
  getStops(): GTFSStop[] {
    return this.gtfsData.stops;
  }

  getRoutes(): GTFSRoute[] {
    return this.gtfsData.routes;
  }

  getTrips(): GTFSTrip[] {
    return this.gtfsData.trips;
  }

  getStopTimes(): GTFSStopTime[] {
    return this.gtfsData.stopTimes;
  }

  getCalendar(): GTFSCalendar[] {
    return this.gtfsData.calendar;
  }

  // Find stops near a location
  findNearbyStops(lat: number, lon: number, radiusKm: number = 0.8): GTFSStop[] {
    return this.gtfsData.stops
      .map(stop => ({
        ...stop,
        distance: this.calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon)
      }))
      .filter(stop => stop.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  // Get stops for a specific route
  getStopsForRoute(routeId: string): GTFSStop[] {
    // Get all trips for this route
    const routeTrips = this.gtfsData.trips.filter(trip => trip.route_id === routeId);
    const tripIds = new Set(routeTrips.map(trip => trip.trip_id));
    
    // Get unique stop IDs from stop times
    const stopIds = new Set<string>();
    this.gtfsData.stopTimes.forEach(stopTime => {
      if (tripIds.has(stopTime.trip_id)) {
        stopIds.add(stopTime.stop_id);
      }
    });
    
    // Return stops that are on this route
    return this.gtfsData.stops.filter(stop => stopIds.has(stop.stop_id));
  }

  // Get routes that serve a stop
  getRoutesForStop(stopId: string): GTFSRoute[] {
    // Find all trips that stop here
    const tripIds = new Set(
      this.gtfsData.stopTimes
        .filter(st => st.stop_id === stopId)
        .map(st => st.trip_id)
    );
    
    // Get route IDs from those trips
    const routeIds = new Set<string>();
    this.gtfsData.trips.forEach(trip => {
      if (tripIds.has(trip.trip_id)) {
        routeIds.add(trip.route_id);
      }
    });
    
    // Return routes
    return this.gtfsData.routes.filter(route => routeIds.has(route.route_id));
  }

  // Check if data is loaded
  hasData(): boolean {
    return this.gtfsData.stops.length > 0;
  }

  // Get last update time
  getLastUpdateTime(): Date | null {
    return this.gtfsData.lastUpdate;
  }

  // Get data summary
  getSummary() {
    return {
      stops: this.gtfsData.stops.length,
      routes: this.gtfsData.routes.length,
      trips: this.gtfsData.trips.length,
      stopTimes: this.gtfsData.stopTimes.length,
      calendar: this.gtfsData.calendar.length,
      lastUpdate: this.gtfsData.lastUpdate
    };
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
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
}

// Export singleton instance
export const gtfsMemoryProcessor = new GTFSMemoryProcessor();