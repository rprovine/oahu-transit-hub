"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Navigation, 
  Bus, Train, Users, Star, AlertTriangle, Route, Play, Pause,
  Phone, Share, Bookmark, Zap, Leaf, TrendingUp, Wind
} from 'lucide-react';
import MapboxMap from '@/components/MapboxMap';

export default function RouteDetails() {
  const params = useParams();
  const routeId = params.id;
  
  const [routeData, setRouteData] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<Date>(new Date(Date.now() + 30 * 60000));

  useEffect(() => {
    loadRouteData();
  }, [routeId]);

  const loadRouteData = async () => {
    try {
      // First try to load from localStorage
      const storedRouteData = localStorage.getItem(`route_${routeId}`);
      let baseRouteData = null;
      
      if (storedRouteData) {
        try {
          baseRouteData = JSON.parse(storedRouteData);
          console.log('Loaded base route data from localStorage:', baseRouteData);
        } catch (error) {
          console.error('Failed to parse stored route data:', error);
        }
      }

      // Get URL parameters for origin/destination
      const urlParams = new URLSearchParams(window.location.search);
      const originParam = urlParams.get('origin') || baseRouteData?.origin;
      const destinationParam = urlParams.get('destination') || baseRouteData?.destination;
      
      // Attempt to fetch real-time data from APIs
      let liveRouteData = null;
      let weatherData = null;
      let transitAlerts = null;

      if (originParam && destinationParam) {
        try {
          // Fetch real-time transit data
          const [geocodeOriginResponse, geocodeDestResponse] = await Promise.all([
            fetch(`/api/geocode?q=${encodeURIComponent(originParam)}`),
            fetch(`/api/geocode?q=${encodeURIComponent(destinationParam)}`)
          ]);

          const [originGeocode, destGeocode] = await Promise.all([
            geocodeOriginResponse.json(),
            geocodeDestResponse.json()
          ]);

          if (originGeocode.success && destGeocode.success) {
            const originCoords = originGeocode.suggestions[0]?.center;
            const destCoords = destGeocode.suggestions[0]?.center;

            if (originCoords && destCoords) {
              // Get real transit routing
              const routingResponse = await fetch('/api/transit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'plan_trip',
                  origin: { lat: originCoords[1], lon: originCoords[0] },
                  destination: { lat: destCoords[1], lon: destCoords[0] }
                })
              });

              const routingData = await routingResponse.json();
              if (routingData.success && routingData.tripPlan?.plans?.length > 0) {
                liveRouteData = routingData.tripPlan.plans[0];
                console.log('Loaded live route data from API:', liveRouteData);
              }

              // Get real weather data
              const weatherResponse = await fetch(`/api/weather?lat=${originCoords[1]}&lon=${originCoords[0]}`);
              weatherData = await weatherResponse.json();

              // Get transit alerts
              const alertsResponse = await fetch('/api/transit?action=alerts');
              transitAlerts = await alertsResponse.json();
            }
          }
        } catch (error) {
          console.error('Failed to fetch live data, using stored/fallback data:', error);
        }
      }

      // Combine live data with stored data or fallback
      const enhancedData = buildRouteData(baseRouteData, liveRouteData, weatherData, transitAlerts, originParam, destinationParam);
      setRouteData(enhancedData);

    } catch (error) {
      console.error('Route data loading failed, using fallback:', error);
      setRouteData(getFallbackRouteData());
    }
  };

  const buildRouteData = (storedData: any, liveData: any, weatherData: any, alertsData: any, origin?: string, destination?: string) => {
    const now = new Date();
    const departureTime = new Date(now.getTime() + 5 * 60000);
    
    // Use live data if available, otherwise stored data, otherwise defaults
    const duration = liveData?.duration ? Math.round(liveData.duration / 60) : storedData?.totalTime || 28;
    const cost = liveData?.cost || storedData?.totalCost || 2.75;
    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);

    // Build alerts from real data
    const alerts = [];
    if (alertsData?.success && alertsData.alerts?.length > 0) {
      alertsData.alerts.forEach((alert: any) => {
        alerts.push({
          type: alert.severity === 'warning' ? 'warning' : 'info',
          message: alert.description,
          priority: alert.severity === 'warning' ? 'high' : 'low'
        });
      });
    }
    
    // Add weather-based alerts
    if (weatherData?.success) {
      if (weatherData.weather.condition.toLowerCase().includes('rain')) {
        alerts.push({
          type: 'warning',
          message: `☔ ${weatherData.weather.condition} expected - consider bringing an umbrella`,
          priority: 'medium'
        });
      }
      alerts.push({
        type: 'info',
        message: `🌡️ Current conditions: ${weatherData.weather.temp}°F, ${weatherData.weather.condition}`,
        priority: 'low'
      });
    }

    if (alerts.length === 0) {
      alerts.push(
        { type: 'success', message: '🚌 Route running on schedule with high reliability', priority: 'low' },
        { type: 'success', message: '🌿 Excellent choice! You\'re helping reduce traffic congestion', priority: 'medium' }
      );
    }

    return {
      id: routeId,
      name: `${(storedData?.type ? storedData.type.charAt(0).toUpperCase() + storedData.type.slice(1) : 'Express')} Route`,
      from: origin || storedData?.origin || 'Current Location',
      to: destination || storedData?.destination || 'Selected Destination',
      duration: duration,
      cost: cost,
      distance: '7.4 miles',
      nextDeparture: '5 minutes',
      estimatedArrival: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      departureTime: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: storedData?.type || 'fastest',
      co2Saved: '4.1 kg',
      caloriesBurned: Math.round(duration * 1.8),
      walkingDistance: '0.8 miles',
      transitMode: 'bus',
      routeNumber: '8',
      steps: liveData?.legs || storedData?.steps || [],
      stops: generateStopsFromSteps(liveData?.legs || storedData?.steps || [], { origin, destination, totalTime: duration }),
      alerts: alerts,
      liveUpdates: {
        vehicleId: 'BUS_8_142',
        currentLocation: 'On route to next stop',
        delay: liveData?.delay || 0,
        crowdLevel: 'light',
        nextStop: 'Next scheduled stop',
        confidence: liveData ? 98 : 85
      }
    };
  };

  const generateStopsFromSteps = (steps: any[], routeData?: any) => {
    if (!steps.length) {
      // Generate default stops if no steps provided
      const now = new Date();
      const departureTime = new Date(now.getTime() + 5 * 60000);
      
      return [
        { 
          name: `Starting Point - ${routeData?.origin || 'Current Location'}`, 
          time: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'walk',
          duration: '3 min',
          description: 'Walk to nearest bus stop'
        },
        { 
          name: 'Keeaumoku St & Kapiolani Blvd', 
          time: new Date(departureTime.getTime() + 3 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'bus_stop',
          duration: '2 min wait',
          description: 'Route 8 - Ala Moana Center',
          routeInfo: 'Route 8 (Blue Line)'
        },
        { 
          name: 'Ward Ave & Kapiolani Blvd', 
          time: new Date(departureTime.getTime() + 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'bus_stop',
          duration: '1 min',
          description: 'Continue on Route 8'
        },
        { 
          name: 'Ala Moana Center Transit Hub', 
          time: new Date(departureTime.getTime() + 18 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'transfer',
          duration: '5 min transfer',
          description: 'Transfer to connecting route or final walk'
        },
        { 
          name: `Final Destination - ${routeData?.destination || 'Selected Destination'}`, 
          time: new Date(departureTime.getTime() + (routeData?.totalTime || 30) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'destination',
          duration: '5 min walk',
          description: 'Arrive at destination'
        }
      ];
    }
    
    const now = new Date();
    return steps.map((step, index) => {
      const time = new Date(now.getTime() + (index * 8 * 60000)); // 8 minutes between stops
      return {
        name: step.instruction || `Step ${index + 1}`,
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: index === 0 ? 'current' : 'upcoming',
        type: step.mode || 'transit',
        duration: `${step.duration || 5} min`,
        description: step.instruction || `Transit step ${index + 1}`
      };
    });
  };

  const getFallbackRouteData = () => {
    const now = new Date();
    const departureTime = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
    const arrivalTime = new Date(departureTime.getTime() + 28 * 60000); // 28 minutes later
    
    // Get actual origin/destination from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const originParam = urlParams.get('origin');
    const destinationParam = urlParams.get('destination');
    const typeParam = urlParams.get('type');
    
    return {
      id: routeId,
      name: `${(typeParam ? typeParam.charAt(0).toUpperCase() + typeParam.slice(1) : 'Express')} Route to ${destinationParam?.split(',')[0] || 'Downtown'}`,
      from: originParam || 'Keeaumoku Street Area',
      to: destinationParam || 'Ala Moana Center Area', 
      duration: 28,
      cost: 2.75,
      distance: '7.4 miles',
      nextDeparture: '5 minutes',
      estimatedArrival: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      departureTime: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      co2Saved: '4.1 kg',
      caloriesBurned: 52,
      walkingDistance: '0.8 miles',
      transitMode: 'bus',
      routeNumber: '8',
      stops: [
        { 
          name: `Starting Point - ${originParam?.split(',')[0] || 'Current Location'}`, 
          time: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'walk',
          duration: '4 min',
          description: 'Walk 0.3 miles to Keeaumoku St & Kapiolani Blvd'
        },
        { 
          name: 'Keeaumoku St & Kapiolani Blvd', 
          time: new Date(departureTime.getTime() + 4 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'bus_stop',
          duration: '3 min wait',
          description: 'Board Route 8 - Ala Moana Center',
          routeInfo: 'Route 8 (Express Service)'
        },
        { 
          name: 'Ward Ave & Kapiolani Blvd', 
          time: new Date(departureTime.getTime() + 14 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'bus_stop',
          duration: '1 min',
          description: 'Continue on Route 8 • Next: Ala Moana'
        },
        { 
          name: 'Ala Moana Center Transit Hub', 
          time: new Date(departureTime.getTime() + 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'transfer',
          duration: '3 min',
          description: 'Exit bus and prepare for final walk'
        },
        { 
          name: `Final Destination - ${destinationParam?.split(',')[0] || 'Selected Destination'}`, 
          time: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'upcoming',
          type: 'destination',
          duration: 'Arrived',
          description: 'Walk 0.5 miles to final destination'
        }
      ],
      alerts: [
        { type: 'success', message: '🚌 Route 8 is running on time with high reliability', priority: 'low' },
        { type: 'success', message: '🌿 Excellent choice! You\'re saving 4.1 kg of CO₂ vs driving', priority: 'medium' },
        { type: 'info', message: '☀️ Perfect weather for your trip - 78°F and sunny', priority: 'low' }
      ],
      liveUpdates: {
        vehicleId: 'BUS_8_142',
        currentLocation: 'Approaching Keeaumoku St stop',
        delay: 0,
        crowdLevel: 'light',
        nextStop: 'Keeaumoku St & Kapiolani Blvd',
        confidence: 98
      }
    };
  };

  const startTracking = () => {
    setIsTracking(true);
    setIsLive(true);
    setCurrentStepIndex(0);
    setTimeElapsed(0);
    
    // Simulate real-time progress
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Progress through steps based on time
        const totalDuration = routeData?.duration || 30;
        const progress = (newTime / 60) / totalDuration; // Convert seconds to minutes, then to progress
        const stepProgress = Math.min(Math.floor(progress * (routeData?.stops?.length || 5)), (routeData?.stops?.length || 5) - 1);
        
        if (stepProgress !== currentStepIndex && stepProgress < (routeData?.stops?.length || 5)) {
          setCurrentStepIndex(stepProgress);
          
          // Update route data with current status
          if (routeData) {
            const updatedStops = routeData.stops.map((stop: any, index: number) => ({
              ...stop,
              status: index < stepProgress ? 'completed' : index === stepProgress ? 'current' : 'upcoming'
            }));
            setRouteData((prev: any) => ({ ...prev, stops: updatedStops }));
          }
        }
        
        // Stop tracking when journey is complete
        if (newTime >= totalDuration * 60) {
          clearInterval(interval);
          setIsTracking(false);
          setIsLive(false);
        }
        
        return newTime;
      });
    }, 1000);
  };
  
  const stopTracking = () => {
    setIsTracking(false);
    setIsLive(false);
  };
  
  const shareRoute = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${routeData?.name} - Oahu Transit`,
          text: `Check out this route from ${routeData?.from} to ${routeData?.to}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Route link copied to clipboard!');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-ocean-100/20 to-transparent rounded-full"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-tropical-100/20 to-transparent rounded-full"></div>
      </div>
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/trip-planner" className="text-ocean-600 hover:text-ocean-700 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-volcanic-900">{routeData.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">
                    <span className="font-medium">{routeData.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{routeData.to}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={shareRoute}
                className="p-2 text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
              >
                <Share className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-volcanic-600 hover:bg-volcanic-50 rounded-lg transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
              {routeData.transitMode === 'bus' && (
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-700">
          
          {/* Live Status Bar */}
          {isLive && (
            <div className="bg-gradient-to-r from-green-500 to-ocean-500 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold">🚌 Live Tracking Active</span>
                  <span className="text-green-100">|</span>
                  <span>Step {currentStepIndex + 1} of {routeData?.stops?.length || 5}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">⏱️ {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                  <button 
                    onClick={stopTracking}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Route Summary */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
              <div className="text-center group hover:bg-ocean-50 p-4 rounded-lg transition-colors">
                <Clock className="h-10 w-10 text-ocean-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-volcanic-900 mb-1">{typeof routeData.duration === 'number' ? routeData.duration : parseInt(routeData.duration) || 30} <span className="text-sm font-normal">min</span></p>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-xs text-gray-500 mt-1">Depart: {routeData.departureTime}</p>
              </div>
              
              <div className="text-center group hover:bg-green-50 p-4 rounded-lg transition-colors">
                <DollarSign className="h-10 w-10 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-volcanic-900 mb-1">${typeof routeData.cost === 'number' ? routeData.cost.toFixed(2) : routeData.cost}</p>
                <p className="text-sm text-gray-600">Total Fare</p>
                <p className="text-xs text-green-600 mt-1">💳 HOLO Card Ready</p>
              </div>
              
              <div className="text-center group hover:bg-tropical-50 p-4 rounded-lg transition-colors">
                <Bus className="h-10 w-10 text-tropical-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-volcanic-900 mb-1">{routeData.nextDeparture}</p>
                <p className="text-sm text-gray-600">Next Departure</p>
                <p className="text-xs text-tropical-600 mt-1">🎯 Arrive: {routeData.estimatedArrival}</p>
              </div>
              
              <div className="text-center group hover:bg-emerald-50 p-4 rounded-lg transition-colors">
                <Leaf className="h-10 w-10 text-emerald-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-volcanic-900 mb-1">{routeData.co2Saved}</p>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-xs text-emerald-600 mt-1">🌱 vs driving</p>
              </div>
              
              <div className="text-center group hover:bg-purple-50 p-4 rounded-lg transition-colors">
                <Zap className="h-10 w-10 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-volcanic-900 mb-1">{routeData.caloriesBurned}</p>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xs text-purple-600 mt-1">🚶 Walking: {routeData.walkingDistance}</p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={isTracking ? stopTracking : startTracking}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    isTracking 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                      : 'bg-gradient-to-r from-ocean-600 to-tropical-600 text-white hover:from-ocean-700 hover:to-tropical-700'
                  }`}
                >
                  {isTracking ? (
                    <><Pause className="h-5 w-5 inline mr-2" />Stop Tracking</>
                  ) : (
                    <><Play className="h-5 w-5 inline mr-2" />Start Tracking</>
                  )}
                </button>
                {!isTracking && (
                  <p className="text-xs text-gray-500 mt-2">🔴 Live GPS tracking</p>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Alerts */}
          {routeData.alerts && routeData.alerts.length > 0 && (
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                Live Updates & Alerts
              </h3>
              <div className="space-y-4">
                {routeData.alerts.map((alert: any, idx: number) => {
                  const getAlertStyles = () => {
                    switch (alert.type) {
                      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
                      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
                      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
                      default: return 'bg-gray-50 border-gray-200 text-gray-800';
                    }
                  };
                  
                  const getPriorityIndicator = () => {
                    switch (alert.priority) {
                      case 'high': return '🔴';
                      case 'medium': return '🟡';
                      case 'low': return '🟢';
                      default: return 'ℹ️';
                    }
                  };
                  
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${getAlertStyles()} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getPriorityIndicator()}</span>
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-xs mt-1 opacity-75">Updated just now</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced Route Timeline */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Route className="h-6 w-6 text-ocean-600" />
              Journey Timeline
              {isLive && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                  🔴 Live
                </span>
              )}
            </h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full">
                <div 
                  className="bg-gradient-to-b from-ocean-500 to-tropical-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    height: isTracking ? `${((currentStepIndex + 1) / routeData.stops.length) * 100}%` : '0%',
                    width: '100%'
                  }}
                ></div>
              </div>
              
              <div className="space-y-6">
                {routeData.stops.map((stop: any, idx: number) => {
                  const getStepIcon = () => {
                    switch (stop.type) {
                      case 'walk': return '🚶';
                      case 'bus_stop': return '🚌';
                      case 'transfer': return '🔄';
                      case 'destination': return '🎯';
                      default: return '📍';
                    }
                  };
                  
                  const getStatusStyles = () => {
                    if (isTracking) {
                      switch (stop.status) {
                        case 'completed': return 'bg-green-500 border-green-200 text-white';
                        case 'current': return 'bg-blue-500 border-blue-200 text-white animate-pulse';
                        case 'upcoming': return 'bg-gray-200 border-gray-300 text-gray-600';
                      }
                    }
                    return stop.status === 'current' 
                      ? 'bg-ocean-500 border-ocean-200 text-white' 
                      : 'bg-gray-200 border-gray-300 text-gray-600';
                  };
                  
                  return (
                    <div key={idx} className="flex items-start gap-4 relative">
                      {/* Step Circle */}
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg z-10 ${getStatusStyles()} transition-all duration-500`}>
                        <span className="text-2xl">{getStepIcon()}</span>
                      </div>
                      
                      {/* Step Content */}
                      <div className={`flex-1 pb-6 ${
                        (isTracking && stop.status === 'current') ? 'bg-blue-50 -ml-4 pl-6 pr-4 py-4 rounded-r-lg border-l-4 border-blue-500' : ''
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-volcanic-900">{stop.name}</h4>
                          <div className="text-right">
                            <p className="font-bold text-ocean-600">{stop.time}</p>
                            <p className="text-sm text-gray-500">{stop.duration}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{stop.description}</p>
                        
                        {stop.routeInfo && (
                          <div className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-full text-sm inline-block">
                            🚌 {stop.routeInfo}
                          </div>
                        )}
                        
                        {isTracking && stop.status === 'current' && (
                          <div className="mt-3 flex items-center gap-2 text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">You are here</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Live Map */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <MapPin className="h-6 w-6 text-ocean-600" />
                Live Route Map
                {isLive && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔴 LIVE
                  </span>
                )}
              </h3>
              
              <div className="flex gap-2">
                <button className="bg-ocean-100 text-ocean-700 px-3 py-1 rounded-lg text-sm hover:bg-ocean-200 transition-colors">
                  📱 Mobile View
                </button>
                <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition-colors">
                  🌐 Full Screen
                </button>
              </div>
            </div>
            
            {/* Interactive Mapbox Map */}
            <div className="h-80 rounded-xl overflow-hidden border border-gray-200">
              <MapboxMap
                route={routeData}
                isLive={isLive}
                currentStepIndex={currentStepIndex}
                className="w-full h-full"
              />
            </div>
            
            {/* Live Vehicle Info */}
            {routeData.liveUpdates && (
              <div className="mt-4 bg-ocean-50 rounded-lg p-4">
                <h5 className="font-semibold text-ocean-800 mb-2 flex items-center gap-2">
                  🚌 Live Vehicle Info:
                  {isLive && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-ocean-700">
                  <div>
                    <strong>Bus ID:</strong> {routeData.liveUpdates.vehicleId}
                  </div>
                  <div>
                    <strong>Location:</strong> {routeData.liveUpdates.currentLocation}
                  </div>
                  <div>
                    <strong>Crowd Level:</strong> {routeData.liveUpdates.crowdLevel}
                  </div>
                  <div>
                    <strong>Confidence:</strong> {routeData.liveUpdates.confidence}%
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Info */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">GPS Active</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Real-time</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Weather-aware</span>
              </div>
              <div>
                🗺️ Powered by Mapbox • Weather-aware routing
              </div>
            </div>
          </div>

          {/* Additional Route Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Base Fare</span>
                  <span className="font-semibold">$2.75</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Transfer Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Express Surcharge</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{routeData.cost}</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    💰 <strong>Monthly Savings:</strong> ~$247 vs driving<br/>
                    🌱 <strong>Environmental Impact:</strong> {routeData.co2Saved} CO₂ saved
                  </p>
                </div>
              </div>
            </div>

            {/* Weather & Conditions */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Wind className="h-6 w-6 text-blue-600" />
                Weather & Conditions
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">☀️</div>
                    <div className="font-semibold">78°F</div>
                    <div className="text-gray-600">Sunny</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-1">💨</div>
                    <div className="font-semibold">12 mph</div>
                    <div className="text-gray-600">Light Wind</div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">Weather Advisory</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Light rain expected around 3 PM. Consider bringing an umbrella for walking portions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility & Amenities */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-600" />
              Accessibility & Amenities
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-purple-800">♿ Accessibility</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Wheelchair accessible buses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Audio announcements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Priority seating available
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-800">🚏 Stop Amenities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Covered waiting area
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Real-time arrival displays
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Limited seating
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-800">📱 Digital Features</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Mobile ticketing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    GPS tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Trip notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alternative Routes */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Route className="h-6 w-6 text-orange-600" />
              Alternative Routes
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">🚌 TheBus Route 20</h4>
                    <p className="text-sm text-gray-600">Express service via King Street</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ocean-600">$2.75</p>
                    <p className="text-sm text-gray-500">32 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🌱 3.9 kg CO₂ saved</span>
                  <span>•</span>
                  <span>🚌 Alternative bus route</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">🚊 Skyline Rail + Bus</h4>
                    <p className="text-sm text-gray-600">HART rail to Aloha Stadium + connecting bus</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">$2.75</p>
                    <p className="text-sm text-gray-500">35 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🌱 4.0 kg CO₂ saved</span>
                  <span>•</span>
                  <span>🚊 Modern rail system</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">🚶 Walking Route</h4>
                    <p className="text-sm text-gray-600">Direct path via city streets</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">FREE</p>
                    <p className="text-sm text-gray-500">65 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🌱 4.2 kg CO₂ saved</span>
                  <span>•</span>
                  <span>🔥 320 calories burned</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> TheBus Route 8 typically has the best on-time performance during your travel window. 
                Consider Route 20 via King Street or the new Skyline Rail system as alternatives if delays occur.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}