"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Bus, Train, Clock, CloudSun, Navigation, Home, Settings, 
  Bell, User, AlertTriangle, TrendingUp, Calendar, DollarSign,
  Route, Zap, Wind, Waves, Mountain
} from 'lucide-react';

export default function LocalDashboard() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [savedLocations] = useState({
    home: '123 Keeaumoku St, Honolulu, HI',
    work: '1450 Ala Moana Blvd, Honolulu, HI'
  });
  const [liveData, setLiveData] = useState({
    nextBus: { route: '8', arrival: 5, destination: 'Ala Moana' },
    weather: { temp: 78, condition: 'Partly cloudy', windSpeed: 12 },
    commute: { time: 32, status: 'Normal traffic' },
    alerts: [
      { type: 'weather', message: 'Light rain expected at 3 PM' },
      { type: 'traffic', message: 'UH football game traffic until 9 PM' }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data on component mount
    loadLiveData();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      loadLiveData();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const loadLiveData = async () => {
    try {
      // Get current location (Honolulu downtown as default)
      const lat = 21.3099;
      const lon = -157.8583;
      
      // Fetch weather data
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const weatherData = await weatherResponse.json();
      
      // Fetch nearby bus stops and arrivals
      const transitResponse = await fetch(`/api/transit?action=nearby_stops&lat=${lat}&lon=${lon}`);
      const transitData = await transitResponse.json();
      
      // Fetch service alerts
      const alertsResponse = await fetch('/api/transit?action=alerts');
      const alertsData = await alertsResponse.json();
      
      if (weatherData.success) {
        setLiveData(prev => ({
          ...prev,
          weather: {
            temp: weatherData.weather.temp,
            condition: weatherData.weather.condition,
            windSpeed: weatherData.weather.windSpeed
          }
        }));
      }
      
      if (transitData.success && transitData.stops.length > 0) {
        // Get arrivals for the first nearby stop
        const arrivalsResponse = await fetch(`/api/transit?action=arrivals&stopId=${transitData.stops[0].stop_id}`);
        const arrivalsData = await arrivalsResponse.json();
        
        if (arrivalsData.success && arrivalsData.arrivals.length > 0) {
          const nextArrival = arrivalsData.arrivals[0];
          const arrivalTime = new Date(nextArrival.arrival_time);
          const now = new Date();
          const minutesUntilArrival = Math.max(1, Math.round((arrivalTime.getTime() - now.getTime()) / 60000));
          
          setLiveData(prev => ({
            ...prev,
            nextBus: {
              route: nextArrival.route_name,
              arrival: minutesUntilArrival,
              destination: nextArrival.headsign
            }
          }));
        }
      }
      
      if (alertsData.success) {
        setLiveData(prev => ({
          ...prev,
          alerts: alertsData.alerts.map((alert: any) => ({
            type: alert.severity === 'warning' ? 'traffic' : 'info',
            message: alert.description
          }))
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load live data:', error);
      setLoading(false);
      // Keep existing mock data on error
    }
  };

  const handleSearch = async () => {
    if (!origin || !destination) return;
    
    setIsSearching(true);
    
    try {
      // Geocode addresses
      const [originGeocode, destGeocode] = await Promise.all([
        fetch(`/api/geocode?q=${encodeURIComponent(origin)}`),
        fetch(`/api/geocode?q=${encodeURIComponent(destination)}`)
      ]);
      
      const [originData, destData] = await Promise.all([
        originGeocode.json(),
        destGeocode.json()
      ]);
      
      if (originData.success && destData.success) {
        const originCoords = originData.suggestions[0]?.center;
        const destCoords = destData.suggestions[0]?.center;
        
        if (originCoords && destCoords) {
          // Get directions from multiple sources
          const [routingResponse, transitResponse] = await Promise.all([
            fetch('/api/geocode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                origin: { lat: originCoords[1], lon: originCoords[0] },
                destination: { lat: destCoords[1], lon: destCoords[0] }
              })
            }),
            fetch('/api/transit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'plan_trip',
                origin: { lat: originCoords[1], lon: originCoords[0] },
                destination: { lat: destCoords[1], lon: destCoords[0] }
              })
            })
          ]);
          
          const [routingData, transitData] = await Promise.all([
            routingResponse.json(),
            transitResponse.json()
          ]);
          
          const newRoutes = [];
          
          // Add walking route
          if (routingData.success && routingData.routes.walking?.length > 0) {
            const walk = routingData.routes.walking[0];
            newRoutes.push({
              id: 'walk',
              type: 'greenest',
              duration: `${Math.round(walk.duration / 60)} min`,
              modes: ['walk'],
              steps: [`Walk ${(walk.distance / 1000).toFixed(1)} km to destination`],
              cost: 'Free',
              co2: `${(walk.distance * 0.0002).toFixed(1)} kg saved vs driving`
            });
          }
          
          // Add transit routes
          if (transitData.success && transitData.tripPlan?.plans) {
            transitData.tripPlan.plans.forEach((plan: any, index: number) => {
              newRoutes.push({
                id: `transit-${index}`,
                type: index === 0 ? 'fastest' : 'cheapest',
                duration: `${Math.round(plan.duration / 60)} min`,
                modes: plan.legs.map((leg: any) => leg.mode.toLowerCase()),
                steps: plan.legs.map((leg: any) => 
                  leg.mode === 'TRANSIT' ? 
                    `${leg.route} → ${leg.to.name}` :
                    `${leg.mode} to ${leg.to.name} (${Math.round(leg.duration / 60)} min)`
                ),
                cost: `$${plan.cost || 2.75}`,
                co2: '3.2 kg saved vs driving'
              });
            });
          }
          
          setRoutes(newRoutes.length > 0 ? newRoutes : [
            {
              id: 'fallback',
              type: 'fastest',
              duration: '30 min',
              modes: ['bus', 'walk'],
              steps: ['Walk to bus stop', 'Take TheBus', 'Walk to destination'],
              cost: '$2.75',
              co2: '2.5 kg saved vs driving'
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Route search error:', error);
      // Fallback to mock data
      setRoutes([
        {
          id: 'fallback',
          type: 'fastest',
          duration: '30 min',
          modes: ['bus', 'walk'],
          steps: ['Walk to bus stop', 'Take TheBus', 'Walk to destination'],
          cost: '$2.75',
          co2: '2.5 kg saved vs driving'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-white">
      <header className="bg-ocean-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-ocean-200">
              Oahu Transit Hub - Kama'āina
            </h1>
          </Link>
          <nav className="flex gap-4">
            <button className="hover:text-ocean-200 flex items-center gap-2">
              <Route className="h-4 w-4" />
              My Routes
            </button>
            <button className="hover:text-ocean-200 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </button>
            <button className="hover:text-ocean-200 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </button>
            <button className="hover:text-ocean-200 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Live Alerts */}
        {liveData.alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Live Alerts</h3>
            </div>
            {liveData.alerts.map((alert, idx) => (
              <p key={idx} className="text-sm text-yellow-700">• {alert.message}</p>
            ))}
          </div>
        )}

        {/* Quick Routes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Routes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => {setOrigin(savedLocations.home); setDestination(savedLocations.work);}}
              className="p-3 bg-ocean-50 text-ocean-700 rounded-lg hover:bg-ocean-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠→🏢</div>
              <div className="text-xs">Home to Work</div>
            </button>
            <button
              onClick={() => {setOrigin(savedLocations.work); setDestination(savedLocations.home);}}
              className="p-3 bg-tropical-50 text-tropical-700 rounded-lg hover:bg-tropical-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏢→🏠</div>
              <div className="text-xs">Work to Home</div>
            </button>
            <button
              onClick={() => setOrigin(savedLocations.home)}
              className="p-3 bg-sunset-50 text-sunset-700 rounded-lg hover:bg-sunset-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠</div>
              <div className="text-xs">From Home</div>
            </button>
            <button
              onClick={() => setDestination(savedLocations.home)}
              className="p-3 bg-volcanic-50 text-volcanic-700 rounded-lg hover:bg-volcanic-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠</div>
              <div className="text-xs">To Home</div>
            </button>
          </div>
        </div>

        {/* Trip Planning */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Plan Your Commute</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Home, work, or address..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Destination..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleSearch}
              disabled={!origin || !destination || isSearching}
              className="bg-ocean-600 text-white py-3 rounded-lg font-semibold hover:bg-ocean-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <Navigation className="h-5 w-5" />
              {isSearching ? 'Finding Routes...' : 'Find Routes'}
            </button>
            <Link href="/trip-planner">
              <button className="w-full bg-volcanic-600 text-white py-3 rounded-lg font-semibold hover:bg-volcanic-700 transition-colors flex items-center justify-center gap-2">
                <Zap className="h-5 w-5" />
                AI Trip Planner
              </button>
            </Link>
          </div>

          {/* Route Results */}
          {routes.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Route Options</h3>
              {routes.map((route) => (
                <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-semibold text-lg">{route.duration}</span>
                      <span className="ml-2 text-sm bg-ocean-100 text-ocean-800 px-2 py-1 rounded">
                        {route.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{route.cost}</p>
                      <p className="text-sm text-green-600">{route.co2}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {route.steps.map((step: string, idx: number) => (
                      <p key={idx} className="text-sm text-gray-600">• {step}</p>
                    ))}
                  </div>
                  <button className="mt-3 bg-ocean-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-ocean-700">
                    Select Route
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Data Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Bus className="h-8 w-8 text-ocean-600" />
              <h3 className="text-lg font-semibold">Next Bus</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">Route {liveData.nextBus.route}</p>
            <p className="text-gray-600">{liveData.nextBus.arrival} min to {liveData.nextBus.destination}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <CloudSun className="h-8 w-8 text-tropical-600" />
              <h3 className="text-lg font-semibold">Weather</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">{liveData.weather.temp}°F</p>
            <p className="text-gray-600">{liveData.weather.condition}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-sunset-600" />
              <h3 className="text-lg font-semibold">Commute</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">{liveData.commute.time} min</p>
            <p className="text-gray-600">{liveData.commute.status}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold">Monthly Savings</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">$247</p>
            <p className="text-gray-600">vs driving</p>
          </div>
        </div>

        {/* Saved Routes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Saved Routes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">🏠 Home → 🏢 Work</p>
                <p className="text-sm text-gray-600">Usually 28 min • Route 8 + Walk</p>
              </div>
              <button className="text-ocean-600 hover:text-ocean-700">
                <Navigation className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">🏢 Work → 🏪 Ala Moana</p>
                <p className="text-sm text-gray-600">Usually 15 min • Walk + Route 20</p>
              </div>
              <button className="text-ocean-600 hover:text-ocean-700">
                <Navigation className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}