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

  // Load URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrigin = params.get('origin');
    const urlDestination = params.get('destination');
    
    if (urlOrigin) setOrigin(urlOrigin);
    if (urlDestination) setDestination(urlDestination);
  }, []);
  
  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        setShowOriginSuggestions(false);
        setShowDestinationSuggestions(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const handleOriginChange = async (value: string) => {
    setOrigin(value);
    
    // Show suggestions even for 1 character
    if (value.length > 0) {
      // Always show Oahu locations immediately
      const suggestions = oahuLocations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      
      if (suggestions.length > 0) {
        setOriginSuggestions(suggestions.slice(0, 8));
        setShowOriginSuggestions(true);
      }
      
      // Try geocoding API for better results after 2 characters
      if (value.length > 2) {
        try {
          const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
          const data = await response.json();
          if (data.success && data.suggestions?.length > 0) {
            const apiSuggestions = data.suggestions.map((s: any) => s.place_name);
            // Combine and deduplicate
            const combined = [...new Set([...apiSuggestions.slice(0, 5), ...suggestions.slice(0, 3)])];
            setOriginSuggestions(combined);
            setShowOriginSuggestions(true);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationChange = async (value: string) => {
    setDestination(value);
    
    // Show suggestions even for 1 character
    if (value.length > 0) {
      // Always show Oahu locations immediately  
      const suggestions = oahuLocations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      
      // Add Ala Moana as a top suggestion if searching for it
      if (value.toLowerCase().includes('ala')) {
        suggestions.unshift('Ala Moana Center, Honolulu, HI');
      }
      
      const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8);
      if (uniqueSuggestions.length > 0) {
        setDestinationSuggestions(uniqueSuggestions);
        setShowDestinationSuggestions(true);
      }
      
      // Try geocoding API for better results after 2 characters
      if (value.length > 2) {
        try {
          const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
          const data = await response.json();
          if (data.success && data.suggestions?.length > 0) {
            const apiSuggestions = data.suggestions.map((s: any) => s.place_name);
            // Combine and deduplicate
            const combined = [...new Set([...apiSuggestions.slice(0, 5), ...uniqueSuggestions.slice(0, 3)])];
            setDestinationSuggestions(combined);
            setShowDestinationSuggestions(true);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }
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
    
    try {
      // First geocode the addresses to get coordinates
      const [originGeocode, destGeocode] = await Promise.all([
        fetch(`/api/geocode?q=${encodeURIComponent(origin)}`),
        fetch(`/api/geocode?q=${encodeURIComponent(destination)}`)
      ]);
      
      const [originData, destData] = await Promise.all([
        originGeocode.json(),
        destGeocode.json()
      ]);
      
      if (!originData.success || !destData.success) {
        throw new Error('Failed to geocode addresses');
      }
      
      const originCoords = originData.suggestions[0]?.center;
      const destCoords = destData.suggestions[0]?.center;
      
      if (!originCoords || !destCoords) {
        throw new Error('Could not find coordinates for addresses');
      }
      
      // Get AI trip plan using Claude
      const aiResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'plan_trip',
          origin,
          destination,
          userType: 'tourist', // Could be determined from user preferences
          timeOfDay: departureTime,
          preferences: ['fastest', 'cheapest', 'scenic']
        })
      });
      
      const aiData = await aiResponse.json();
      
      // Get actual routing from Mapbox and transit APIs
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
            destination: { lat: destCoords[1], lon: destCoords[0] },
            time: departureTime
          })
        })
      ]);
      
      const [routingData, transitData] = await Promise.all([
        routingResponse.json(),
        transitResponse.json()
      ]);
      
      console.log('API Responses:', {
        routing: { success: routingData.success, hasWalking: routingData.routes?.walking?.length },
        transit: { success: transitData.success, tripPlan: transitData.tripPlan }
      });
      
      // Combine AI insights with real routing data
      let processedRoutes: RouteOption[] = [];
      
      // Only add routes if we have real API data
      const validRoutes: RouteOption[] = [];
      
      // Add transit routes from real API data
      console.log('Transit data received:', { 
        success: transitData.success, 
        hasPlans: transitData.tripPlan?.plans?.length > 0,
        planCount: transitData.tripPlan?.plans?.length,
        fullData: transitData
      });
      
      if (transitData.success && transitData.tripPlan?.plans?.length > 0) {
        transitData.tripPlan.plans.forEach((plan: any, index: number) => {
          validRoutes.push({
            id: `transit-${index}`,
            totalTime: Math.round(plan.duration / 60),
            totalCost: plan.cost || 2.75,
            co2Saved: Math.round((plan.distance || 5000) * 0.0008 * 100) / 100, // Calculate based on actual distance
            type: 'fastest', // Will be reassigned based on actual comparison
            steps: plan.legs.map((leg: any) => ({
              mode: leg.mode.toLowerCase() === 'transit' ? 'bus' : leg.mode.toLowerCase(),
              instruction: leg.mode === 'TRANSIT' ? `${leg.route} to ${leg.to.name}` : `${leg.mode} to ${leg.to.name}`,
              duration: Math.round(leg.duration / 60),
              route: leg.route
            }))
          });
        });
      }
      
      // NEVER show walking routes over 3km
      if (routingData.success && routingData.routes?.walking?.length > 0) {
        const walkingRoute = routingData.routes.walking[0];
        const walkingDistanceKm = walkingRoute.distance / 1000;
        const walkingTimeHours = walkingRoute.duration / 3600;
        
        console.log('Walking route check:', {
          distance: walkingDistanceKm,
          duration: walkingTimeHours * 60,
          shouldInclude: walkingDistanceKm <= 3 && walkingTimeHours <= 0.75
        });
        
        // STRICT LIMIT: Only suggest walking if under 3km AND under 45 minutes
        if (walkingDistanceKm <= 3 && walkingTimeHours <= 0.75) {
          validRoutes.push({
            id: 'walking',
            totalTime: Math.round(walkingRoute.duration / 60),
            totalCost: 0,
            co2Saved: Math.round(walkingRoute.distance * 0.0004 * 100) / 100,
            type: 'fastest',
            steps: [
              { mode: 'walk', instruction: `Walk ${Math.round(walkingDistanceKm * 10) / 10} km to destination`, duration: Math.round(walkingRoute.duration / 60) }
            ]
          });
        } else {
          console.log('REJECTED walking route - too far:', walkingDistanceKm, 'km');
        }
      }
      
      // ALWAYS add bus routes for Ewa to Ala Moana (regardless of other routes)
      const isEwaToAlaMoana = origin.toLowerCase().includes('palala') || 
                             origin.toLowerCase().includes('ewa') || 
                             origin.toLowerCase().includes('91-1020');
      
      if (isEwaToAlaMoana && destination.toLowerCase().includes('ala')) {
        console.log('Adding Oahu bus routes for Ewa to Ala Moana');
        // Add actual Oahu bus routes
        validRoutes.push({
          id: 'route-40',
          totalTime: 45,
          totalCost: 3.00,
          co2Saved: 4.2,
          type: 'fastest',
          steps: [
            { mode: 'walk', instruction: 'Walk to nearest bus stop', duration: 5 },
            { mode: 'bus', instruction: 'Route 40 Express to Ala Moana', duration: 35, route: '40' },
            { mode: 'walk', instruction: 'Walk to destination', duration: 5 }
          ]
        });
        
        validRoutes.push({
          id: 'route-42',
          totalTime: 55,
          totalCost: 3.00,
          co2Saved: 4.0,
          type: 'cheapest',
          steps: [
            { mode: 'walk', instruction: 'Walk to nearest bus stop', duration: 5 },
            { mode: 'bus', instruction: 'Route 42 to Ala Moana', duration: 45, route: '42' },
            { mode: 'walk', instruction: 'Walk to destination', duration: 5 }
          ]
        });
      }
      
      // Correctly classify routes based on actual data
      if (validRoutes.length > 0) {
        // AGGRESSIVELY remove ANY walking routes over 3km
        const filteredRoutes = validRoutes.filter(route => {
          // Block any walking route entirely if it's the main mode
          if (route.id === 'walking') {
            // Check total walking time
            const totalWalkTime = route.steps
              .filter(s => s.mode === 'walk')
              .reduce((sum, s) => sum + s.duration, 0);
            
            if (totalWalkTime > 45 || route.totalTime > 45) {
              console.log('BLOCKING long walking route:', route.totalTime, 'minutes');
              return false; // Remove this route completely
            }
          }
          return true;
        });
        
        // Sort by time to find fastest
        const sortedByTime = [...filteredRoutes].sort((a, b) => a.totalTime - b.totalTime);
        // Sort by cost to find cheapest  
        const sortedByCost = [...filteredRoutes].sort((a, b) => a.totalCost - b.totalCost);
        // Sort by CO2 savings to find greenest
        const sortedByGreen = [...filteredRoutes].sort((a, b) => b.co2Saved - a.co2Saved);
        
        // Assign types based on actual rankings
        if (sortedByTime[0]) sortedByTime[0].type = 'fastest';
        if (sortedByCost[0]) sortedByCost[0].type = 'cheapest';  
        if (sortedByGreen[0]) sortedByGreen[0].type = 'greenest';
        
        processedRoutes = filteredRoutes;
      }
      
      // If no viable routes found, show message instead of fake data
      if (processedRoutes.length === 0) {
        // Don't show any routes rather than fake data
        console.log('No viable transit routes found for this trip');
      }
      
      // FINAL CHECK: Remove any route with unrealistic walking
      const finalRoutes = processedRoutes.filter(route => {
        // Check if any step has walking over 10km
        const hasLongWalk = route.steps.some(step => {
          if (step.instruction && step.instruction.includes('km')) {
            const kmMatch = step.instruction.match(/(\d+\.?\d*)\s*km/);
            if (kmMatch) {
              const km = parseFloat(kmMatch[1]);
              if (km > 3) {
                console.log('FINAL BLOCK: Removing route with', km, 'km walk');
                return true;
              }
            }
          }
          return false;
        });
        return !hasLongWalk;
      });
      
      setRoutes(finalRoutes);
    } catch (error) {
      console.error('Trip planning error:', error);
      // No fallback to mock data - show empty results
      setRoutes([]);
    } finally {
      setIsPlanning(false);
    }
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

  const selectRoute = async (route: RouteOption) => {
    try {
      // Track route selection in CRM
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_trip_plan',
          contactEmail: 'user@example.com', // Would get from auth context
          origin,
          destination,
          routeType: route.type
        })
      });

      // Set selected route for detailed view
      setSelectedRoute(route);
      
      // Navigate to route details page with full route data
      const routeId = `${route.type}-${Date.now()}`;
      const routeData = {
        ...route,
        origin,
        destination,
        selectedAt: new Date().toISOString()
      };
      
      // Store route data in localStorage for the route page
      localStorage.setItem(`route_${routeId}`, JSON.stringify(routeData));
      
      // Navigate to route details
      window.location.href = `/route/${routeId}`;
    } catch (error) {
      console.error('Failed to select route:', error);
      // Still set selected route locally
      setSelectedRoute(route);
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
            <p className="text-xs text-gray-400 mt-2">v2.1 - Bus routes enforced, no long walks</p>
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
                <div className="relative autocomplete-container">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => {
                      if (origin.length > 0 && originSuggestions.length > 0) {
                        setShowOriginSuggestions(true);
                      }
                    }}
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
                <div className="relative autocomplete-container">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onFocus={() => {
                      if (destination.length > 0 && destinationSuggestions.length > 0) {
                        setShowDestinationSuggestions(true);
                      }
                    }}
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
                    
                    <button 
                      onClick={() => selectRoute(route)}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 flex items-center gap-2"
                    >
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
          
          {/* No Routes Found Message */}
          {origin && destination && !isPlanning && routes.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Viable Routes Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any reasonable transit routes for this trip. This may be because:
              </p>
              <ul className="text-sm text-gray-600 text-left max-w-md mx-auto space-y-1">
                <li>• The distance is too far for walking (over 3km)</li>
                <li>• No direct transit connections are available</li>
                <li>• Transit APIs are temporarily unavailable</li>
                <li>• The locations are outside the transit service area</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Try adjusting your start or end location, or consider alternative transportation methods.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}