"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Navigation, Clock, DollarSign, Zap, 
  Bus, Train, Palmtree, Waves, Mountain, Camera,
  ChevronRight, Star, ArrowRight, Route, Users
} from 'lucide-react';

interface TripStep {
  mode: 'walk' | 'bus' | 'rail' | 'wait';
  instruction: string;
  duration: number;
  route?: string;
  color?: string;
}

interface RouteOption {
  id: string;
  totalTime: number;
  totalCost: number;
  co2Saved: number;
  steps: TripStep[];
  type: 'fastest' | 'cheapest' | 'greenest';
}

export default function TripPlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [departureTime, setDepartureTime] = useState('now');
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [savedLocations, setSavedLocations] = useState({
    home: '123 Keeaumoku St, Honolulu, HI',
    work: '1450 Ala Moana Blvd, Honolulu, HI',
    favorites: [
      'Waikiki Beach, Honolulu, HI',
      'Diamond Head State Monument, Honolulu, HI',
      'Pearl Harbor National Memorial, Honolulu, HI'
    ]
  });

  const popularDestinations = [
    { name: 'Waikiki Beach', icon: '🏖️', category: 'Beach' },
    { name: 'Diamond Head', icon: '🏔️', category: 'Attraction' },
    { name: 'Ala Moana Center', icon: '🛍️', category: 'Shopping' },
    { name: 'Pearl Harbor', icon: '⚓', category: 'Historical' },
    { name: 'Lanikai Beach', icon: '🌊', category: 'Beach' },
    { name: 'North Shore', icon: '🏄', category: 'Adventure' }
  ];

  const oahuLocations = [
    'Honolulu International Airport, Honolulu, HI',
    'University of Hawaii at Manoa, Honolulu, HI',
    'Kapiolani Community College, Honolulu, HI',
    'Kahala Mall, Honolulu, HI',
    'Pearlridge Center, Aiea, HI',
    'Windward Mall, Kaneohe, HI',
    'Kailua Beach, Kailua, HI',
    'Hanauma Bay Nature Preserve, Honolulu, HI',
    'Polynesian Cultural Center, Laie, HI',
    'Dole Plantation, Wahiawa, HI',
    'Koko Head Crater Trail, Honolulu, HI',
    'Makapuu Lighthouse, Honolulu, HI'
  ];

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    if (value.length > 2) {
      const suggestions = oahuLocations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setOriginSuggestions(suggestions.slice(0, 5));
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (value.length > 2) {
      const suggestions = oahuLocations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setDestinationSuggestions(suggestions.slice(0, 5));
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectOrigin = (location: string) => {
    setOrigin(location);
    setShowOriginSuggestions(false);
  };

  const selectDestination = (location: string) => {
    setDestination(location);
    setShowDestinationSuggestions(false);
  };

  const handlePlanTrip = async () => {
    if (!origin || !destination) return;
    
    setIsPlanning(true);
    
    // Simulate API call to trip planning service
    setTimeout(() => {
      const mockRoutes: RouteOption[] = [
        {
          id: 'fastest',
          totalTime: 28,
          totalCost: 2.75,
          co2Saved: 2.1,
          type: 'fastest',
          steps: [
            { mode: 'walk', instruction: 'Walk to Bus Stop A', duration: 3 },
            { mode: 'wait', instruction: 'Wait for Route 8', duration: 2 },
            { mode: 'bus', instruction: 'Route 8 to Ala Moana', duration: 18, route: '8', color: 'blue' },
            { mode: 'walk', instruction: 'Walk to destination', duration: 5 }
          ]
        },
        {
          id: 'cheapest',
          totalTime: 35,
          totalCost: 2.75,
          co2Saved: 3.2,
          type: 'cheapest',
          steps: [
            { mode: 'walk', instruction: 'Walk to Skyline Station', duration: 5 },
            { mode: 'wait', instruction: 'Wait for Rail', duration: 3 },
            { mode: 'rail', instruction: 'Skyline Rail to Kalihi', duration: 15, route: 'Skyline', color: 'green' },
            { mode: 'walk', instruction: 'Walk to Bus Stop', duration: 2 },
            { mode: 'bus', instruction: 'Route 42 to destination', duration: 10, route: '42', color: 'orange' }
          ]
        },
        {
          id: 'greenest',
          totalTime: 42,
          totalCost: 2.75,
          co2Saved: 4.1,
          type: 'greenest',
          steps: [
            { mode: 'walk', instruction: 'Walk to Transit Center', duration: 8 },
            { mode: 'rail', instruction: 'Skyline Rail (clean energy)', duration: 22, route: 'Skyline', color: 'green' },
            { mode: 'walk', instruction: 'Walk to destination', duration: 12 }
          ]
        }
      ];
      
      setRoutes(mockRoutes);
      setIsPlanning(false);
    }, 2000);
  };

  const getModeIcon = (mode: TripStep['mode']) => {
    switch (mode) {
      case 'walk': return '🚶';
      case 'bus': return '🚌';
      case 'rail': return '🚊';
      case 'wait': return '⏳';
      default: return '📍';
    }
  };

  const getRouteTypeColor = (type: RouteOption['type']) => {
    switch (type) {
      case 'fastest': return 'text-blue-600 bg-blue-100';
      case 'cheapest': return 'text-green-600 bg-green-100';
      case 'greenest': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-tropical-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Bus className="h-8 w-8 text-ocean-600" />
              <h1 className="text-2xl font-bold text-volcanic-900">Oahu Transit Hub</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard/local" className="text-gray-600 hover:text-ocean-600">
                Local Dashboard
              </Link>
              <Link href="/dashboard/tourist" className="text-gray-600 hover:text-ocean-600">
                Tourist Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-volcanic-900 mb-4">AI-Powered Trip Planner</h2>
            <p className="text-xl text-gray-600">Plan your journey across Oahu with real-time data and smart routing</p>
          </div>

          {/* Quick Access Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => selectOrigin(savedLocations.home)}
                className="flex items-center gap-2 p-3 bg-ocean-50 text-ocean-700 rounded-lg hover:bg-ocean-100 transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => selectOrigin(savedLocations.work)}
                className="flex items-center gap-2 p-3 bg-tropical-50 text-tropical-700 rounded-lg hover:bg-tropical-100 transition-colors"
              >
                🏢 Work
              </button>
              <button
                onClick={() => selectDestination(savedLocations.home)}
                className="flex items-center gap-2 p-3 bg-sunset-50 text-sunset-700 rounded-lg hover:bg-sunset-100 transition-colors"
              >
                🏠 To Home
              </button>
              <button
                onClick={() => selectDestination(savedLocations.work)}
                className="flex items-center gap-2 p-3 bg-volcanic-50 text-volcanic-700 rounded-lg hover:bg-volcanic-100 transition-colors"
              >
                🏢 To Work
              </button>
            </div>
          </div>

          {/* Trip Planning Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => origin.length > 2 && setShowOriginSuggestions(true)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    placeholder="Enter starting location..."
                  />
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {originSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectOrigin(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onFocus={() => destination.length > 2 && setShowDestinationSuggestions(true)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    placeholder="Enter destination..."
                  />
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {destinationSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectDestination(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                <select 
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="now">Leave Now</option>
                  <option value="depart">Depart At...</option>
                  <option value="arrive">Arrive By...</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handlePlanTrip}
                  disabled={!origin || !destination || isPlanning}
                  className="w-full bg-ocean-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-ocean-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Navigation className="h-5 w-5" />
                  {isPlanning ? 'Planning Trip...' : 'Plan My Trip'}
                </button>
              </div>
            </div>

            {/* Popular Destinations */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Popular Destinations</p>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDestination(dest.name)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <span>{dest.icon}</span>
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Route Options */}
          {routes.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-volcanic-900">Route Options</h3>
              
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                    selectedRoute?.id === route.id ? 'ring-2 ring-ocean-500' : 'hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-volcanic-900">{route.totalTime} min</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRouteTypeColor(route.type)}`}>
                          {route.type}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-volcanic-900">${route.totalCost}</p>
                        <p className="text-xs text-gray-600">Total Cost</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">{route.co2Saved} kg</p>
                        <p className="text-xs text-gray-600">CO₂ Saved</p>
                      </div>
                    </div>
                    
                    <button className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 flex items-center gap-2">
                      Select Route
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Route Steps */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {route.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-lg">{getModeIcon(step.mode)}</span>
                          <div className="text-center">
                            <p className="text-xs font-medium">{step.instruction}</p>
                            <p className="text-xs text-gray-600">{step.duration} min</p>
                          </div>
                        </div>
                        {stepIdx < route.steps.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}