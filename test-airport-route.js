const gtfsCache = require('./lib/data/gtfs-cache.json');

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Airport and Waikiki coordinates
const airport = { lat: 21.3187, lon: -157.9180 };
const waikiki = { lat: 21.2793, lon: -157.8294 };

console.log('Testing Airport to Waikiki bus routes:\n');

// Find stops near airport (within 2km)
const airportStops = gtfsCache.stops.filter(stop => {
  const dist = calculateDistance(airport.lat, airport.lon, stop.stop_lat, stop.stop_lon);
  return dist <= 2.0;
}).sort((a, b) => {
  const distA = calculateDistance(airport.lat, airport.lon, a.stop_lat, a.stop_lon);
  const distB = calculateDistance(airport.lat, airport.lon, b.stop_lat, b.stop_lon);
  return distA - distB;
});

// Find stops near Waikiki
const waikikiStops = gtfsCache.stops.filter(stop => {
  const dist = calculateDistance(waikiki.lat, waikiki.lon, stop.stop_lat, stop.stop_lon);
  return dist <= 0.8;
});

console.log(`Airport: ${airportStops.length} stops within 2km`);
console.log(`Waikiki: ${waikikiStops.length} stops within 800m`);

if (airportStops.length > 0) {
  console.log('\nNearest airport stops:');
  airportStops.slice(0, 3).forEach(stop => {
    const dist = calculateDistance(airport.lat, airport.lon, stop.stop_lat, stop.stop_lon);
    const routes = gtfsCache.stopRoutes[stop.stop_id] || [];
    console.log(`  ${stop.stop_name} (${(dist * 1000).toFixed(0)}m)`);
    console.log(`    Routes: ${routes.join(', ')}`);
  });
}

// Check for common routes
const airportRoutes = new Set();
airportStops.forEach(stop => {
  const routes = gtfsCache.stopRoutes[stop.stop_id] || [];
  routes.forEach(r => airportRoutes.add(r));
});

const waikikiRoutes = new Set();
waikikiStops.forEach(stop => {
  const routes = gtfsCache.stopRoutes[stop.stop_id] || [];
  routes.forEach(r => waikikiRoutes.add(r));
});

// Find common routes
const commonRoutes = [...airportRoutes].filter(r => waikikiRoutes.has(r));

console.log('\n🚌 Common routes between Airport and Waikiki:');
if (commonRoutes.length > 0) {
  commonRoutes.forEach(routeId => {
    const route = gtfsCache.routes.find(r => r.route_id === routeId);
    if (route) {
      console.log(`  Route ${route.route_short_name || routeId}: ${route.route_long_name}`);
    }
  });
} else {
  console.log('  ❌ No direct routes found');
  console.log('\nNote: Route 19 or 20 should serve Airport to Waikiki');
  console.log('Airport routes available:', [...airportRoutes].slice(0, 10).join(', '));
  console.log('Waikiki routes available:', [...waikikiRoutes].slice(0, 10).join(', '));
}