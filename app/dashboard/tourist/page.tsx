"use client";

import { useState } from 'react';
import { MapPin, Camera, Waves, Mountain, ShoppingBag, Star } from 'lucide-react';

export default function TouristDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('beaches');

  const destinations = {
    beaches: [
      { name: "Lanikai Beach", rating: 4.9, time: "45 min", crowd: "Low" },
      { name: "Waikiki Beach", rating: 4.5, time: "15 min", crowd: "High" },
      { name: "Sunset Beach", rating: 4.8, time: "1h 20min", crowd: "Medium" }
    ],
    attractions: [
      { name: "Diamond Head", rating: 4.7, time: "25 min", crowd: "Medium" },
      { name: "Pearl Harbor", rating: 4.9, time: "35 min", crowd: "High" },
      { name: "Hanauma Bay", rating: 4.8, time: "30 min", crowd: "High" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tropical-50 to-white">
      <header className="bg-tropical-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Oahu Transit Hub - Malihini</h1>
          <nav className="flex gap-4">
            <button className="hover:text-tropical-200">Explore</button>
            <button className="hover:text-tropical-200">My Trips</button>
            <button className="hover:text-tropical-200">Guide</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Discover Oahu</h2>
          
          <div className="flex gap-4 mb-6">
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
          </div>

          <div className="space-y-4">
            {destinations[selectedCategory as keyof typeof destinations].map((dest, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{dest.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {dest.rating}
                      </span>
                      <span>Transit: {dest.time}</span>
                      <span>Crowd: {dest.crowd}</span>
                    </div>
                  </div>
                  <button className="bg-tropical-600 text-white px-4 py-2 rounded-lg hover:bg-tropical-700">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Today's Beach Conditions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Surf Height:</span>
                <span className="font-medium">3-5 ft</span>
              </div>
              <div className="flex justify-between">
                <span>Water Temp:</span>
                <span className="font-medium">79°F</span>
              </div>
              <div className="flex justify-between">
                <span>UV Index:</span>
                <span className="font-medium text-orange-600">High (8)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Local Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Best time for photos: Golden hour (6-7 AM)</li>
              <li>• Avoid Waikiki parking - take the bus!</li>
              <li>• Bring reef-safe sunscreen only</li>
              <li>• Try local food trucks for authentic cuisine</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}