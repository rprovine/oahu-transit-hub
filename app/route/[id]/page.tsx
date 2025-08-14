"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Navigation, 
  Bus, Train, Users, Star, AlertTriangle, Route
} from 'lucide-react';

export default function RouteDetails() {
  const params = useParams();
  const routeId = params.id;
  
  const [routeData, setRouteData] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Simulate loading route data
    const mockRouteData = {
      id: routeId,
      name: `Route ${routeId}`,
      from: 'Kalihi Transit Center',
      to: 'Ala Moana Center',
      duration: '28 minutes',
      cost: '$2.75',
      nextDeparture: '5 minutes',
      stops: [
        { name: 'Kalihi Transit Center', time: '2:15 PM', status: 'departed' },
        { name: 'Keeaumoku St', time: '2:22 PM', status: 'upcoming' },
        { name: 'Ward Ave', time: '2:28 PM', status: 'upcoming' },
        { name: 'Ala Moana Center', time: '2:35 PM', status: 'upcoming' }
      ],
      alerts: [
        { type: 'info', message: 'Route running on time' },
        { type: 'warning', message: 'Light traffic on Dillingham Blvd' }
      ]
    };
    
    setRouteData(mockRouteData);
  }, [routeId]);

  const startTracking = () => {
    setIsTracking(true);
    // Simulate live tracking
  };

  if (!routeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading route details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/trip-planner" className="text-ocean-600 hover:text-ocean-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-volcanic-900">{routeData.name}</h1>
              <p className="text-gray-600">{routeData.from} → {routeData.to}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Route Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-volcanic-900">{routeData.duration}</p>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-volcanic-900">{routeData.cost}</p>
                <p className="text-sm text-gray-600">Fare</p>
              </div>
              <div className="text-center">
                <Bus className="h-8 w-8 text-tropical-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-volcanic-900">{routeData.nextDeparture}</p>
                <p className="text-sm text-gray-600">Next Bus</p>
              </div>
              <div className="text-center">
                <button
                  onClick={startTracking}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isTracking 
                      ? 'bg-green-600 text-white' 
                      : 'bg-ocean-600 text-white hover:bg-ocean-700'
                  }`}
                >
                  {isTracking ? 'Tracking...' : 'Track Route'}
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {routeData.alerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Route Alerts
              </h3>
              <div className="space-y-2">
                {routeData.alerts.map((alert: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      alert.type === 'warning' 
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route Stops */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Route Stops</h3>
            <div className="space-y-4">
              {routeData.stops.map((stop: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    stop.status === 'departed' 
                      ? 'bg-green-500' 
                      : stop.status === 'current' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-sm text-gray-600">
                      {stop.status === 'departed' ? 'Departed' : 'Arriving'} at {stop.time}
                    </p>
                  </div>
                  {stop.status === 'current' && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Map Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Live Route Map</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map coming soon</p>
                <p className="text-sm text-gray-500">Real-time bus location and route visualization</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}