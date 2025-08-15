"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Camera, Waves, Mountain, ShoppingBag, Star, 
  Sun, Thermometer, Wind, Eye, Navigation, Clock,
  Book, Heart, Calendar, Map, Utensils, Coffee,
  AlertTriangle, TrendingUp, Users, Palmtree, ArrowLeft,
  Volume2, Train, Leaf, Shield, Globe, Play
} from 'lucide-react';
import { locationService, LocationContext } from '@/lib/services/location';
import { 
  getDestinationsByCategory, 
  getDestinationsByTimeOfDay,
  getDestinationsByRegion,
  getCrowdAwareAlternatives,
  TouristDestination 
} from '@/lib/data/tourist-destinations';
import { hartSkylineService } from '@/lib/services/hart-skyline';
import ComprehensiveCulturalGuide from '@/components/comprehensive-cultural-guide';

// Helper function to calculate distance
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function EnhancedTouristDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<'Beach' | 'Food' | 'Attraction' | 'Museum' | 'Historical'>('Beach');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<TouristDestination | null>(null);
  const [selectedTab, setSelectedTab] = useState('main');
  const [locationContext, setLocationContext] = useState<LocationContext | null>(null);
  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);
  const [skylineStatus, setSkylineStatus] = useState<any>(null);
  const [destinations, setDestinations] = useState<TouristDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [crowdAlerts, setCrowdAlerts] = useState<any>(null);
  const [loadingDirections, setLoadingDirections] = useState<string | null>(null);

  // Load location-aware destinations
  useEffect(() => {
    const initializeLocationServices = async () => {
      setLoading(true);
      
      try {
        // Get location context
        const context = await locationService.getLocationContext();
        setLocationContext(context);
        
        // Get smart recommendations based on location and time
        const recommendations = await locationService.getSmartRecommendations();
        setSmartRecommendations(recommendations);
        
        // Get HART Skyline status
        const skyline = await hartSkylineService.getSkylineStatus();
        setSkylineStatus(skyline);
        
        // Load destinations based on category and location
        const userLocation = context?.location ? 
          [context.location.longitude, context.location.latitude] as [number, number] : 
          undefined;
        
        const categoryDestinations = getDestinationsByCategory(selectedCategory, userLocation);
        setDestinations(categoryDestinations);
        
        // Check for crowd alerts
        if (context?.crowdAlerts) {
          setCrowdAlerts(context.crowdAlerts);
        }
        
      } catch (error) {
        console.error('Failed to initialize location services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeLocationServices();
    
    // Set up location updates
    const handleLocationUpdate = (location: any) => {
      // Update destinations with new location
      const userLocation = [location.longitude, location.latitude] as [number, number];
      const updatedDestinations = getDestinationsByCategory(selectedCategory, userLocation);
      setDestinations(updatedDestinations);
    };
    
    locationService.onLocationUpdate(handleLocationUpdate);
  }, [selectedCategory]);

  // Update destinations when category changes
  useEffect(() => {
    if (locationContext?.location) {
      const userLocation = [locationContext.location.longitude, locationContext.location.latitude] as [number, number];
      const categoryDestinations = getDestinationsByCategory(selectedCategory, userLocation);
      setDestinations(categoryDestinations);
    }
  }, [selectedCategory, locationContext]);

  const toggleFavorite = async (destName: string) => {
    const isAdding = !favorites.includes(destName);
    
    setFavorites(prev => 
      isAdding
        ? [...prev, destName]
        : prev.filter(name => name !== destName)
    );
    
    // Track favorite activity in CRM with location context
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_activity',
          contactEmail: 'tourist@example.com', // Would get from auth context
          activityType: isAdding ? 'destination_favorited' : 'destination_unfavorited',
          details: {
            destination_name: destName,
            user_location: locationContext?.location,
            user_region: locationContext?.location?.islandRegion,
            time_of_day: new Date().getHours()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track favorite activity:', error);
    }
  };
  
  const getDirections = (destinationName: string) => {
    // Set loading state
    setLoadingDirections(destinationName);
    
    // Navigate immediately for better UX
    let originLocation = 'Your Current Location';
    
    if (locationContext?.location) {
      if (locationContext.location.address) {
        originLocation = locationContext.location.address;
      } else if (locationContext.location.district) {
        originLocation = `${locationContext.location.district}, Oahu, HI`;
      } else if (locationContext.location.islandRegion) {
        originLocation = `${locationContext.location.islandRegion}, Oahu, HI`;
      }
    }
    
    const params = new URLSearchParams({
      destination: destinationName,
      origin: originLocation
    });
    
    // Store destination data for the trip planner to use
    const destination = destinations.find(d => d.name === destinationName);
    if (destination) {
      localStorage.setItem('tourist_destination', JSON.stringify({
        name: destinationName,
        coordinates: destination.coordinates,
        category: destination.category,
        from_location: locationContext?.location
      }));
    }
    
    // Navigate immediately - much better UX
    window.location.href = `/trip-planner?${params.toString()}`;
    
    // Background tracking - don't wait for this
    fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'track_activity',
        contactEmail: 'tourist@example.com',
        activityType: 'directions_requested',
        details: {
          destination: destinationName,
          user_location: locationContext?.location,
          user_region: locationContext?.location?.islandRegion,
          skyline_available: skylineStatus?.systemStatus === 'operational'
        }
      })
    }).catch(console.error);
  };
  
  const playPronunciation = (pronunciation: string) => {
    // Text-to-speech for Hawaiian pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(pronunciation);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tropical-50 to-white">
      <header className="bg-tropical-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-tropical-200">
              Oahu Transit Hub - Malihini
            </h1>
          </Link>
          <nav className="flex gap-4">
            <button 
              onClick={() => setSelectedTab('main')}
              className="hover:text-tropical-200 flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Explore
            </button>
            <button 
              onClick={() => setSelectedTab('favorites')}
              className="hover:text-tropical-200 flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Favorites ({favorites.length})
            </button>
            <button 
              onClick={() => setSelectedTab('guide')}
              className="hover:text-tropical-200 flex items-center gap-2"
            >
              <Book className="h-4 w-4" />
              Guide
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {selectedTab !== 'main' && (
          <div className="mb-6">
            <button 
              onClick={() => setSelectedTab('main')}
              className="flex items-center gap-2 text-tropical-600 hover:text-tropical-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Discover
            </button>
          </div>
        )}

        {selectedTab === 'favorites' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Your Favorites ({favorites.length})
            </h2>
            {favorites.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {favorites.map(favName => {
                  const dest = destinations.find(d => d.name === favName);
                  return dest ? (
                    <div key={favName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{dest.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{dest.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📍 {dest.category}</span>
                            <span>⏱️ {dest.estimatedVisitDuration}</span>
                            <span>👥 {dest.crowdLevel} crowds</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => getDirections(dest.name)}
                            className="bg-tropical-600 text-white px-3 py-1 rounded text-sm hover:bg-tropical-700"
                          >
                            Directions
                          </button>
                          <button 
                            onClick={() => toggleFavorite(dest.name)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No favorites yet!</p>
                <button 
                  onClick={() => setSelectedTab('main')}
                  className="bg-tropical-600 text-white px-4 py-2 rounded-lg hover:bg-tropical-700"
                >
                  Explore Destinations
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'guide' && (
          <ComprehensiveCulturalGuide locationContext={locationContext} />
        )}

        {selectedTab === 'main' && (
          <>
            {/* Smart Location-Based Recommendations */}
            {smartRecommendations.length > 0 && (
              <div className="bg-gradient-to-r from-tropical-50 to-blue-50 border border-tropical-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-tropical-600" />
                  <h3 className="font-semibold text-tropical-800">Smart Recommendations for You</h3>
                  {locationContext?.location && (
                    <span className="text-xs bg-tropical-200 px-2 py-1 rounded">
                      {locationContext.location.district}
                    </span>
                  )}
                </div>
                <div className="grid gap-3">
                  {smartRecommendations.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-tropical-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-tropical-600 font-medium">{rec.title}</span>
                        <span className="text-xs text-tropical-500">({rec.type})</span>
                      </div>
                      <p className="text-sm text-gray-700">{rec.suggestion}</p>
                      <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Current Location Context */}
            {locationContext?.location && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Your Current Area</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-blue-700">
                    <strong>Location:</strong> {locationContext.location.district || 'Oahu'}
                  </div>
                  <div className="text-blue-700">
                    <strong>Region:</strong> {locationContext.location.islandRegion}
                  </div>
                  <div className="text-blue-700">
                    <strong>Nearby:</strong> {locationContext.nearbyDestinations?.slice(0, 2).map(d => d.name).join(', ') || 'Exploring...'}
                  </div>
                </div>
                {locationContext.currentWeather && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-blue-700">
                        <strong>Weather:</strong> {locationContext.currentWeather.weather?.condition}
                      </div>
                      <div className="text-blue-700">
                        <strong>Temp:</strong> {locationContext.currentWeather.weather?.temp}°F
                      </div>
                      <div className="text-blue-700">
                        <strong>UV:</strong> {locationContext.currentWeather.weather?.uvIndex}
                      </div>
                      <div className="text-blue-700">
                        <strong>Wind:</strong> {locationContext.currentWeather.weather?.windSpeed} mph
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* HART Skyline Status */}
            {skylineStatus && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">HART Skyline Rail Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-purple-700">
                    <strong>Current:</strong> Segment {skylineStatus.operationalSegments} of {skylineStatus.totalSegments} open
                  </div>
                  <div className="text-purple-700">
                    <strong>Next Opening:</strong> Segment 2 - {skylineStatus.nextOpening?.expectedDate}
                  </div>
                  <div className="text-purple-700">
                    <strong>Daily Riders:</strong> ~{skylineStatus.ridership?.dailyAverage}
                  </div>
                </div>
              </div>
            )}
            
            {/* Crowd Alerts */}
            {crowdAlerts && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Crowd Alert - {crowdAlerts.level} Activity</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-2">{crowdAlerts.message}</p>
                {crowdAlerts.alternatives && (
                  <div className="text-sm text-yellow-600">
                    <strong>Try instead:</strong> {crowdAlerts.alternatives.join(', ')}
                  </div>
                )}
              </div>
            )}

            {/* Discovery Categories */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Discover Oahu</h2>
              
              <div className="flex gap-4 mb-6 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('Beach')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'Beach' 
                      ? 'bg-tropical-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Waves className="h-5 w-5" />
                  Beaches
                </button>
                <button
                  onClick={() => setSelectedCategory('Attraction')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'Attraction' 
                      ? 'bg-tropical-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  Attractions
                </button>
                <button
                  onClick={() => setSelectedCategory('Food')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'Food' 
                      ? 'bg-tropical-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Utensils className="h-5 w-5" />
                  Local Food
                </button>
                <button
                  onClick={() => setSelectedCategory('Museum')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'Museum' 
                      ? 'bg-tropical-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Book className="h-5 w-5" />
                  Museums
                </button>
                <button
                  onClick={() => setSelectedCategory('Historical')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'Historical' 
                      ? 'bg-tropical-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Mountain className="h-5 w-5" />
                  Historical
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tropical-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading personalized recommendations...</p>
                  </div>
                ) : destinations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {selectedCategory.toLowerCase()} destinations found in your area.</p>
                    <button 
                      onClick={() => setSelectedCategory('Beach')}
                      className="mt-2 text-tropical-600 hover:text-tropical-700"
                    >
                      Try a different category
                    </button>
                  </div>
                ) : (
                  destinations.slice(0, 10).map((dest, idx) => (
                    <div key={dest.name} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all duration-200">
                      {/* Distance indicator if location available */}
                      {locationContext?.location && (
                        <div className="text-xs text-gray-500 mb-2">
                          ~{Math.round(calculateDistance(
                            [locationContext.location.longitude, locationContext.location.latitude],
                            dest.coordinates
                          ) * 0.621371)} miles from you
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-xl">{dest.name}</h3>
                            <button
                              onClick={() => toggleFavorite(dest.name)}
                              className={`p-1 rounded-full ${
                                favorites.includes(dest.name) 
                                  ? 'text-red-500' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${favorites.includes(dest.name) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <p className="text-gray-700 mb-3">{dest.description}</p>
                          
                          <div className="flex items-center gap-6 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {dest.estimatedVisitDuration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {dest.crowdLevel} crowds
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              {dest.safetyLevel} safety
                            </span>
                          </div>

                          {/* Enhanced Cultural Information */}
                          {(dest.hawaiianName || dest.culturalSignificance) && (
                            <div className="bg-tropical-50 p-3 rounded-lg mb-3">
                              {dest.hawaiianName && (
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-tropical-800">
                                    🌺 Hawaiian Name: {dest.hawaiianName}
                                  </p>
                                  {dest.pronunciation && (
                                    <button
                                      onClick={() => playPronunciation(dest.pronunciation!)}
                                      className="text-tropical-600 hover:text-tropical-700"
                                      title="Listen to pronunciation"
                                    >
                                      <Volume2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                              {dest.pronunciation && (
                                <p className="text-sm text-tropical-700 mb-1">
                                  🗣️ Pronunciation: {dest.pronunciation}
                                </p>
                              )}
                              {dest.culturalSignificance && (
                                <p className="text-sm text-tropical-700">
                                  {dest.culturalSignificance}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Sustainability Tips */}
                          {dest.sustainabilityTips && dest.sustainabilityTips.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg mb-3">
                              <div className="flex items-center gap-1 mb-1">
                                <Leaf className="h-4 w-4 text-green-600" />
                                <p className="text-sm font-medium text-green-800">Sustainable Visiting</p>
                              </div>
                              <ul className="text-sm text-green-700 space-y-1">
                                {dest.sustainabilityTips.slice(0, 2).map((tip, tipIdx) => (
                                  <li key={tipIdx}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {dest.bestTimeToVisit && (
                              <div>
                                <strong>Best Time:</strong> {dest.bestTimeToVisit}
                              </div>
                            )}
                            {dest.accessibilityInfo && (
                              <div>
                                <strong>Accessibility:</strong> {dest.accessibilityInfo}
                              </div>
                            )}
                          </div>
                          
                          {/* Crowd-aware alternatives */}
                          {dest.crowdLevel === 'High' && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              <p className="text-yellow-800 font-medium">High crowds expected</p>
                              <p className="text-yellow-700">Consider visiting during off-peak hours or try nearby alternatives</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <button 
                            onClick={() => getDirections(dest.name)}
                            disabled={loadingDirections === dest.name}
                            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              loadingDirections === dest.name 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-tropical-600 text-white hover:bg-tropical-700'
                            }`}
                          >
                            {loadingDirections === dest.name ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                <Navigation className="h-5 w-5" />
                                Get Directions
                              </>
                            )}
                          </button>
                          <div className="text-xs text-center text-gray-500 mt-2">
                            <div>Safety: {dest.safetyLevel}</div>
                            {dest.estimatedVisitDuration && (
                              <div>Duration: {dest.estimatedVisitDuration}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Live Data Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {locationContext?.currentWeather && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-600" />
                    Current Conditions
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-medium">{locationContext.currentWeather.weather?.temp}°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span className="font-medium">{locationContext.currentWeather.weather?.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UV Index:</span>
                      <span className={`font-medium ${
                        (locationContext.currentWeather.weather?.uvIndex || 0) > 7 
                          ? 'text-red-600' 
                          : 'text-orange-600'
                      }`}>
                        {locationContext.currentWeather.weather?.uvIndex}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind:</span>
                      <span className="font-medium">{locationContext.currentWeather.weather?.windSpeed} mph</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Sustainability Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {locationContext?.sustainabilityTips ? 
                    locationContext.sustainabilityTips.slice(0, 4).map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    )) : [
                      <li key="1">• Use reef-safe sunscreen only</li>,
                      <li key="2">• Choose public transit over driving</li>,
                      <li key="3">• Respect wildlife and coral reefs</li>,
                      <li key="4">• Support local businesses</li>
                    ]
                  }
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-brown-600" />
                  Cultural Respect
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {locationContext?.culturalContext ? [
                    <li key="hist">• {locationContext.culturalContext.historicalSignificance}</li>,
                    ...locationContext.culturalContext.respectfulBehavior.slice(0, 3).map((behavior, idx) => (
                      <li key={idx}>• {behavior}</li>
                    ))
                  ] : [
                    <li key="1">• Remove shoes before entering homes</li>,
                    <li key="2">• Learn "aloha" and "mahalo"</li>,
                    <li key="3">• Respect sacred sites and kapu areas</li>,
                    <li key="4">• Support Native Hawaiian culture</li>
                  ]}
                </ul>
              </div>
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Your Favorites ({favorites.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map(favName => {
                    const dest = destinations.find(d => d.name === favName);
                    return dest ? (
                      <div key={favName} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{dest.name}</p>
                          <p className="text-sm text-gray-600">{dest.estimatedVisitDuration} • {dest.category}</p>
                        </div>
                        <button 
                          onClick={() => getDirections(dest.name)}
                          className="text-tropical-600 hover:text-tropical-700"
                        >
                          <Navigation className="h-5 w-5" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}