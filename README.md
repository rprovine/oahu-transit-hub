# 🌺 Oahu Transit Hub

A comprehensive public transit application for Oahu, Hawaii, featuring real-time bus and rail tracking, AI-powered trip planning, and weather-aware routing optimized for both locals (Kama'āina) and tourists (Malihini).

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)

## 🚀 Features

### Core Functionality
- **Dual User Experience**: Tailored interfaces for locals and tourists
- **Real-Time Transit Tracking**: Live bus and rail location updates
- **Weather-Aware Routing**: Routes adjust based on current weather conditions
- **AI Trip Assistant**: Natural language trip planning in English and Hawaiian
- **Offline Support**: Progressive Web App with offline map caching
- **Multi-Modal Transportation**: Bus, rail, and walking directions

### Integrated APIs
1. **StormGlass Marine API**: Ocean conditions for beach routes
2. **OpenWeather API**: Real-time weather data
3. **Mapbox**: Interactive mapping and navigation
4. **Claude AI (Anthropic)**: Intelligent trip planning
5. **HubSpot CRM**: Customer lifecycle management
6. **GTFS Real-Time**: Live transit feed data
7. **Supabase**: Backend infrastructure and authentication

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
   Then edit `.env.local` with your API keys and configuration.

4. **Set up Supabase database**
   
   Run the SQL scripts in the `supabase/` directory in your Supabase SQL editor.

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) to view the application.

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

Ensure all environment variables are set in your deployment platform:
- All API keys from `.env.example`
- Set `NODE_ENV=production`
- Update `NEXT_PUBLIC_APP_URL` to your production domain

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

- [Live Demo](https://oahu-transit-hub.vercel.app)
- [Documentation](https://github.com/rprovine/oahu-transit-hub)

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