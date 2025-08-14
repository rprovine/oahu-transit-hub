"use client";

import { useState } from 'react';
import { MapPin, Bus, Train, Clock, CloudSun, Navigation } from 'lucide-react';

export default function LocalDashboard() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-white">
      <header className="bg-ocean-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Oahu Transit Hub - Kama'āina</h1>
          <nav className="flex gap-4">
            <button className="hover:text-ocean-200">Routes</button>
            <button className="hover:text-ocean-200">Schedule</button>
            <button className="hover:text-ocean-200">Settings</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-volcanic-900">Plan Your Commute</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  placeholder="Enter starting location..."
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
                  placeholder="Enter destination..."
                />
              </div>
            </div>

            <button className="w-full bg-ocean-600 text-white py-3 rounded-lg font-semibold hover:bg-ocean-700 transition-colors flex items-center justify-center gap-2">
              <Navigation className="h-5 w-5" />
              Find Routes
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Bus className="h-8 w-8 text-ocean-600" />
              <h3 className="text-lg font-semibold">Next Bus</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">Route 8</p>
            <p className="text-gray-600">Arrives in 5 minutes</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <CloudSun className="h-8 w-8 text-tropical-600" />
              <h3 className="text-lg font-semibold">Weather</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">78°F</p>
            <p className="text-gray-600">Partly cloudy</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-sunset-600" />
              <h3 className="text-lg font-semibold">Commute Time</h3>
            </div>
            <p className="text-2xl font-bold text-volcanic-900">32 min</p>
            <p className="text-gray-600">Normal traffic</p>
          </div>
        </div>
      </main>
    </div>
  );
}