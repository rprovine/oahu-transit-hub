# 🌺 Oahu Transit Hub - API Documentation

## Overview

The Oahu Transit Hub provides a comprehensive set of APIs for transit planning, location services, cultural education, and tourism industry integration. All APIs are built with TypeScript and follow RESTful principles.

## Base URL

```
https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app/api
```

## Authentication

Most endpoints are public, but some require authentication:
- Partnership APIs require valid partner credentials
- User-specific endpoints require Supabase authentication
- Rate limiting applies to all endpoints

## 📍 Core APIs

### 1. Transit API (`/api/transit`)

**Purpose**: Trip planning and transit route information

#### POST `/api/transit`

**Request Body**:
```json
{
  "action": "plan_trip",
  "origin": {
    "lat": 21.3099,
    "lon": -157.8581
  },
  "destination": {
    "lat": 21.2793,
    "lon": -157.8293
  },
  "time": "2024-01-15T09:00:00Z",
  "mode": "transit"
}
```

**Response**:
```json
{
  "success": true,
  "tripPlan": {
    "routes": [
      {
        "id": "route_1",
        "summary": "Fastest route via Route 20",
        "duration": 45,
        "cost": 3.00,
        "carbonSavings": "2.1kg vs driving",
        "legs": [
          {
            "mode": "WALK",
            "from": "Origin",
            "to": "Ala Moana Center",
            "duration": 8,
            "instructions": "Walk east on Kapiolani Blvd"
          },
          {
            "mode": "TRANSIT",
            "route": "20",
            "routeName": "Route 20 - Airport",
            "from": "Ala Moana Center",
            "to": "Airport",
            "duration": 35
          }
        ]
      }
    ]
  }
}
```

**Supported Actions**:
- `plan_trip`: Generate trip plans between two points
- `get_routes`: Get available routes for a location
- `get_stops_nearby`: Find transit stops near coordinates

### 2. Location Services API (`/api/geocode`)

**Purpose**: Geocoding, reverse geocoding, and location context

#### POST `/api/geocode`

**Request Body**:
```json
{
  "action": "geocode",
  "address": "Waikiki Beach, Honolulu, HI"
}
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "formatted_address": "Waikiki Beach, Honolulu, HI 96815",
      "coordinates": {
        "lat": 21.2767,
        "lon": -157.8262
      },
      "place_id": "ChIJ...",
      "types": ["tourist_attraction", "point_of_interest"]
    }
  ]
}
```

**Supported Actions**:
- `geocode`: Convert address to coordinates
- `reverse_geocode`: Convert coordinates to address
- `get_location_context`: Get cultural and regional information

### 3. Weather API (`/api/weather`)

**Purpose**: Weather data for transit and activity planning

#### GET `/api/weather?lat=21.3099&lon=-157.8581`

**Response**:
```json
{
  "success": true,
  "weather": {
    "condition": "Partly Cloudy",
    "temperature": 82,
    "humidity": 65,
    "windSpeed": 12,
    "uvIndex": 8,
    "visibility": 10,
    "transitImpact": "Normal service",
    "beachConditions": {
      "airTemp": 82,
      "waterTemp": 78,
      "waveHeight": 2.1,
      "windCondition": "Light breeze"
    }
  }
}
```

### 4. Real-time Data API (`/api/realtime`)

**Purpose**: Live transit arrivals and service alerts

#### POST `/api/realtime`

**Request Body**:
```json
{
  "action": "get_arrivals",
  "stopId": "3045",
  "routeId": "20"
}
```

**Response**:
```json
{
  "success": true,
  "arrivals": [
    {
      "routeId": "20",
      "routeName": "Airport",
      "headsign": "Airport via Nimitz Hwy",
      "arrivalTime": "2024-01-15T09:15:00Z",
      "realTime": true,
      "delay": 0,
      "vehicleId": "2045"
    }
  ],
  "alerts": [
    {
      "type": "info",
      "message": "Route 20 operating on normal schedule"
    }
  ]
}
```

