#!/usr/bin/env node
// Script to generate cached GTFS data at build time
const https = require('https');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const AdmZip = require('adm-zip');

const GTFS_URL = 'https://www.thebus.org/transitdata/production/google_transit.zip';
const OUTPUT_DIR = path.join(__dirname, '..', 'lib', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'gtfs-cache.json');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📥 Downloading and processing GTFS data...');

function downloadGTFS() {
  return new Promise((resolve, reject) => {
    https.get(GTFS_URL, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log(`✅ Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
        resolve(buffer);
      });
      response.on('error', reject);
    });
  });
}

function processGTFS(buffer) {
  const zip = new AdmZip(buffer);
  const data = {
    stops: [],
    routes: [],
    stopRoutes: {}, // Map of stop_id to route_ids for quick lookup
    timestamp: new Date().toISOString()
  };

  // Process stops
  const stopsEntry = zip.getEntry('stops.txt');
  if (stopsEntry) {
    const content = stopsEntry.getData().toString('utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    data.stops = records.map(row => ({
      stop_id: row.stop_id,
      stop_name: row.stop_name,
      stop_lat: parseFloat(row.stop_lat),
      stop_lon: parseFloat(row.stop_lon)
    }));
    console.log(`✅ Processed ${data.stops.length} stops`);
  }

  // Process routes
  const routesEntry = zip.getEntry('routes.txt');
  if (routesEntry) {
    const content = routesEntry.getData().toString('utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    data.routes = records.map(row => ({
      route_id: row.route_id,
      route_short_name: row.route_short_name,
      route_long_name: row.route_long_name
    }));
    console.log(`✅ Processed ${data.routes.length} routes`);
  }

  // Process trips to get route-stop associations
  const tripsEntry = zip.getEntry('trips.txt');
  const stopTimesEntry = zip.getEntry('stop_times.txt');
  
  if (tripsEntry && stopTimesEntry) {
    // First, build trip to route mapping
    const tripsContent = tripsEntry.getData().toString('utf8');
    const trips = parse(tripsContent, { columns: true, skip_empty_lines: true });
    const tripToRoute = {};
    trips.forEach(trip => {
      tripToRoute[trip.trip_id] = trip.route_id;
    });

    // Then process stop times to build stop-route associations
    const stopTimesContent = stopTimesEntry.getData().toString('utf8');
    const stopTimes = parse(stopTimesContent, { columns: true, skip_empty_lines: true });
    
    // Build stop to routes mapping
    stopTimes.forEach(st => {
      const routeId = tripToRoute[st.trip_id];
      if (routeId) {
        if (!data.stopRoutes[st.stop_id]) {
          data.stopRoutes[st.stop_id] = new Set();
        }
        data.stopRoutes[st.stop_id].add(routeId);
      }
    });

    // Convert sets to arrays
    Object.keys(data.stopRoutes).forEach(stopId => {
      data.stopRoutes[stopId] = Array.from(data.stopRoutes[stopId]);
    });
    
    console.log(`✅ Built stop-route associations for ${Object.keys(data.stopRoutes).length} stops`);
  }

  return data;
}

async function main() {
  try {
    const buffer = await downloadGTFS();
    const data = processGTFS(buffer);
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data));
    const fileSize = fs.statSync(OUTPUT_FILE).size;
    console.log(`✅ Saved GTFS cache to ${OUTPUT_FILE} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log('✅ GTFS cache generation complete!');
  } catch (error) {
    console.error('❌ Error generating GTFS cache:', error);
    process.exit(1);
  }
}

main();