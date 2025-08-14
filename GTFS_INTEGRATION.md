# GTFS Integration Documentation

## Overview

The Oahu Transit Hub now uses **100% real GTFS data** from TheBus, providing accurate bus stop locations, routes, and schedules for the entire island of Oahu.

## Data Statistics

- **3,787 Real Bus Stops**: Actual stop locations with GPS coordinates
- **119 Bus Routes**: All active TheBus routes
- **1.45 Million Stop Times**: Complete schedule data
- **36,456 Trips**: Individual bus trips with headsigns
- **130 Calendar Entries**: Service day patterns

## Technical Implementation

### 1. GTFS Memory Processor

Located at `/lib/services/gtfs-memory-processor.ts`, this service:

- Downloads GTFS data from https://www.thebus.org/transitdata/production/google_transit.zip
- Processes the data entirely in memory (no filesystem writes)
- Optimized for Vercel serverless deployment
- Caches data for 24 hours before refresh

### 2. Data Processing

The processor handles these GTFS files:
- `stops.txt` - Bus stop locations and names
- `routes.txt` - Route information and colors
- `stop_times.txt` - Arrival/departure times
- `trips.txt` - Trip patterns and headsigns
- `calendar.txt` - Service days

### 3. Route Finding Algorithm

```typescript
// Find stops near origin and destination
const originStops = gtfsMemoryProcessor.findNearbyStops(lat, lon, 0.8); // 800m radius

// Get routes serving each stop
const routes = gtfsMemoryProcessor.getRoutesForStop(stopId);

// Find common routes between stops
const directRoutes = findDirectConnections(originStops, destStops);
```

### 4. API Endpoints

#### Update GTFS Data
```
GET /api/transit/update-gtfs
POST /api/transit/update-gtfs (force update)
```

#### Trip Planning
```
POST /api/transit
{
  "action": "plan_trip",
  "origin": {"lat": 21.3285, "lon": -158.0860},
  "destination": {"lat": 21.336, "lon": -157.914}
}
```

## Real-World Examples

### Kapolei to Downtown Honolulu

**Input**: 91-1020 Palala Street, Kapolei → 845 Gulick Avenue, Honolulu

**Result**:
1. Walk 40m to "KAMOKILA BL + KAPOLEI PKWY (east)"
2. Take Route 40 "Honolulu-Makaha"
3. Travel for ~43 minutes
4. Walk 95m to destination

### Key Features

1. **Accurate Stop Names**: Real stop names from GTFS data
   - "KAMOKILA BL + KAPOLEI PKWY"
   - "WAKEA ST + HAUMEA ST"
   - "NIMITZ HWY + PAIEA ST"

2. **Real Routes**: Actual TheBus routes
   - Route C "CountryExpress"
   - Route 40 "Honolulu-Makaha"
   - Route 42 "Ewa Beach-Waikiki"

3. **Precise Walking Distances**: Calculated from actual stop locations
   - Shows exact distance in meters
   - Walking time at 80m/min pace

## Configuration

### Required Environment Variables

```env
# Mapbox for geocoding addresses
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# TheBus API for real-time arrivals (optional)
THEBUS_API_KEY=your_thebus_api_key

# Claude AI for complex routing (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Memory Management

The GTFS processor is optimized for serverless:

- Stores all data in memory (no disk writes)
- Processes CSV files using streaming
- Singleton pattern prevents duplicate loads
- 24-hour cache reduces API calls

## Performance

- Initial GTFS download: ~8-10 seconds
- Stop finding: <100ms
- Route calculation: <500ms
- Memory usage: ~200MB when loaded

## Deployment

The system works seamlessly on Vercel:

1. First request triggers GTFS download
2. Data stored in memory for function lifetime
3. Automatic refresh after 24 hours
4. No filesystem dependencies

## Testing

Test the integration:

```bash
# Download GTFS data
curl http://localhost:3001/api/transit/update-gtfs

# Plan a trip
curl -X POST http://localhost:3001/api/transit \
  -H "Content-Type: application/json" \
  -d '{
    "action": "plan_trip",
    "origin": {"lat": 21.3285, "lon": -158.0860},
    "destination": {"lat": 21.336, "lon": -157.914}
  }'
```

## Troubleshooting

### No Routes Found
- Check if GTFS data is loaded: `/api/transit/update-gtfs`
- Verify coordinates are within Oahu bounds
- Ensure stops exist within 800m radius

### Geocoding Errors
- Verify Mapbox token is set
- Check address format includes "Hawaii" or "HI"

### Memory Issues
- GTFS data uses ~200MB RAM
- Vercel functions have 1GB limit
- Data automatically refreshes after 24 hours

## Future Enhancements

1. **Real-time arrivals**: Integrate TheBus HEA API
2. **Service alerts**: Add GTFS-RT alerts feed
3. **Trip patterns**: Optimize using shapes.txt
4. **Fare calculation**: Implement fare_rules.txt
5. **Accessibility**: Use wheelchair_boarding data

## Credits

- GTFS data provided by TheBus (Honolulu Authority for Rapid Transportation)
- Geocoding powered by Mapbox
- Trip planning enhanced by Claude AI