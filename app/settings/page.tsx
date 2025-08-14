"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Home, Building, Star, Save, 
  User, Bell, Shield, Smartphone, Globe, Trash2
} from 'lucide-react';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'favorite';
}

interface Settings {
  locations: SavedLocation[];
  notifications: {
    routeAlerts: boolean;
    weatherAlerts: boolean;
    serviceDisruptions: boolean;
    emailUpdates: boolean;
  };
  preferences: {
    defaultTransportMode: 'fastest' | 'cheapest' | 'greenest';
    walkingDistance: number;
    accessibilityMode: boolean;
    language: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    locations: [],
    notifications: {
      routeAlerts: true,
      weatherAlerts: true,
      serviceDisruptions: true,
      emailUpdates: false
    },
    preferences: {
      defaultTransportMode: 'fastest',
      walkingDistance: 0.5,
      accessibilityMode: false,
      language: 'en'
    }
  });
  
  const [activeTab, setActiveTab] = useState('locations');
  const [newLocation, setNewLocation] = useState({ name: '', address: '', type: 'home' as const });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('oahu_transit_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('oahu_transit_settings', JSON.stringify(settings));
      
      // Also sync with server if user is logged in
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      }).catch(() => {
        // Ignore server errors, localStorage is primary
      });
      
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsSaving(false);
    }
  };

  const handleAddressChange = async (value: string) => {
    setNewLocation({ ...newLocation, address: value });
    
    if (value.length > 2) {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions.map((s: any) => s.place_name).slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to Oahu locations
        const oahuLocations = [
          'Honolulu, HI',
          'Waikiki, Honolulu, HI',
          'Kailua, HI',
          'Pearl City, HI',
          'Kaneohe, HI'
        ].filter(loc => loc.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(oahuLocations);
        setShowSuggestions(oahuLocations.length > 0);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const addLocation = () => {
    if (!newLocation.name || !newLocation.address) return;
    
    const location: SavedLocation = {
      id: Date.now().toString(),
      ...newLocation
    };
    
    setSettings({
      ...settings,
      locations: [...settings.locations, location]
    });
    
    setNewLocation({ name: '', address: '', type: 'home' });
    setShowSuggestions(false);
  };

  const removeLocation = (id: string) => {
    setSettings({
      ...settings,
      locations: settings.locations.filter(loc => loc.id !== id)
    });
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5 text-blue-600" />;
      case 'work': return <Building className="h-5 w-5 text-green-600" />;
      case 'favorite': return <Star className="h-5 w-5 text-yellow-600" />;
      default: return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/local" className="text-ocean-600 hover:text-ocean-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-volcanic-900">Settings</h1>
              <p className="text-gray-600">Customize your Oahu Transit experience</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('locations')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'locations'
                      ? 'border-ocean-500 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Saved Locations
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'notifications'
                      ? 'border-ocean-500 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bell className="h-4 w-4 inline mr-2" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'preferences'
                      ? 'border-ocean-500 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Preferences
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Locations Tab */}
              {activeTab === 'locations' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Saved Locations</h3>
                  
                  {/* Add New Location */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-3">Add New Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={newLocation.type}
                          onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                        >
                          <option value="home">🏠 Home</option>
                          <option value="work">🏢 Work</option>
                          <option value="favorite">⭐ Favorite</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={newLocation.name}
                          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                          placeholder="Home, Work, Gym, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={newLocation.address}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          placeholder="Enter address in Oahu..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                        />
                        
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setNewLocation({ ...newLocation, address: suggestion });
                                  setShowSuggestions(false);
                                }}
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
                    
                    <button
                      onClick={addLocation}
                      disabled={!newLocation.name || !newLocation.address}
                      className="mt-4 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 disabled:bg-gray-400 transition-colors"
                    >
                      Add Location
                    </button>
                  </div>

                  {/* Existing Locations */}
                  <div className="space-y-3">
                    {settings.locations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getLocationIcon(location.type)}
                          <div>
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-gray-600">{location.address}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLocation(location.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {settings.locations.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No saved locations yet. Add your home and work addresses to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-gray-600">
                            {key === 'routeAlerts' && 'Get notified about delays and service changes'}
                            {key === 'weatherAlerts' && 'Receive weather-related transit advisories'}
                            {key === 'serviceDisruptions' && 'Alert for major service disruptions'}
                            {key === 'emailUpdates' && 'Weekly summary emails'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, [key]: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ocean-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Travel Preferences</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Route Type</label>
                      <select
                        value={settings.preferences.defaultTransportMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, defaultTransportMode: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                      >
                        <option value="fastest">⚡ Fastest Route</option>
                        <option value="cheapest">💰 Cheapest Route</option>
                        <option value="greenest">🌱 Most Eco-Friendly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Walking Distance: {settings.preferences.walkingDistance} miles
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={settings.preferences.walkingDistance}
                        onChange={(e) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, walkingDistance: parseFloat(e.target.value) }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Accessibility Mode</p>
                        <p className="text-sm text-gray-600">Prioritize wheelchair accessible routes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.accessibilityMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: { ...settings.preferences, accessibilityMode: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ocean-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isSaving
                  ? 'bg-green-500 text-white'
                  : 'bg-ocean-600 text-white hover:bg-ocean-700'
              }`}
            >
              {isSaving ? (
                <>
                  <Save className="h-5 w-5 inline mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 inline mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}