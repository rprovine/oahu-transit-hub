const gtfsCache = require('./lib/data/gtfs-cache.json');

// Test coordinates for Kapolei (91-1020 Palala Street)
const kapoleiLat = 21.3285;
const kapoleiLon = -158.086;

// Test coordinates for Honolulu (845 Gulick Avenue)
const gulickLat = 21.3244;
const gulickLon = -157.878;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function findNearbyStops(lat, lon, radiusKm = 0.8) {
  const nearbyStops = gtfsCache.stops
    .map(stop => ({
      ...stop,
      distance: calculateDistance(lat, lon, stop.stop_lat, stop.stop_lon)
    }))
    .filter(stop => stop.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
  
  return nearbyStops;
}

console.log('Testing Kapolei area stops:');
const kapoleiStops = findNearbyStops(kapoleiLat, kapoleiLon, 0.8);
console.log('Found', kapoleiStops.length, 'stops near Kapolei');
if (kapoleiStops.length > 0) {
  console.log('Nearest stops:');
  kapoleiStops.slice(0, 5).forEach(stop => {
    const routes = gtfsCache.stopRoutes[stop.stop_id] || [];
    console.log(`  - ${stop.stop_name} (${(stop.distance * 1000).toFixed(0)}m) - Routes: ${routes.join(', ')}`);
  });
}

console.log('\nTesting Gulick area stops:');
const gulickStops = findNearbyStops(gulickLat, gulickLon, 0.8);
console.log('Found', gulickStops.length, 'stops near Gulick');
if (gulickStops.length > 0) {
  console.log('Nearest stops:');
  gulickStops.slice(0, 5).forEach(stop => {
    const routes = gtfsCache.stopRoutes[stop.stop_id] || [];
    console.log(`  - ${stop.stop_name} (${(stop.distance * 1000).toFixed(0)}m) - Routes: ${routes.join(', ')}`);
  });
}

// Check for common routes
console.log('\nChecking for direct routes:');
let foundDirect = false;
for (const kStop of kapoleiStops.slice(0, 5)) {
  const kRoutes = gtfsCache.stopRoutes[kStop.stop_id] || [];
  for (const gStop of gulickStops.slice(0, 5)) {
    const gRoutes = gtfsCache.stopRoutes[gStop.stop_id] || [];
    const common = kRoutes.filter(r => gRoutes.includes(r));
    if (common.length > 0) {
      foundDirect = true;
      console.log(`  - Route ${common.join(', ')} connects ${kStop.stop_name} to ${gStop.stop_name}`);
    }
  }
}
if (!foundDirect) {
  console.log('  - No direct routes found, transfers required');
}