## 🏨 Partnership APIs

### 5. Partnership API (`/api/partnerships`)

**Purpose**: Hotel and tourism industry integration

#### POST `/api/partnerships`

**Guest Recommendations**:
```json
{
  "action": "get_guest_recommendations",
  "guestLocation": {
    "lat": 21.2831,
    "lon": -157.8311
  },
  "preferences": ["beaches", "culture", "food"],
  "timeframe": "today"
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": {
    "immediate": [
      {
        "name": "Diamond Head State Monument",
        "hawaiianName": "Lēʻahi",
        "pronunciation": "LEH-ah-hee",
        "description": "Iconic volcanic crater with hiking trail and panoramic views",
        "culturalSignificance": "Named for yellowfin tuna (ahi) that were once abundant here",
        "estimatedVisitDuration": "2-3 hours",
        "crowdLevel": "Medium",
        "sustainabilityTips": [
          "Stay on designated trails to protect native plants",
          "Bring reusable water bottle - no fountains on trail"
        ],
        "transitAccess": "Route 23 to Diamond Head Road"
      }
    ],
    "transportation": {
      "nearestStops": [
        {
          "name": "Waikiki Beach & Kalakaua Ave",
          "distance": "0.2 miles",
          "routes": ["8", "19", "20"]
        }
      ],
      "skylineStatus": "Segment 1 operational"
    },
    "sustainabilityTips": [
      "Use public transit - reduces traffic and supports local infrastructure",
      "Choose reef-safe sunscreen to protect marine ecosystems"
    ]
  }
}
```

**Concierge Insights**:
```json
{
  "action": "get_concierge_insights",
  "partnerType": "hotel"
}
```

**Response**:
```json
{
  "success": true,
  "insights": {
    "trending": {
      "destinations": [
        {
          "name": "Lanikai Beach",
          "trend": "+15%",
          "reason": "Perfect weather conditions"
        }
      ]
    },
    "transportation": {
      "skylineStatus": {
        "operationalSegments": 1,
        "totalSegments": 2,
        "nextOpening": {
          "expectedDate": "Late 2025",
          "segment": "Segment 2 (Pearl Highlands to Chinatown)"
        }
      },
      "recommendedRoutes": [
        {
          "from": "Waikiki Hotels",
          "to": "Airport",
          "best": "HART Skyline (when available) or Route 20"
        }
      ]
    },
    "crowdManagement": {
      "currentHotspots": ["Hanauma Bay (High)", "Diamond Head (Medium)"],
      "alternatives": [
        {
          "instead_of": "Hanauma Bay",
          "try": "Keehole Point Beach",
          "benefit": "75% fewer crowds"
        }
      ]
    },
    "hotelSpecific": {
      "conciergeMetrics": {
        "mostRequestedDestinations": ["Pearl Harbor", "Diamond Head"],
        "averageTransitTime": "35 minutes to major attractions",
        "guestSatisfaction": "4.2/5 for transit recommendations"
      }
    }
  }
}
```

## 🤖 AI Assistant API

### 6. AI API (`/api/ai`)

**Purpose**: Natural language trip planning and assistance

#### POST `/api/ai`

**Request Body**:
```json
{
  "message": "I want to go from Waikiki to Pearl Harbor tomorrow morning, what's the best way?",
  "context": {
    "location": {
      "lat": 21.2767,
      "lon": -157.8262
    },
    "userType": "tourist"
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "For your trip from Waikiki to Pearl Harbor tomorrow morning, I recommend:\n\n🚌 **Best Option: Route 20**\n- Take Route 20 directly from Waikiki\n- Journey time: ~45 minutes\n- Cost: $3.00 with HOLO card\n- Runs every 15 minutes during morning hours\n\n🌺 **Cultural Note**: Pearl Harbor is called \"Pu'uloa\" in Hawaiian, meaning \"long hill.\"\n\n⏰ **Pro Tip**: Leave by 8 AM to avoid crowds and get tickets for USS Arizona Memorial.",
  "suggestedActions": [
    {
      "type": "plan_trip",
      "label": "Get detailed directions",
      "data": {
        "origin": "Waikiki",
        "destination": "Pearl Harbor"
      }
    }
  ]
}
```

