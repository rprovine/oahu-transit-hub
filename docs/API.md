# 🚌 Oahu Transit Hub - API Documentation

## Overview

The Oahu Transit Hub integrates with multiple real-time transit APIs to provide accurate, live transportation data for Oahu, Hawaii. **No mock data is used** - all information comes directly from official transit agency APIs.

## Transit APIs

### 🚌 TheBus GTFS-RT API

**Base URL**: `https://api.thebus.org/gtfs-realtime`

Official real-time data for Honolulu's public bus system.

#### Endpoints Used:

- **GET /routes** - Retrieve all bus routes
- **GET /stops-nearby?lat={lat}&lon={lon}&radius={radius}** - Find nearby bus stops
- **GET /arrivals?stop_id={stop_id}** - Real-time arrival predictions
- **GET /alerts** - Service alerts and disruptions
- **POST /trip-plan** - Trip planning with bus routes

#### Authentication:
```bash
Authorization: Bearer ${THEBUS_API_KEY}
```

### 🚊 HART Skyline GTFS-RT API

**Base URL**: `https://rt.hart.org/gtfs-realtime`

Official real-time data for Honolulu's rail transit system.

#### Endpoints Used:

- **GET /routes** - Retrieve all rail routes
- **GET /stops-nearby?lat={lat}&lon={lon}&radius={radius}** - Find nearby rail stations
- **GET /arrivals?stop_id={stop_id}** - Real-time train arrival predictions
- **GET /alerts** - Rail service alerts and disruptions
- **POST /trip-plan** - Trip planning with rail connections

#### Authentication:
```bash
Authorization: Bearer ${HART_API_KEY}
```

## GTFSService Implementation

Located in `lib/services/gtfs.ts`, this service handles all transit API interactions.

### Key Methods:

#### `getRoutes(): Promise<BusRoute[]>`
Fetches all available bus and rail routes from both APIs.

```typescript
const routes = await gtfsService.getRoutes();
// Returns combined TheBus and HART Skyline routes
```

#### `getNearbyStops(lat: number, lon: number, radius?: number): Promise<BusStop[]>`
Finds transit stops within specified radius of coordinates.

```typescript
const stops = await gtfsService.getNearbyStops(21.3099, -157.8583, 500);
// Returns bus stops and rail stations within 500 meters
```

#### `getStopArrivals(stopId: string): Promise<BusArrival[]>`
Gets real-time arrival predictions for a specific stop.

```typescript
const arrivals = await gtfsService.getStopArrivals('stop_123');
// Returns live arrival times and delays
```

#### `getServiceAlerts(): Promise<ServiceAlert[]>`
Retrieves current service disruptions and alerts.

```typescript
const alerts = await gtfsService.getServiceAlerts();
// Returns active service alerts from both systems
```

#### `planTrip(origin: [number, number], destination: [number, number], time?: string): Promise<any>`
Plans multi-modal trips using real transit data.

```typescript
const plan = await gtfsService.planTrip(
  [-157.8583, 21.3099], // Downtown Honolulu
  [-157.8420, 21.2906], // Ala Moana Center
  'now'
);
```

## Data Types

### BusRoute
```typescript
interface BusRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number; // 3 = Bus, 1 = Rail
  route_color: string;
  route_text_color: string;
}
```

### BusStop
```typescript
interface BusStop {
  stop_id: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  stop_url?: string;
  location_type: number; // 0 = Stop, 1 = Station
  parent_station?: string;
}
```

### BusArrival
```typescript
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
```

### ServiceAlert
```typescript
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
```

## Error Handling

### Graceful Degradation
- **API Failures**: Return empty arrays instead of mock data
- **Network Issues**: Log errors and continue with available data
- **Authentication Errors**: Fallback to basic functionality
- **Rate Limiting**: Implement exponential backoff

### Example Error Handling:
```typescript
try {
  const routes = await this.fetchTheBusRoutes();
  return routes;
} catch (error) {
  console.error('TheBus API error:', error);
  return []; // Never return mock data
}
```

## API Integration Endpoints

### Internal API Routes

#### `/api/transit` (GET/POST)
Main transit API endpoint handling:
- Route queries
- Nearby stop searches
- Arrival predictions
- Service alerts
- Trip planning

#### Example Usage:
```javascript
// Get nearby stops
const response = await fetch('/api/transit?action=nearby_stops&lat=21.3099&lon=-157.8583&radius=500');
const data = await response.json();

// Plan a trip
const response = await fetch('/api/transit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'plan_trip',
    origin: { lat: 21.3099, lon: -157.8583 },
    destination: { lat: 21.2906, lon: -157.8420 }
  })
});
```

## Configuration

### Environment Variables
```env
# Required for transit data
THEBUS_API_KEY=your_thebus_api_key
HART_API_KEY=your_hart_api_key

# Optional fallbacks
GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### API Rate Limits
- **TheBus API**: 1000 requests/hour
- **HART API**: 500 requests/hour
- **Internal APIs**: See main documentation

## Real-Time Features

### Live Vehicle Tracking
- Bus and train positions updated every 30 seconds
- Delay predictions based on traffic conditions
- Route deviation alerts

### Service Disruptions
- Real-time service alerts
- Weather-related delays
- Special event notifications
- Emergency service changes

### Trip Updates
- Dynamic route recalculation
- Alternative route suggestions
- Real-time arrival updates
- Transfer optimization

## Data Privacy

### User Data Protection
- No personal location data stored in APIs
- Trip plans calculated client-side when possible
- Anonymized usage analytics only
- GDPR and CCPA compliant

### API Security
- All API calls authenticated with tokens
- Rate limiting prevents abuse
- Input validation on all endpoints
- Encrypted data transmission

## Monitoring & Analytics

### API Health Monitoring
- Response time tracking
- Error rate monitoring
- Availability alerting
- Performance optimization

### Usage Analytics
- Popular route tracking
- Peak usage analysis
- Feature adoption metrics
- User experience insights

---

## Getting Started

1. **Obtain API Keys**
   - Register with TheBus API
   - Get HART API credentials
   - Configure environment variables

2. **Test Integration**
   ```bash
   npm run dev
   # Navigate to /trip-planner to test APIs
   ```

3. **Monitor Usage**
   - Check API quotas regularly
   - Monitor error rates
   - Review performance metrics

For support with API integration, contact the development team or create an issue on GitHub.