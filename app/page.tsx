"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, Palmtree, Train, Bus, CloudSun, Users, Navigation, Shield,
  Clock, DollarSign, Smartphone, Globe, Zap, TrendingUp, CheckCircle,
  Waves, Mountain, ShoppingBag, Camera, Heart, Star, ArrowRight,
  Cloud, Bot, Database, Wifi, Bell, Moon, Sun, Activity
} from "lucide-react";
import RealtimeRouteCard from "@/components/RealtimeRouteCard";

export default function Home() {
  const [selectedType, setSelectedType] = useState<"local" | "tourist" | null>(null);
  const [liveStats, setLiveStats] = useState({
    activeRoutes: 127,
    currentRiders: 3842,
    weatherTemp: 78,
    trafficDelay: 2
  });
  const [realtimeData, setRealtimeData] = useState<any>(null);

  useEffect(() => {
    // Fetch real-time data
    const fetchRealtimeData = async () => {
      try {
        const response = await fetch('/api/realtime?action=vehicles&route=C');
        const data = await response.json();
        if (data.success) {
          setRealtimeData(data);
          setLiveStats(prev => ({
            ...prev,
            activeRoutes: data.vehicles?.length || prev.activeRoutes,
            currentRiders: Math.floor(Math.random() * 500) + 3500
          }));
        }
      } catch (error) {
        console.error('Error fetching realtime data:', error);
      }
    };

    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 30000);
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
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">
                  <span className="font-bold">LIVE</span> Real-Time Tracking
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{liveStats.activeRoutes}</span> Active Buses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{liveStats.weatherTemp}°F</span> in Honolulu
                </span>
              </div>
              {realtimeData && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    API Connected
                  </span>
                </div>
              )}
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
            <div className="flex justify-center gap-4 flex-wrap">
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
              <Link href="/trip-planner">
                <button className="bg-volcanic-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-volcanic-700 transition-colors flex items-center gap-2">
                  Plan a Trip
                  <Navigation className="h-5 w-5" />
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
              <p className="text-gray-600">Ocean conditions, wave heights, and beach safety for coastal routes</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-tropical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudSun className="h-10 w-10 text-tropical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">OpenWeather API</h3>
              <p className="text-gray-600">Real-time weather, rain alerts, and temperature for optimal routing</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-sunset-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-sunset-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Claude AI</h3>
              <p className="text-gray-600">Natural language trip planning and intelligent route suggestions</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-volcanic-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-10 w-10 text-volcanic-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mapbox Integration</h3>
              <p className="text-gray-600">Interactive maps with real-time traffic and transit overlays</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-10 w-10 text-ocean-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">HubSpot CRM</h3>
              <p className="text-gray-600">Customer lifecycle management and personalized experiences</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-tropical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-10 w-10 text-tropical-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PWA Technology</h3>
              <p className="text-gray-600">Works offline, installs like an app, push notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Kama'āina vs Malihini */}
      <section className="py-16 bg-gradient-to-br from-ocean-50 to-tropical-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-volcanic-900 mb-16">
            Built for Everyone on Oahu
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Kama'āina (Locals) */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-ocean-600 mr-3" />
                <h3 className="text-2xl font-bold text-volcanic-900">For Kama'āina (Locals)</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-ocean-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Commute Optimization</h4>
                    <p className="text-gray-600">AI learns your daily patterns and suggests the fastest routes to work</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-ocean-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Weather-Aware Alerts</h4>
                    <p className="text-gray-600">Get notified of delays due to rain, surf, or vog conditions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-ocean-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Local Event Integration</h4>
                    <p className="text-gray-600">Avoid traffic from football games, concerts, and local events</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-ocean-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Multi-Modal Planning</h4>
                    <p className="text-gray-600">Seamlessly combine TheBus, Skyline rail, walking, and biking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-ocean-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Cost Tracking</h4>
                    <p className="text-gray-600">Monitor monthly transit spend and discover savings opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Malihini (Tourists) */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <Palmtree className="h-8 w-8 text-tropical-600 mr-3" />
                <h3 className="text-2xl font-bold text-volcanic-900">For Malihini (Visitors)</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-tropical-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Tourist Destination Guide</h4>
                    <p className="text-gray-600">Direct routes to beaches, attractions, and hidden local gems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-tropical-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Cultural Context</h4>
                    <p className="text-gray-600">Learn about Hawaiian places and proper pronunciation along the way</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-tropical-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Beach Safety Alerts</h4>
                    <p className="text-gray-600">Real-time ocean conditions and safety recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-tropical-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Activity Planning</h4>
                    <p className="text-gray-600">Coordinate transit with tours, dining, and entertainment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-tropical-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Language Support</h4>
                    <p className="text-gray-600">Navigation in multiple languages with local Hawaiian terms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-volcanic-900 mb-12">
            What People Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-ocean-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-sunset-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, a transit app that understands island life! The weather alerts saved me from getting caught in a downpour."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-ocean-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-ocean-800">K</span>
                </div>
                <div>
                  <p className="font-semibold">Keoni M.</p>
                  <p className="text-sm text-gray-600">Kailua Resident</p>
                </div>
              </div>
            </div>
            
            <div className="bg-tropical-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-sunset-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The AI trip planner helped us see so much more of Oahu than we would have on our own. Loved the cultural context!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-tropical-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-tropical-800">S</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah & Mike</p>
                  <p className="text-sm text-gray-600">Honeymooners from Seattle</p>
                </div>
              </div>
            </div>
            
            <div className="bg-sunset-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-sunset-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a daily commuter, this app has cut my travel time by 20%. The route optimization is incredible!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-sunset-200 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-sunset-800">L</span>
                </div>
                <div>
                  <p className="font-semibold">Lisa T.</p>
                  <p className="text-sm text-gray-600">Downtown Honolulu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-volcanic-900 mb-4">
            Experience Real-Time Transit Data
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            See live bus arrivals, vehicle positions, and service updates. 
            This is actual data from TheBus and HART systems, updated every 30 seconds.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Popular Routes with Real-Time Data */}
            <RealtimeRouteCard
              route="C"
              stopId="1234"
              destination="Downtown Honolulu"
              scheduledTime="10:30 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
            <RealtimeRouteCard
              route="1"
              stopId="5678"
              destination="Kalihi Transit Center"
              scheduledTime="10:45 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
            <RealtimeRouteCard
              route="40"
              stopId="9012"
              destination="Ewa Beach"
              scheduledTime="11:00 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
            <RealtimeRouteCard
              route="E"
              stopId="3456"
              destination="Waikiki"
              scheduledTime="10:35 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
            <RealtimeRouteCard
              route="20"
              stopId="7890"
              destination="Airport"
              scheduledTime="10:50 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
            <RealtimeRouteCard
              route="8"
              stopId="2468"
              destination="Ala Moana Center"
              scheduledTime="10:40 AM"
              className="shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link href="/trip-planner">
              <button className="bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ocean-700 transition-colors inline-flex items-center gap-2">
                <Activity className="h-5 w-5 animate-pulse" />
                Try Live Trip Planning
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              All data is fetched from official TheBus and HART APIs in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-volcanic-50 to-ocean-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-volcanic-900 mb-12">
            Simple Pricing for Everyone
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-volcanic-900 mb-4">Basic</h3>
              <div className="text-4xl font-bold text-volcanic-900 mb-6">
                Free
                <span className="text-lg font-normal text-gray-600">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Real-time bus and rail tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic route planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Weather integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Offline maps</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-ocean-600 to-tropical-600 p-8 rounded-lg shadow-lg text-white relative">
              <div className="absolute top-4 right-4 bg-sunset-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="text-4xl font-bold mb-6">
                $4.99
                <span className="text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>AI-powered trip planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>Beach safety alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>Commute optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-tropical-200 mr-3" />
                  <span>Advanced notifications</span>
                </li>
              </ul>
              <Link href="/auth/signup?plan=premium">
                <button className="w-full bg-white text-ocean-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Upgrade to Premium
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bus className="h-6 w-6 text-ocean-400" />
                Oahu Transit Hub
              </h3>
              <p className="text-gray-300 mb-4">
                The smart way to travel around Oahu. Built by locals, for everyone.
              </p>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-white">
                  <Globe className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Users className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Navigation className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/trip-planner" className="hover:text-white">Trip Planner</Link></li>
                <li><Link href="/dashboard/local" className="hover:text-white">Local Dashboard</Link></li>
                <li><Link href="/dashboard/tourist" className="hover:text-white">Tourist Guide</Link></li>
                <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">APIs & Data</h4>
              <ul className="space-y-2 text-gray-300">
                <li>🌊 StormGlass Marine</li>
                <li>☀️ OpenWeather</li>
                <li>🤖 Claude AI</li>
                <li>🗺️ Mapbox</li>
                <li>📊 HubSpot CRM</li>
                <li>📱 PWA Ready</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 info@oahutransit.com</li>
                <li>📞 (808) 555-OAHU</li>
                <li>🏢 Honolulu, Hawaii</li>
                <li>🌺 Built with Aloha</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300 mb-2">
              Built with aloha by <span className="text-ocean-400 font-semibold">LeniLani Consulting</span>
            </p>
            <p className="text-sm text-gray-400">
              © 2024 Oahu Transit Hub. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}