## 📊 CRM Integration API

### 7. CRM API (`/api/crm`)

**Purpose**: Customer relationship management and analytics

#### POST `/api/crm`

**Track Activity**:
```json
{
  "action": "track_activity",
  "contactEmail": "guest@example.com",
  "activityType": "destination_favorited",
  "details": {
    "destination_name": "Lanikai Beach",
    "user_location": {
      "lat": 21.3925,
      "lon": -157.7126
    },
    "time_of_day": 14
  }
}
```

**Response**:
```json
{
  "success": true,
  "activityId": "act_123456",
  "contact": {
    "id": "contact_789",
    "email": "guest@example.com",
    "totalActivities": 15,
    "preferences": ["beaches", "hiking", "culture"]
  }
}
```

## 🗺️ Data Models

### Location
```typescript
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
  islandRegion?: 'Honolulu' | 'Windward' | 'North Shore' | 'West Side';
}
```

### Tourist Destination
```typescript
interface TouristDestination {
  name: string;
  hawaiianName?: string;
  pronunciation?: string;
  coordinates: [number, number]; // [lng, lat]
  category: 'Beach' | 'Attraction' | 'Food' | 'Museum' | 'Historical' | 'Hiking';
  description: string;
  culturalSignificance?: string;
  respectfulVisitingTips?: string[];
  sustainabilityTips?: string[];
  estimatedVisitDuration: string;
  crowdLevel: 'Low' | 'Medium' | 'High' | 'Variable';
  safetyLevel: 'High' | 'Medium' | 'Moderate';
  accessibilityInfo?: string;
  bestTimeToVisit?: string;
  nearbyTransitStops: TransitStop[];
}
```

### HART Skyline Station
```typescript
interface SkylineStation {
  id: string;
  name: string;
  hawaiianName?: string;
  coordinates: [number, number];
  isOperational: boolean;
  openingDate: string;
  connections: {
    busRoutes: string[];
    parking?: {
      spaces: number;
      cost: string;
    };
    amenities: string[];
  };
}
```

## 🔒 Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|---------|
| `/api/transit` | 30 requests | 1 minute |
| `/api/ai` | 10 requests | 1 hour |
| `/api/partnerships` | 20 requests | 1 minute |
| `/api/weather` | 60 requests | 1 minute |
| `/api/geocode` | 30 requests | 1 minute |
| `/api/realtime` | 60 requests | 1 minute |

## 🚨 Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  }
}
```

Common error codes:
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_COORDINATES`: Coordinates outside Oahu
- `SERVICE_UNAVAILABLE`: External API temporarily down
- `INVALID_REQUEST`: Missing or invalid parameters
- `AUTHENTICATION_REQUIRED`: Endpoint requires auth

## 🧪 Testing

### Sample Coordinates (Oahu)
- **Waikiki**: `21.2767, -157.8262`
- **Honolulu Airport**: `21.3187, -157.9225`
- **Pearl Harbor**: `21.3617, -158.0636`
- **Diamond Head**: `21.2606, -157.8044`
- **Lanikai Beach**: `21.3925, -157.7126`

### Test API Key
Development testing can use:
```
X-API-Key: test_oahu_transit_hub_dev
```

## 📞 Support

For API support:
- **Email**: api-support@oahutransithub.com
- **Documentation Issues**: Open an issue on GitHub
- **Rate Limit Increases**: Contact partnerships team

## 🔄 API Versioning

Current version: **v1**

All endpoints include version in URL path when needed:
```
/api/v1/transit
```

Breaking changes will introduce new versions while maintaining backwards compatibility.

---

Made with 🌺 in Hawaii | Last updated: August 2024