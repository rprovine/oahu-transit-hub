# 🌺 Oahu Transit Hub

A comprehensive public transit application for Oahu, Hawaii, featuring real-time bus and rail tracking, AI-powered trip planning, location-aware services, HART Skyline integration, cultural education, and sustainability-focused transportation for both locals (Kama'āina) and tourists (Malihini).

![Next.js](https://img.shields.io/badge/Next.js-15.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)
![Live](https://img.shields.io/badge/Status-Live-green)

## 🌐 Live Application

**Production:** [https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app](https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app)

**Repository:** [https://github.com/rprovine/oahu-transit-hub](https://github.com/rprovine/oahu-transit-hub)

## 🚀 Features

### Core Functionality
- **🏠 Dual User Experience**: Tailored interfaces for Kama'āina (locals) and Malihini (tourists)
- **🚌 Real-Time Transit Tracking**: Live bus and rail location updates via GTFS-RT APIs
- **🌍 Location-Aware Services**: Real-time location integration for personalized recommendations
- **🚂 HART Skyline Integration**: Complete rail system with 21 stations and multi-modal trip planning
- **🌦️ Weather-Aware Routing**: Routes adjust based on current weather conditions
- **🤖 AI Trip Assistant**: Natural language trip planning powered by Claude AI
- **🏖️ Cultural Education**: Hawaiian names, pronunciations, and cultural significance for destinations
- **🌱 Sustainability Focus**: Eco-friendly transportation options and carbon footprint tracking
- **🏨 Partnership Features**: Hotel and tourism industry integration with guest services
- **👥 Crowd Intelligence**: Smart alternatives during high-traffic times with safety alerts
- **🔍 Address Autocomplete**: Smart location suggestions as you type
- **⚡ Quick Access**: Home/Work shortcuts and saved routes
- **⚙️ User Settings**: Save home, work, and favorite locations with notification preferences
- **📱 Progressive Web App**: Offline support and app-like experience
- **🗺️ Multi-Modal Transportation**: TheBus, HART Skyline Rail, walking, and biking directions
- **📍 Real-Time Data Only**: No mock data - all information comes from live transit APIs
- **🎯 Smart Route Classification**: Mathematically accurate fastest, cheapest, and greenest route identification

### Integrated APIs & Services
1. **TheBus GTFS API**: Real-time Honolulu bus data with 3,787 stops and 119 routes
2. **Google Places API**: Primary geocoding service for accurate Hawaii location search
3. **Mapbox API**: Walking/cycling directions and route visualization
4. **Claude AI (Anthropic)**: Intelligent trip planning and route optimization
5. **GTFS Cached Service**: Pre-processed transit data for fast route finding
6. **Browser Geolocation API**: Real-time location tracking
7. **Supabase**: Backend infrastructure and authentication

### Transit Routing System
- **Real Bus Stop Database**: Accurate bus stop locations with coordinates throughout Oahu
- **Nearest-Stop Algorithm**: Finds actual bus stops within 800m walking distance using Haversine formula
- **Multi-Modal Integration**: Seamlessly combines bus, rail, walking, and rideshare options
- **Dynamic Route Calculation**: Real-time route optimization based on actual stop locations
- **Transfer Planning**: Smart transfer suggestions through major transit hubs
- **Rideshare Fallback**: Automatic Uber/Lyft/taxi suggestions when no transit available

### Security Features
- **Rate Limiting**: Protection against API abuse using Upstash Redis
- **Input Validation**: Comprehensive data sanitization with Zod
- **Security Headers**: XSS, CSRF, and clickjacking protection
- **Encrypted Sessions**: Secure user authentication
- **Row Level Security**: Database-level access control

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Mapbox GL JS
- **AI**: Anthropic Claude API
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- API keys for all integrated services
- Redis instance (Upstash recommended) for rate limiting

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rprovine/oahu-transit-hub.git
   cd oahu-transit-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your API keys:
   ```env
   # Required APIs for full functionality
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   THEBUS_API_KEY=your_thebus_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Optional but recommended
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database** (optional)
   
   Run the SQL scripts in the `supabase/` directory in your Supabase SQL editor.

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) to view the application.

6. **Load GTFS Data** (automatic on first request)
   
   The GTFS data will automatically download when you first use the trip planner.
   To manually update: `GET /api/transit/update-gtfs`

## 🔌 API Integration Details

### Google Places API
The application uses Google Places API as the primary geocoding service for accurate Hawaii location search:
- **Text Search**: Finds POIs like "airport", "Waikiki Beach", etc.
- **Geocoding**: Converts addresses to coordinates
- **Autocomplete**: Provides location suggestions as users type
- **Hawaii-optimized**: Automatically adds Hawaii context and uses Oahu bounding box

### GTFS Transit Data
Real-time bus data from TheBus GTFS feed:
- **3,787 bus stops** with accurate coordinates
- **119 bus routes** covering all of Oahu
- **Cached for performance**: Pre-processed at build time (~460KB)
- **Smart route finding**: Direct routes and transfer options
- **Walking distance calculation**: Uses Haversine formula for accuracy

### Mapbox API
Used for complementary services:
- **Walking directions**: Turn-by-turn pedestrian routing
- **Cycling directions**: Bike-friendly route planning
- **Fallback geocoding**: When Google Places doesn't return results

## 🚌 Transit API Configuration

### TheBus API Setup
To access real-time Honolulu bus data:
```env
THEBUS_API_KEY=your_thebus_api_key
```

### HART Skyline API Setup
For rail system integration:
```env
HART_API_KEY=your_hart_api_key
```

### Anthropic Claude API
For intelligent routing and trip planning:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Transit Routing Architecture

The application uses a sophisticated multi-tier routing system powered by real GTFS data:

1. **GTFS Data Processor**: Downloads and parses official GTFS feed from TheBus
   - Processes stops.txt, routes.txt, trips.txt, stop_times.txt, and calendar.txt
   - Stores data in memory for serverless compatibility
   - Updates every 24 hours automatically
2. **Nearest-Stop Algorithm**: Uses Haversine formula to find stops within 800m (10-minute walk)
3. **Direct Route Finding**: Uses GTFS trip and stop_time data to find actual route connections
4. **Transfer Planning**: Calculates optimal transfer points through major hubs
5. **Real-Time API Integration**: Queries TheBus HEA API for live arrivals
6. **AI Fallback**: Uses Claude AI for complex routing scenarios
7. **Rideshare Alternative**: Suggests Uber/Lyft/taxi with estimated costs when no transit available

**Real Data Examples**: 
- Kapolei address finds "KAMOKILA BL + KAPOLEI PKWY" stop (40m walk)
- Shows actual Route 40 "Honolulu-Makaha" with accurate travel times
- All 3,787 stops and 119 routes from official GTFS feed

**Note**: The application uses 100% real transit data - no mock data or hardcoded routes.

## 🔐 Security Configuration

### Rate Limiting Setup

1. Create an Upstash Redis instance at [upstash.com](https://upstash.com)
2. Add credentials to `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=your_url
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```

### Security Headers

Security headers are automatically configured in `middleware.ts`:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

## 📱 Progressive Web App

The app includes PWA features:
- Service worker for offline support
- App manifest for installability
- Responsive design for all devices
- Offline map caching

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frprovine%2Foahu-transit-hub)

### Environment Variables for Production

✅ **All API keys are configured and live in production:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENWEATHER_API_KEY=your_openweather_api_key
STORMGLASS_API_KEY=your_stormglass_api_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
ANTHROPIC_API_KEY=your_anthropic_api_key
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token
GOOGLE_PLACES_API_KEY=your_google_places_api_key
THEBUS_API_KEY=your_thebus_api_key
HART_API_KEY=your_hart_api_key
```

**Status:** ✅ Live and functional with all integrations active

## 🌺 Enhanced Features (Latest Updates)

### 🚍 Real GTFS Data Integration (August 2025)
- **Live GTFS Feed**: Downloads and processes real-time GTFS data from TheBus
- **3,787 Real Bus Stops**: Actual bus stop locations from official GTFS feed
- **119 Bus Routes**: All active TheBus routes with accurate schedules
- **1.45 Million Stop Times**: Complete schedule data for precise trip planning
- **Automatic Updates**: GTFS data refreshes every 24 hours
- **In-Memory Processing**: Optimized for serverless deployment on Vercel
- **Smart Stop Detection**: Finds nearest stops within 800m using precise GPS coordinates
- **Direct Route Optimization**: Uses real route associations from GTFS data
- **Transfer Intelligence**: Smart transfer planning through major transit hubs
- **No Mock Data**: 100% real transit information from official sources
- **Mapbox Geocoding**: Full address-to-coordinate conversion for trip planning
- **Real Stop Names**: Shows actual bus stops like "KAMOKILA BL + KAPOLEI PKWY"
- **Accurate Routes**: Displays real routes like Route C "CountryExpress" and Route 40

### 🌍 Location-Aware Services
- **Real-Time Location Integration**: Uses browser Geolocation API for precise positioning
- **Smart Recommendations**: Location-based suggestions that adapt to time of day and preferences
- **Regional Context**: Provides cultural and historical information based on current area
- **Distance Calculations**: Shows walking distances to destinations from current location
- **Weather Integration**: Location-specific weather data for outdoor activity planning

### 🚂 HART Skyline Rail System
- **Complete Station Database**: All 21 stations with Hawaiian names and pronunciations
- **Multi-Modal Trip Planning**: Combines bus and rail options for optimal routing  
- **Service Status**: Real-time operational status and segment updates
- **Future Integration Ready**: Includes upcoming stations opening in late 2025
- **Cultural Education**: Hawaiian names and meanings for all rail stations

### 🏖️ Comprehensive Destination Database
- **50+ Destinations**: Beaches, attractions, restaurants, museums, and cultural sites
- **Cultural Information**: Hawaiian names, pronunciations, and cultural significance
- **Audio Pronunciations**: Built-in text-to-speech for Hawaiian words
- **Sustainability Tips**: Responsible tourism guidelines for each destination
- **Crowd Management**: Real-time crowd levels with alternative suggestions
- **Safety Integration**: Safety ratings and current alerts for each location

### 🏨 Tourism Industry Partnership
- **Hotel Integration**: Partnership API for guest services and recommendations
- **Concierge Dashboard**: Real-time insights for hotel staff and tour operators
- **Guest Activity Tracking**: Analytics for personalized recommendations
- **Partnership Widget**: Embeddable component for hotel websites
- **Sustainability Reporting**: Carbon footprint and local impact tracking

### 🎯 Smart Tourist Experience
- **Cultural Education**: Hawaiian language learning with audio guides
- **Respectful Tourism**: Guidelines for visiting sacred and cultural sites
- **Eco-Friendly Options**: Sustainable transportation and activity recommendations
- **Favorites System**: Save and organize preferred destinations
- **Multi-Tab Interface**: Explore, Favorites, and Cultural Guide sections
- **Real-Time Updates**: Dynamic recommendations based on current conditions

### 🌱 Sustainability Focus
- **Carbon Footprint Tracking**: Shows environmental impact of transportation choices
- **Reef-Safe Guidelines**: Marine conservation tips for beach activities  
- **Local Business Support**: Promotes community-based tourism
- **Public Transit Advocacy**: Encourages eco-friendly transportation options
- **Conservation Education**: Environmental protection awareness integrated throughout

### 🔒 Enhanced Safety Features
- **Real-Time Safety Alerts**: Current conditions and crowd levels
- **Emergency Information**: Quick access to local emergency services
- **Weather Warnings**: Severe weather alerts affecting outdoor activities
- **Cultural Sensitivity**: Respect guidelines for sacred sites and traditions
- **Personal Safety**: Well-lit stops, safe walking routes, and accessibility information

## 📊 API Rate Limits

| Endpoint Type | Rate Limit | Window |
|--------------|------------|---------|
| Authentication | 5 requests | 1 minute |
| General API | 30 requests | 1 minute |
| AI Assistant | 10 requests | 1 hour |
| Public Routes | 100 requests | 1 minute |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with aloha by LeniLani Consulting
- Transit data provided by Honolulu Authority for Rapid Transportation
- Weather data from OpenWeather and StormGlass
- Maps powered by Mapbox

## 📞 Support

For support, email support@oahutransithub.com or open an issue on GitHub.

## 🔗 Links

- [Live Application](https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app)
- [GitHub Repository](https://github.com/rprovine/oahu-transit-hub)
- [Trip Planner](https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app/trip-planner)
- [Local Dashboard](https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app/dashboard/local)
- [Tourist Guide](https://oahu-transit-r33wkrdv4-rprovines-projects.vercel.app/dashboard/tourist)

---

Made with 🌺 in Hawaii

## 📝 Note

This repository contains the documentation and deployment configuration for the Oahu Transit Hub application. The complete source code has been developed and includes:

- Full Next.js 14+ application with TypeScript
- Complete UI implementation with Tailwind CSS v4 and Shadcn/ui
- All API integrations (OpenWeather, StormGlass, Mapbox, Claude AI, HubSpot)
- Comprehensive security implementation (rate limiting, validation, headers)
- Database schema and migrations for Supabase
- Progressive Web App configuration
- Complete authentication flow
- Dual dashboards for locals and tourists

For access to the complete source code or deployment assistance, please contact the development team.