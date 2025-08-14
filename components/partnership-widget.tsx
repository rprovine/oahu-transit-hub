"use client";

import { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Users, Star, Navigation, Train, 
  Leaf, TrendingUp, AlertCircle, CheckCircle,
  Calendar, Coffee, Waves
} from 'lucide-react';

interface PartnershipWidgetProps {
  partnerType: 'hotel' | 'restaurant' | 'tour_operator' | 'activity_provider';
  partnerId: string;
  guestLocation?: { lat: number; lon: number };
  guestPreferences?: string[];
}

export default function PartnershipWidget({ 
  partnerType, 
  partnerId, 
  guestLocation, 
  guestPreferences = [] 
}: PartnershipWidgetProps) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('immediate');

  useEffect(() => {
    loadPartnershipData();
  }, [guestLocation, guestPreferences]);

  const loadPartnershipData = async () => {
    setLoading(true);
    try {
      // Get guest recommendations
      if (guestLocation) {
        const recResponse = await fetch('/api/partnerships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get_guest_recommendations',
            guestLocation,
            preferences: guestPreferences,
            timeframe: selectedTimeframe
          })
        });
        
        if (recResponse.ok) {
          const recData = await recResponse.json();
          if (recData.success) {
            setRecommendations(recData.recommendations);
          }
        }
      }

      // Get concierge insights
      const insightsResponse = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_concierge_insights',
          partnerType
        })
      });

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        if (insightsData.success) {
          setInsights(insightsData.insights);
        }
      }
    } catch (error) {
      console.error('Failed to load partnership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackGuestActivity = async (destination: string, transportationType: string) => {
    try {
      await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_guest_activity',
          partnerId,
          destination,
          transportationUsed: transportationType,
          location: guestLocation,
          activityType: 'destination_visit',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track guest activity:', error);
    }
  };

  const getTransportationOptions = async (destination: string) => {
    try {
      const response = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_transportation_options',
          guestLocation,
          destination
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Show transportation modal or redirect to trip planner
          const params = new URLSearchParams({
            destination,
            origin: 'Hotel Location',
            partner: partnerId
          });
          window.open(`/trip-planner?${params.toString()}`, '_blank');
          
          // Track the activity
          await trackGuestActivity(destination, 'transit_planned');
        }
      }
    } catch (error) {
      console.error('Failed to get transportation options:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guest Recommendations Section */}
      {recommendations && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Personalized Guest Recommendations
            </h3>
            <div className="flex gap-2">
              {['immediate', 'today', 'tomorrow'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-tropical-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Transportation Status Alert */}
          {insights?.transportation?.skylineStatus && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Train className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">HART Skyline Update</span>
              </div>
              <p className="text-sm text-purple-700">
                Segment {insights.transportation.skylineStatus.operationalSegments} operational. 
                Next opening: {insights.transportation.skylineStatus.nextOpening?.expectedDate}
              </p>
            </div>
          )}

          {/* Recommendations by timeframe */}
          <div className="grid gap-4">
            {recommendations[selectedTimeframe]?.slice(0, 3).map((dest: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{dest.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{dest.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dest.estimatedVisitDuration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dest.crowdLevel} crowds
                      </span>
                      {dest.sustainabilityTips && (
                        <span className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-green-600" />
                          Eco-friendly
                        </span>
                      )}
                    </div>

                    {/* Cultural context */}
                    {dest.hawaiianName && (
                      <div className="bg-tropical-50 p-2 rounded text-sm mb-2">
                        <span className="font-medium text-tropical-800">
                          🌺 Hawaiian: {dest.hawaiianName}
                        </span>
                        {dest.pronunciation && (
                          <span className="text-tropical-700 ml-2">
                            ({dest.pronunciation})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={() => getTransportationOptions(dest.name)}
                      className="bg-tropical-600 text-white px-4 py-2 rounded-lg hover:bg-tropical-700 flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      Plan Transit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sustainability Impact */}
          {recommendations.transportation && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Sustainability Impact</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-700">
                  <strong>Carbon Savings:</strong> 76% less CO2 vs driving
                </div>
                <div className="text-green-700">
                  <strong>Local Support:</strong> Transit fares support community
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Concierge Insights Dashboard */}
      {insights && partnerType === 'hotel' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Concierge Insights Dashboard
          </h3>

          {/* Trending Destinations */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">🔥 Trending Destinations</h4>
              <div className="space-y-2">
                {insights.trending?.destinations?.map((dest: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{dest.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">{dest.trend}</span>
                      <span className="text-xs text-gray-500">{dest.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🚌 Transportation Recommendations</h4>
              <div className="space-y-2">
                {insights.transportation?.recommendedRoutes?.slice(0, 3).map((route: any, idx: number) => (
                  <div key={idx} className="p-2 bg-blue-50 rounded text-sm">
                    <div className="font-medium">{route.from} → {route.to}</div>
                    <div className="text-blue-700">{route.best}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Crowd Management */}
          {insights.crowdManagement && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Current Crowd Levels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Current Hotspots:</div>
                  <div className="space-y-1">
                    {insights.crowdManagement.currentHotspots.map((spot: string, idx: number) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          spot.includes('High') ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        {spot}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Recommended Alternatives:</div>
                  <div className="space-y-1">
                    {insights.crowdManagement.alternatives?.slice(0, 2).map((alt: any, idx: number) => (
                      <div key={idx} className="text-sm p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-800">
                          Instead of {alt.instead_of}
                        </div>
                        <div className="text-green-700">
                          Try {alt.try} - {alt.benefit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hotel-Specific Metrics */}
          {insights.hotelSpecific && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🏨 Hotel-Specific Insights</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Guest Satisfaction</div>
                  <div className="text-lg font-bold text-blue-600">
                    {insights.hotelSpecific.conciergeMetrics?.guestSatisfaction}
                  </div>
                  <div className="text-gray-500">Transit recommendations</div>
                </div>
                <div>
                  <div className="font-medium">Avg Transit Time</div>
                  <div className="text-lg font-bold text-green-600">
                    {insights.hotelSpecific.conciergeMetrics?.averageTransitTime}
                  </div>
                  <div className="text-gray-500">To major attractions</div>
                </div>
                <div>
                  <div className="font-medium">Top Requests</div>
                  <div className="text-sm text-gray-600">
                    {insights.hotelSpecific.conciergeMetrics?.mostRequestedDestinations?.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cultural Events Calendar */}
      {insights?.culturalCalendar && insights.culturalCalendar.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Cultural Events This Week
          </h3>
          <div className="space-y-3">
            {insights.culturalCalendar.map((event: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                    <p className="text-xs text-gray-500">{event.culturalSignificance}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{event.date}</div>
                    <div className="text-xs text-blue-600">{event.transitAccess}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner Contact */}
      <div className="bg-tropical-50 rounded-lg p-4">
        <div className="text-center">
          <h4 className="font-semibold text-tropical-800 mb-2">
            Need Custom Recommendations?
          </h4>
          <p className="text-sm text-tropical-700 mb-3">
            Our partnership team can create personalized experiences for your guests.
          </p>
          <button className="bg-tropical-600 text-white px-4 py-2 rounded-lg hover:bg-tropical-700">
            Contact Partnership Team
          </button>
        </div>
      </div>
    </div>
  );
}