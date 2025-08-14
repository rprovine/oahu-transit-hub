"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Camera, Waves, Mountain, ShoppingBag, Star, 
  Sun, Thermometer, Wind, Eye, Navigation, Clock,
  Book, Heart, Calendar, Map, Utensils, Coffee,
  AlertTriangle, TrendingUp, Users, Palmtree, ArrowLeft
} from 'lucide-react';

export default function TouristDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('beaches');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('main');
  const [beachConditions, setBeachConditions] = useState<any>(null);
  const [beachConditionsLoading, setBeachConditionsLoading] = useState(true);

  const destinations = {
    beaches: [
      { 
        id: 'lanikai',
        name: "Lanikai Beach", 
        rating: 4.9, 
        time: "45 min", 
        crowd: "Low",
        description: "Pristine white sand beach with turquoise waters",
        culturalInfo: "Lanikai means 'heavenly ocean' in Hawaiian",
        pronunciation: "LAH-nee-kai",
        bestTime: "Early morning (6-9 AM)",
        activities: ["Swimming", "Kayaking", "Photography"],
        safetyLevel: "High"
      },
      { 
        id: 'waikiki',
        name: "Waikiki Beach", 
        rating: 4.5, 
        time: "15 min", 
        crowd: "High",
        description: "World-famous beach perfect for learning to surf",
        culturalInfo: "Waikiki means 'spouting fresh water'",
        pronunciation: "why-kee-kee",
        bestTime: "Sunset (5-7 PM)",
        activities: ["Surfing", "Beach Bars", "Shopping"],
        safetyLevel: "High"
      },
      { 
        id: 'sunset',
        name: "Sunset Beach", 
        rating: 4.8, 
        time: "1h 20min", 
        crowd: "Medium",
        description: "Famous North Shore surf spot with massive winter waves",
        culturalInfo: "Sacred surfing grounds of ancient ali'i (royalty)",
        pronunciation: "SUN-set beach",
        bestTime: "Winter months for big waves",
        activities: ["Wave Watching", "Surfing (experts)", "Beach Walking"],
        safetyLevel: "Medium - Strong currents"
      }
    ],
    attractions: [
      { 
        id: 'diamond-head',
        name: "Diamond Head", 
        rating: 4.7, 
        time: "25 min", 
        crowd: "Medium",
        description: "Iconic volcanic crater with panoramic city views",
        culturalInfo: "Le'ahi in Hawaiian, meaning 'brow of the tuna'",
        pronunciation: "lay-AH-hee",
        bestTime: "Early morning (6-8 AM)",
        activities: ["Hiking", "Photography", "Sunrise Viewing"],
        safetyLevel: "High - Bring water"
      },
      { 
        id: 'pearl-harbor',
        name: "Pearl Harbor", 
        rating: 4.9, 
        time: "35 min", 
        crowd: "High",
        description: "Historic WWII memorial and museum",
        culturalInfo: "Pu'uloa, meaning 'long hill' in Hawaiian",
        pronunciation: "poo-oo-LOH-ah",
        bestTime: "Morning (8-11 AM)",
        activities: ["Historical Tours", "Museum", "USS Arizona Memorial"],
        safetyLevel: "High - Security screening required"
      },
      { 
        id: 'hanauma',
        name: "Hanauma Bay", 
        rating: 4.8, 
        time: "30 min", 
        crowd: "High",
        description: "Protected marine sanctuary perfect for snorkeling",
        culturalInfo: "Hanauma means 'curved bay'",
        pronunciation: "hah-now-mah",
        bestTime: "Early morning (7-9 AM)",
        activities: ["Snorkeling", "Marine Life Viewing", "Educational Tours"],
        safetyLevel: "High - Reservation required"
      }
    ],
    food: [
      {
        id: 'leonards',
        name: "Leonard's Bakery",
        rating: 4.6,
        time: "20 min",
        crowd: "Medium",
        description: "Famous malasadas (Portuguese donuts)",
        culturalInfo: "Local institution since 1952",
        pronunciation: "mah-lah-SAH-das",
        bestTime: "Morning (8-11 AM)",
        activities: ["Breakfast", "Coffee", "Local Treats"],
        safetyLevel: "High"
      },
      {
        id: 'rainbow-drive-in',
        name: "Rainbow Drive-In",
        rating: 4.4,
        time: "18 min",
        crowd: "Medium",
        description: "Local plate lunch institution",
        culturalInfo: "Obama's favorite childhood spot",
        pronunciation: "RAIN-bow drive-in",
        bestTime: "Lunch (11 AM - 2 PM)",
        activities: ["Local Cuisine", "Plate Lunch", "Drive-In Experience"],
        safetyLevel: "High"
      }
    ]
  };

  const toggleFavorite = async (destId: string) => {
    const isAdding = !favorites.includes(destId);
    
    setFavorites(prev => 
      isAdding
        ? [...prev, destId]
        : prev.filter(id => id !== destId)
    );
    
    // Track favorite activity in CRM
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_activity',
          contactEmail: 'tourist@example.com', // Would get from auth context
          activityType: isAdding ? 'destination_favorited' : 'destination_unfavorited',
          details: {
            destination_id: destId,
            destination_name: destinations[selectedCategory as keyof typeof destinations].find(d => d.id === destId)?.name
          }
        })
      });
    } catch (error) {
      console.error('Failed to track favorite activity:', error);
    }
  };
  
  const getDirections = async (destinationName: string) => {
    try {
      let origin = '';
      
      // Always try to get current location first for tourists
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 3000,
              enableHighAccuracy: true
            });
          });
          
          // Reverse geocode the coordinates to get an address
          const response = await fetch(`/api/geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}&reverse=true`);
          const data = await response.json();
          if (data.success && data.address) {
            origin = data.address;
          }
        } catch (geoError) {
          console.log('Could not get location, using default');
        }
      }
      
      // If geolocation failed, use saved location or common tourist area
      if (!origin) {
        const savedSettings = localStorage.getItem('oahu_transit_settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          const currentLocation = settings.locations?.find((loc: any) => loc.type === 'current');
          origin = currentLocation?.address || 'Waikiki Beach, Honolulu, HI';
        } else {
          origin = 'Waikiki Beach, Honolulu, HI'; // Default for tourists
        }
      }
      
      // Track direction request in CRM
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_activity',
          contactEmail: 'tourist@example.com', // Would get from auth context
          activityType: 'directions_requested',
          details: {
            origin,
            destination: destinationName,
            user_type: 'tourist',
            used_geolocation: origin !== 'Waikiki Beach, Honolulu, HI'
          }
        })
      });
      
      // Navigate to trip planner with pre-filled destination
      const params = new URLSearchParams({
        destination: destinationName,
        origin: origin
      });
      
      window.location.href = `/trip-planner?${params.toString()}`;
    } catch (error) {
      console.error('Failed to get directions:', error);
      // Fallback to trip planner without pre-filled data
      window.location.href = '/trip-planner';
    }
  };

  useEffect(() => {
    // Load real beach/weather conditions
    loadBeachConditions();
    
    const interval = setInterval(() => {
      loadBeachConditions();
    }, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  const loadBeachConditions = async () => {
    setBeachConditionsLoading(true);
    try {
      // Get weather for multiple beach locations
      const beachLocations = [
        { name: 'Waikiki', lat: 21.2793, lon: -157.8293 },
        { name: 'Lanikai', lat: 21.3972, lon: -157.7394 },
        { name: 'North Shore', lat: 21.5944, lon: -158.0430 }
      ];
      
      const weatherResponse = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: beachLocations })
      });
      
      const weatherData = await weatherResponse.json();
      
      if (weatherData.success && weatherData.locations.length > 0) {
        const waikikiWeather = weatherData.locations.find((loc: any) => loc.name === 'Waikiki');
        
        if (waikikiWeather) {
          // Get marine conditions for Waikiki
          const marineResponse = await fetch(`/api/weather?lat=21.2793&lon=-157.8293&marine=true`);
          const marineData = await marineResponse.json();
          
          if (marineData.success && marineData.marine) {
            setBeachConditions({
              surfHeight: `${Math.round(marineData.marine.waveHeight * 3.28)} ft`, // Convert meters to feet
              waterTemp: Math.round(marineData.marine.waterTemp * 9/5 + 32), // Convert C to F
              uvIndex: waikikiWeather.weather.uvIndex,
              windSpeed: waikikiWeather.weather.windSpeed,
              visibility: marineData.marine.visibility > 8 ? 'Excellent' : marineData.marine.visibility > 5 ? 'Good' : 'Fair',
              tideStatus: 'Check local tide charts'
            });
          } else {
            console.log('Marine data not available');
            setBeachConditions(null);
          }
        } else {
          console.log('Waikiki weather not found');
          setBeachConditions(null);
        }
      } else {
        console.log('Weather API failed or returned no data');
        setBeachConditions(null);
      }
    } catch (error) {
      console.error('Failed to load beach conditions:', error);
      setBeachConditions(null);
    } finally {
      setBeachConditionsLoading(false);
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
              onClick={() => setSelectedTab('explore')}
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
              onClick={() => setSelectedTab('trips')}
              className="hover:text-tropical-200 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              My Trips
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
                {favorites.map(favId => {
                  const allDests = [...destinations.beaches, ...destinations.attractions, ...destinations.food];
                  const dest = allDests.find(d => d.id === favId);
                  return dest ? (
                    <div key={favId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{dest.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{dest.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>⭐ {dest.rating}</span>
                            <span>🕒 {dest.time}</span>
                            <span>👥 {dest.crowd} crowds</span>
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
                            onClick={() => toggleFavorite(dest.id)}
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

        {selectedTab === 'trips' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Planned Trips</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">🏖️ Beach Day Adventure</h3>
                    <p className="text-sm text-gray-600">Waikiki → Lanikai → Kailua</p>
                    <p className="text-xs text-gray-500">Planned for tomorrow, 9:00 AM</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-tropical-600 text-white px-3 py-1 rounded text-sm">View</button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">🏔️ Island Highlights Tour</h3>
                    <p className="text-sm text-gray-600">Diamond Head → Pearl Harbor → North Shore</p>
                    <p className="text-xs text-gray-500">Planned for Friday, 8:00 AM</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-tropical-600 text-white px-3 py-1 rounded text-sm">View</button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'guide' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Hawaii Visitor Guide</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-tropical-500 pl-4">
                <h3 className="font-semibold text-lg">🌺 Hawaiian Culture & Etiquette</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Always remove shoes before entering homes</li>
                  <li>• Learn to say "Aloha" (hello/goodbye) and "Mahalo" (thank you)</li>
                  <li>• Respect sacred sites and kapu (forbidden) areas</li>
                  <li>• Don't take lava rocks, sand, or coral as souvenirs</li>
                </ul>
              </div>
              <div className="border-l-4 border-ocean-500 pl-4">
                <h3 className="font-semibold text-lg">🚌 Getting Around Oahu</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Download the DaBus app for real-time schedules</li>
                  <li>• Get a HOLO card for easy bus payments ($3.00 per ride with free transfers)</li>
                  <li>• Use Biki bike share for short trips in Honolulu</li>
                  <li>• Allow extra time during rush hours (7-9 AM, 4-6 PM)</li>
                </ul>
              </div>
              <div className="border-l-4 border-sunset-500 pl-4">
                <h3 className="font-semibold text-lg">🏖️ Beach Safety</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Always use reef-safe sunscreen</li>
                  <li>• Check beach conditions before swimming</li>
                  <li>• Never turn your back on the ocean</li>
                  <li>• Stay hydrated and seek shade during peak sun hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'main' && (
          <>
        {/* Today's Conditions Alert - Only show if real data available */}
        {beachConditions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Today's Ocean & Weather</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-blue-700">
                <strong>Surf:</strong> {beachConditions.surfHeight}
              </div>
              <div className="text-blue-700">
                <strong>Water:</strong> {beachConditions.waterTemp}°F
              </div>
              <div className="text-blue-700">
                <strong>UV Index:</strong> {beachConditions.uvIndex} (High)
              </div>
              <div className="text-blue-700">
                <strong>Wind:</strong> {beachConditions.windSpeed} mph
              </div>
            </div>
          </div>
        )}

        {/* Discovery Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Discover Oahu</h2>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory('beaches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'beaches' 
                  ? 'bg-tropical-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Waves className="h-5 w-5" />
              Beaches
            </button>
            <button
              onClick={() => setSelectedCategory('attractions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'attractions' 
                  ? 'bg-tropical-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Camera className="h-5 w-5" />
              Attractions
            </button>
            <button
              onClick={() => setSelectedCategory('food')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'food' 
                  ? 'bg-tropical-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Utensils className="h-5 w-5" />
              Local Food
            </button>
          </div>

          <div className="space-y-4">
            {destinations[selectedCategory as keyof typeof destinations].map((dest, idx) => (
              <div key={dest.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-xl">{dest.name}</h3>
                      <button
                        onClick={() => toggleFavorite(dest.id)}
                        className={`p-1 rounded-full ${
                          favorites.includes(dest.id) 
                            ? 'text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(dest.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-3">{dest.description}</p>
                    
                    <div className="flex items-center gap-6 mb-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {dest.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {dest.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {dest.crowd} crowds
                      </span>
                    </div>

                    {/* Cultural Information */}
                    <div className="bg-tropical-50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-tropical-800 mb-1">
                        🌺 Cultural Context: {dest.culturalInfo}
                      </p>
                      <p className="text-sm text-tropical-700">
                        🗣️ Pronunciation: {dest.pronunciation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Best Time:</strong> {dest.bestTime}
                      </div>
                      <div>
                        <strong>Activities:</strong> {dest.activities.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button 
                      onClick={() => getDirections(dest.name)}
                      className="bg-tropical-600 text-white px-6 py-3 rounded-lg hover:bg-tropical-700 flex items-center justify-center gap-2"
                    >
                      <Navigation className="h-5 w-5" />
                      Get Directions
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">{dest.safetyLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Data Cards */}
        <div className={`grid ${beachConditions ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-6`}>
          {beachConditions && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Waves className="h-5 w-5 text-blue-600" />
                Beach Conditions
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Surf Height:</span>
                  <span className="font-medium">{beachConditions.surfHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Temp:</span>
                  <span className="font-medium">{beachConditions.waterTemp}°F</span>
                </div>
                <div className="flex justify-between">
                  <span>UV Index:</span>
                  <span className="font-medium text-orange-600">High ({beachConditions.uvIndex})</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibility:</span>
                  <span className="font-medium text-green-600">{beachConditions.visibility}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Palmtree className="h-5 w-5 text-green-600" />
              Local Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Golden hour: 6-7 AM & 6-7 PM</li>
              <li>• Use reef-safe sunscreen only</li>
              <li>• Download offline maps</li>
              <li>• Learn basic Hawaiian words</li>
              <li>• Respect sacred/kapu areas</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-brown-600" />
              Cultural Etiquette
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Remove shoes before entering homes</li>
              <li>• Don't take lava rocks or sand</li>
              <li>• Learn "aloha" and "mahalo"</li>
              <li>• Respect local fishing spots</li>
              <li>• Share waves and trails</li>
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
              {favorites.map(favId => {
                const allDests = [...destinations.beaches, ...destinations.attractions, ...destinations.food];
                const dest = allDests.find(d => d.id === favId);
                return dest ? (
                  <div key={favId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{dest.name}</p>
                      <p className="text-sm text-gray-600">{dest.time} transit • {dest.rating}⭐</p>
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