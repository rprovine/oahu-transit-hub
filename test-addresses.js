const gtfsCache = require('./lib/data/gtfs-cache.json');

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

// Test some common Oahu locations
const testLocations = [
  { name: "Waikiki", lat: 21.2793, lon: -157.8294 },
  { name: "Ala Moana Center", lat: 21.2906, lon: -157.8420 },
  { name: "Downtown Honolulu", lat: 21.3099, lon: -157.8583 },
  { name: "Pearl Harbor", lat: 21.3649, lon: -157.9623 },
  { name: "Kailua", lat: 21.3972, lon: -157.7394 },
  { name: "Airport", lat: 21.3187, lon: -157.9180 }
];

console.log('Testing bus stop coverage for common Oahu locations:\n');

testLocations.forEach(loc => {
  const nearbyStops = gtfsCache.stops.filter(stop => {
    const dist = calculateDistance(loc.lat, loc.lon, stop.stop_lat, stop.stop_lon);
    return dist <= 0.8; // 800m radius
  });
  
  console.log(`${loc.name}: ${nearbyStops.length} stops within 800m`);
  if (nearbyStops.length > 0) {
    const closest = nearbyStops.sort((a, b) => {
      const distA = calculateDistance(loc.lat, loc.lon, a.stop_lat, a.stop_lon);
      const distB = calculateDistance(loc.lat, loc.lon, b.stop_lat, b.stop_lon);
      return distA - distB;
    })[0];
    const dist = calculateDistance(loc.lat, loc.lon, closest.stop_lat, closest.stop_lon);
    console.log(`  Nearest: ${closest.stop_name} (${(dist * 1000).toFixed(0)}m)`);
  }
});