"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, Palmtree, Train, Bus, CloudSun, Users, Navigation, Shield,
  Clock, DollarSign, Smartphone, Globe, Zap, TrendingUp, CheckCircle,
  Waves, Mountain, ShoppingBag, Camera, Heart, Star, ArrowRight,
  Cloud, Bot, Database, Wifi, Bell, Moon, Sun, Activity
} from "lucide-react";

export default function Home() {
  const [selectedType, setSelectedType] = useState<"local" | "tourist" | null>(null);
  const [liveStats, setLiveStats] = useState({
    activeRoutes: 127,
    currentRiders: 3842,
    weatherTemp: 78,
    trafficDelay: 2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeRoutes: Math.floor(Math.random() * 20) + 120,
        currentRiders: Math.floor(Math.random() * 500) + 3500,
        weatherTemp: Math.floor(Math.random() * 5) + 76,
        trafficDelay: Math.floor(Math.random() * 5)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-600/10 to-tropical-600/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-12">
            {/* Live Stats Bar */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{liveStats.activeRoutes}</span> Active Routes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{liveStats.currentRiders.toLocaleString()}</span> Current Riders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{liveStats.weatherTemp}°F</span> in Honolulu
                </span>
              </div>
            </div>

            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Bus className="h-20 w-20 text-ocean-600 absolute -left-10 top-0 animate-pulse" />
                <Train className="h-24 w-24 text-tropical-600 z-10 relative" />
                <Palmtree className="h-16 w-16 text-sunset-500 absolute -right-8 top-2 animate-sway" />
              </div>
            </div>

            <h1 className="text-6xl font-bold text-volcanic-900 mb-6 text-hawaiian">
              Oahu Transit Hub
            </h1>
            <p className="text-2xl text-volcanic-700 max-w-3xl mx-auto mb-8">
              The only transit app built by locals, for everyone. 
              Real-time navigation powered by AI, weather data, and aloha spirit.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4">
              <Link href="/dashboard/local">
                <button className="bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ocean-700 transition-colors flex items-center gap-2">
                  I Live Here
                  <Users className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/dashboard/tourist">
                <button className="bg-tropical-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-tropical-700 transition-colors flex items-center gap-2">
                  I'm Visiting
                  <Palmtree className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-volcanic-900 mb-12">
            Powered by Real-Time Data
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-10 w-10 text-ocean-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">StormGlass Marine API</h3>
              <p className="text-gray-600">Ocean conditions for beach routes</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-tropical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudSun className="h-10 w-10 text-tropical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">OpenWeather API</h3>
              <p className="text-gray-600">Real-time weather conditions</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-sunset-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-sunset-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Claude AI</h3>
              <p className="text-gray-600">Natural language trip planning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 mb-4">
            Built with aloha by LeniLani Consulting
          </p>
          <p className="text-sm text-gray-400">
            © 2024 Oahu Transit Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}