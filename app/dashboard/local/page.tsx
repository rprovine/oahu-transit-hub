"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Bus, Train, Clock, CloudSun, Navigation, Home, Settings, 
  Bell, User, AlertTriangle, TrendingUp, Calendar, DollarSign,
  Route, Zap, Wind, Waves, Mountain, ArrowLeft
} from 'lucide-react';

export default function LocalDashboard() {
  const [savedLocations, setSavedLocations] = useState({
    home: '',
    work: ''
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
  const [selectedTab, setSelectedTab] = useState('main');

  useEffect(() => {
    // Load saved locations from localStorage
    const settings = localStorage.getItem('userSettings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        setSavedLocations({
          home: parsed.homeAddress || '',
          work: parsed.workAddress || ''
        });
      } catch (error) {
        console.error('Error loading saved locations:', error);
      }
    }
    
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
            <button 
              onClick={() => setSelectedTab('routes')}
              className="hover:text-ocean-200 flex items-center gap-2"
            >
              <Route className="h-4 w-4" />
              My Routes
            </button>
            <button 
              onClick={() => setSelectedTab('schedule')}
              className="hover:text-ocean-200 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </button>
            <button 
              onClick={() => setSelectedTab('alerts')}
              className="hover:text-ocean-200 flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Alerts
            </button>
            <Link href="/settings" className="hover:text-ocean-200 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {selectedTab !== 'main' && (
          <div className="mb-6">
            <button 
              onClick={() => setSelectedTab('main')}
              className="flex items-center gap-2 text-ocean-600 hover:text-ocean-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        )}

        {selectedTab === 'routes' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Saved Routes</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">🏠 Home → 🏢 Work</h3>
                    <p className="text-sm text-gray-600">Usually 28 min • Route 8 + Walk</p>
                    <p className="text-xs text-gray-500">Used 15 times this month</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-ocean-600 text-white px-3 py-1 rounded text-sm">Use Route</button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">🏢 Work → 🏪 Ala Moana</h3>
                    <p className="text-sm text-gray-600">Usually 15 min • Walk + Route 20</p>
                    <p className="text-xs text-gray-500">Used 8 times this month</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-ocean-600 text-white px-3 py-1 rounded text-sm">Use Route</button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-ocean-500 pl-4 py-2">
                <h3 className="font-semibold">Work Commute</h3>
                <p className="text-sm text-gray-600">Monday-Friday, 7:30 AM</p>
                <p className="text-xs text-gray-500">🏠 Home → 🏢 Work</p>
              </div>
              <div className="border-l-4 border-tropical-500 pl-4 py-2">
                <h3 className="font-semibold">Grocery Run</h3>
                <p className="text-sm text-gray-600">Saturdays, 10:00 AM</p>
                <p className="text-xs text-gray-500">🏠 Home → 🛒 Foodland</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'alerts' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Transit Alerts & Notifications</h2>
            <div className="space-y-4">
              {liveData.alerts.map((alert, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-semibold capitalize">{alert.type} Alert</h3>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'main' && (
          <>
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
              onClick={() => {
                if (!savedLocations.home || !savedLocations.work) {
                  alert('Please set your home and work addresses in Settings first');
                  window.location.href = '/settings';
                } else {
                  window.location.href = `/trip-planner?origin=${encodeURIComponent(savedLocations.home)}&destination=${encodeURIComponent(savedLocations.work)}`;
                }
              }}
              className="p-3 bg-ocean-50 text-ocean-700 rounded-lg hover:bg-ocean-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠→🏢</div>
              <div className="text-xs">{savedLocations.home && savedLocations.work ? 'Home to Work' : 'Set in Settings'}</div>
            </button>
            <button
              onClick={() => {
                if (!savedLocations.home || !savedLocations.work) {
                  alert('Please set your home and work addresses in Settings first');
                  window.location.href = '/settings';
                } else {
                  window.location.href = `/trip-planner?origin=${encodeURIComponent(savedLocations.work)}&destination=${encodeURIComponent(savedLocations.home)}`;
                }
              }}
              className="p-3 bg-tropical-50 text-tropical-700 rounded-lg hover:bg-tropical-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏢→🏠</div>
              <div className="text-xs">{savedLocations.home && savedLocations.work ? 'Work to Home' : 'Set in Settings'}</div>
            </button>
            <button
              onClick={() => {
                if (!savedLocations.home) {
                  alert('Please set your home address in Settings first');
                  window.location.href = '/settings';
                } else {
                  window.location.href = `/trip-planner?origin=${encodeURIComponent(savedLocations.home)}`;
                }
              }}
              className="p-3 bg-sunset-50 text-sunset-700 rounded-lg hover:bg-sunset-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠</div>
              <div className="text-xs">{savedLocations.home ? 'From Home' : 'Set in Settings'}</div>
            </button>
            <button
              onClick={() => {
                if (!savedLocations.home) {
                  alert('Please set your home address in Settings first');
                  window.location.href = '/settings';
                } else {
                  window.location.href = `/trip-planner?destination=${encodeURIComponent(savedLocations.home)}`;
                }
              }}
              className="p-3 bg-volcanic-50 text-volcanic-700 rounded-lg hover:bg-volcanic-100 transition-colors text-center"
            >
              <div className="text-lg mb-1">🏠</div>
              <div className="text-xs">{savedLocations.home ? 'To Home' : 'Set in Settings'}</div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Quick Actions</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/trip-planner">
              <button className="w-full bg-ocean-600 text-white py-4 rounded-lg font-semibold hover:bg-ocean-700 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2">
                <Navigation className="h-8 w-8" />
                <span>AI Trip Planner</span>
                <span className="text-xs opacity-90">Plan your journey with real-time data</span>
              </button>
            </Link>
            <Link href="/settings">
              <button className="w-full bg-tropical-600 text-white py-4 rounded-lg font-semibold hover:bg-tropical-700 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2">
                <Settings className="h-8 w-8" />
                <span>Manage Settings</span>
                <span className="text-xs opacity-90">Save home, work & favorites</span>
              </button>
            </Link>
            <button 
              onClick={() => setSelectedTab('routes')}
              className="w-full bg-volcanic-600 text-white py-4 rounded-lg font-semibold hover:bg-volcanic-700 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <Route className="h-8 w-8" />
              <span>My Saved Routes</span>
              <span className="text-xs opacity-90">View frequently used trips</span>
            </button>
          </div>
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
        </>
        )}
      </main>
    </div>
  );
}