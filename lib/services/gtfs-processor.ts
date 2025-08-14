// GTFS Data Processor - Downloads and parses real TheBus GTFS data
import fs from 'fs';
import path from 'path';
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

export class GTFSProcessor {
  private readonly gtfsUrl = 'https://www.thebus.org/transitdata/production/google_transit.zip';
  private readonly dataDir = path.join(process.cwd(), 'data', 'gtfs');
  private gtfsData: {
    stops?: GTFSStop[];
    routes?: GTFSRoute[];
    trips?: GTFSTrip[];
    stopTimes?: GTFSStopTime[];
    calendar?: GTFSCalendar[];
  } = {};

  async downloadAndExtractGTFS(): Promise<void> {
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
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      
      // Extract to data directory
      const zip = new AdmZip(buffer);
      zip.extractAllTo(this.dataDir, true);
      console.log(`📂 Extracted to ${this.dataDir}`);
      
      // Update last download timestamp
      fs.writeFileSync(
        path.join(this.dataDir, 'last_download.txt'), 
        new Date().toISOString()
      );
      
      console.log('✅ GTFS data download complete');
    } catch (error) {
      console.error('❌ Failed to download GTFS data:', error);
      throw error;
    }
  }

  parseGTFSFile<T>(filename: string, mapper: (record: any) => T): T[] {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ GTFS file ${filename} not found`);
      return [];
    }
    
    try {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const records = parse(csvContent, { 
        columns: true, 
        skip_empty_lines: true,
        relaxColumnCount: true,
        skipRecordsWithError: true
      });
      
      console.log(`📄 Parsed ${records.length} records from ${filename}`);
      return records.map(mapper);
    } catch (error) {
      console.error(`❌ Error parsing ${filename}:`, error);
      return [];
    }
  }

  // Parse all bus stops
  getStops(): GTFSStop[] {
    if (this.gtfsData.stops) return this.gtfsData.stops;
    
    this.gtfsData.stops = this.parseGTFSFile('stops.txt', (record) => ({
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
    
    console.log(`✅ Loaded ${this.gtfsData.stops.length} bus stops`);
    return this.gtfsData.stops;
  }

  // Parse all routes
  getRoutes(): GTFSRoute[] {
    if (this.gtfsData.routes) return this.gtfsData.routes;
    
    this.gtfsData.routes = this.parseGTFSFile('routes.txt', (record) => ({
      route_id: record.route_id || '',
      agency_id: record.agency_id,
      route_short_name: record.route_short_name || '',
      route_long_name: record.route_long_name || '',
      route_desc: record.route_desc,
      route_type: parseInt(record.route_type) || 3, // 3 = bus
      route_url: record.route_url,
      route_color: record.route_color || '0066CC',
      route_text_color: record.route_text_color || 'FFFFFF'
    }));
    
    console.log(`✅ Loaded ${this.gtfsData.routes.length} bus routes`);
    return this.gtfsData.routes;
  }

  // Parse all trips
  getTrips(): GTFSTrip[] {
    if (this.gtfsData.trips) return this.gtfsData.trips;
    
    this.gtfsData.trips = this.parseGTFSFile('trips.txt', (record) => ({
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
    
    console.log(`✅ Loaded ${this.gtfsData.trips.length} trips`);
    return this.gtfsData.trips;
  }

  // Parse stop times (schedule)
  getStopTimes(): GTFSStopTime[] {
    if (this.gtfsData.stopTimes) return this.gtfsData.stopTimes;
    
    this.gtfsData.stopTimes = this.parseGTFSFile('stop_times.txt', (record) => ({
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
    
    console.log(`✅ Loaded ${this.gtfsData.stopTimes.length} stop times`);
    return this.gtfsData.stopTimes;
  }

  // Parse service calendar
  getCalendar(): GTFSCalendar[] {
    if (this.gtfsData.calendar) return this.gtfsData.calendar;
    
    this.gtfsData.calendar = this.parseGTFSFile('calendar.txt', (record) => ({
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
    
    console.log(`✅ Loaded ${this.gtfsData.calendar.length} calendar entries`);
    return this.gtfsData.calendar;
  }

  // Check if GTFS data exists
  hasData(): boolean {
    return fs.existsSync(path.join(this.dataDir, 'stops.txt'));
  }

  // Get last update time
  getLastUpdateTime(): Date | null {
    const timestampFile = path.join(this.dataDir, 'last_download.txt');
    if (fs.existsSync(timestampFile)) {
      const timestamp = fs.readFileSync(timestampFile, 'utf-8');
      return new Date(timestamp);
    }
    return null;
  }

  // Load all GTFS data
  async loadAllData(): Promise<void> {
    if (!this.hasData()) {
      console.log('🚀 No GTFS data found, downloading...');
      await this.downloadAndExtractGTFS();
    }
    
    console.log('📊 Loading GTFS data into memory...');
    this.getStops();
    this.getRoutes();
    this.getTrips();
    this.getStopTimes();
    this.getCalendar();
    console.log('✅ All GTFS data loaded');
  }

  // Find stops near a location
  findNearbyStops(lat: number, lon: number, radiusKm: number = 0.8): GTFSStop[] {
    const stops = this.getStops();
    
    return stops
      .map(stop => ({
        ...stop,
        distance: this.calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon)
      }))
      .filter(stop => stop.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
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
export const gtfsProcessor = new GTFSProcessor();