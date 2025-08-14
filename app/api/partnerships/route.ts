import { NextRequest, NextResponse } from 'next/server';
import { locationService } from '@/lib/services/location';
import { getDestinationsByCategory, getDestinationsByTimeOfDay } from '@/lib/data/tourist-destinations';
import { hartSkylineService } from '@/lib/services/hart-skyline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, partnerType, guestLocation, preferences, timeframe } = body;

    switch (action) {
      case 'get_guest_recommendations':
        return await getGuestRecommendations(guestLocation, preferences, timeframe);
      
      case 'track_guest_activity':
        return await trackGuestActivity(body);
      
      case 'get_concierge_insights':
        return await getConciergeInsights(partnerType);
      
      case 'get_transportation_options':
        return await getTransportationOptions(guestLocation, body.destination);
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Partnership API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process partnership request' },
      { status: 500 }
    );
  }
}

async function getGuestRecommendations(
  guestLocation: { lat: number; lon: number },
  preferences: string[],
  timeframe: string
) {
  try {
    const userLocation = [guestLocation.lon, guestLocation.lat] as [number, number];
    const currentHour = new Date().getHours();
    
    // Get personalized recommendations based on preferences
    const recommendations: {
      immediate: any[];
      today: any[];
      tomorrow: any[];
      thisWeek: any[];
    } = {
      immediate: [], // Next 2 hours
      today: [],     // Rest of today
      tomorrow: [],  // Tomorrow
      thisWeek: []   // This week
    };

    // Categorize preferences and get relevant destinations
    const preferenceMapping = {
      beaches: 'Beach',
      culture: 'Historical',
      food: 'Food',
      nature: 'Hiking',
      shopping: 'Attraction',
      museums: 'Museum'
    };

    for (const pref of preferences) {
      if (preferenceMapping[pref as keyof typeof preferenceMapping]) {
        const category = preferenceMapping[pref as keyof typeof preferenceMapping] as any;
        const destinations = getDestinationsByCategory(category, userLocation);
        
        // Add to appropriate timeframe
        if (pref === 'beaches' && currentHour >= 6 && currentHour <= 18) {
          recommendations.immediate.push(...destinations.slice(0, 2));
        } else if (pref === 'food') {
          if (currentHour >= 11 && currentHour <= 14) {
            recommendations.immediate.push(...destinations.slice(0, 3));
          }
          recommendations.today.push(...destinations.slice(0, 5));
        } else {
          recommendations.today.push(...destinations.slice(0, 3));
          recommendations.tomorrow.push(...destinations.slice(0, 2));
        }
      }
    }

    // Get time-based recommendations
    const timeBasedRecs = getDestinationsByTimeOfDay(currentHour, userLocation);
    recommendations.immediate.push(...timeBasedRecs.slice(0, 2));

    // Add transportation context
    const transportationInsights = await getTransportationInsights(guestLocation);

    // Add cultural events and seasonal activities
    const culturalEvents = await getCulturalEvents(timeframe);

    return NextResponse.json({
      success: true,
      recommendations: {
        ...recommendations,
        transportation: transportationInsights,
        culturalEvents,
        sustainabilityTips: [
          'Use public transit - it reduces traffic and supports local infrastructure',
          'Choose reef-safe sunscreen to protect marine ecosystems',
          'Support local businesses to benefit the community',
          'Respect cultural sites and follow visitor guidelines'
        ]
      }
    });
  } catch (error) {
    console.error('Guest recommendations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

async function trackGuestActivity(data: any) {
  try {
    // Track guest activities for analytics and personalization
    const activity = {
      timestamp: new Date().toISOString(),
      guestId: data.guestId,
      partnerId: data.partnerId,
      activityType: data.activityType,
      destination: data.destination,
      transportationUsed: data.transportationUsed,
      location: data.location,
      satisfaction: data.satisfaction,
      metadata: {
        timeSpent: data.timeSpent,
        crowdLevel: data.crowdLevel,
        weatherConditions: data.weatherConditions
      }
    };

    // In production, this would save to a database
    console.log('Guest activity tracked:', activity);

    // Provide immediate insights
    const insights = await generateActivityInsights(activity);

    return NextResponse.json({
      success: true,
      activityId: `activity_${Date.now()}`,
      insights
    });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track activity' },
      { status: 500 }
    );
  }
}

async function getConciergeInsights(partnerType: string) {
  try {
    const insights: any = {
      trending: {
        destinations: [
          { name: 'Lanikai Beach', trend: '+15%', reason: 'Perfect weather conditions' },
          { name: 'Diamond Head', trend: '+8%', reason: 'Early morning hiking popularity' },
          { name: 'Chinatown Food Tour', trend: '+12%', reason: 'New restaurant openings' }
        ],
        activities: [
          { activity: 'Snorkeling', trend: '+20%', season: 'Current calm conditions' },
          { activity: 'Cultural Tours', trend: '+10%', reason: 'Heritage month events' }
        ]
      },
      transportation: {
        skylineStatus: await hartSkylineService.getSkylineStatus(),
        busServiceAlerts: [],
        trafficConditions: 'Moderate - typical for time of day',
        recommendedRoutes: [
          { from: 'Waikiki Hotels', to: 'Airport', best: 'HART Skyline (when available) or Route 20' },
          { from: 'Downtown Hotels', to: 'Pearl Harbor', best: 'Route 20 direct service' }
        ]
      },
      sustainability: {
        carbonSavings: 'Guests using public transit save avg 2.3kg CO2 per day',
        reefProtection: 'Reef-safe sunscreen usage up 40% this quarter',
        localEconomy: 'Tourism spending on local businesses increased 25%'
      },
      crowdManagement: {
        currentHotspots: ['Hanauma Bay (High)', 'Waikiki Beach (Medium)', 'Diamond Head (Medium)'],
        alternatives: [
          { instead_of: 'Hanauma Bay', try: 'Keehole Point Beach', benefit: '75% fewer crowds' },
          { instead_of: 'Diamond Head morning', try: 'Afternoon with sunset views', benefit: 'Cooler temps, fewer crowds' }
        ]
      },
      culturalCalendar: await getCulturalEvents('this_week')
    };

    // Add partner-specific insights
    if (partnerType === 'hotel') {
      insights.hotelSpecific = {
        checkoutTransportation: 'Recommend Route 20 or upcoming HART Skyline for airport',
        roomServiceTiming: 'Peak transit times 7-9 AM, 4-6 PM - factor into activity recommendations',
        conciergeMetrics: {
          mostRequestedDestinations: ['Pearl Harbor', 'Diamond Head', 'North Shore'],
          averageTransitTime: '35 minutes to major attractions',
          guestSatisfaction: '4.2/5 for transit recommendations'
        }
      };
    }

    return NextResponse.json({
      success: true,
      insights,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Concierge insights error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get insights' },
      { status: 500 }
    );
  }
}

async function getTransportationOptions(guestLocation: any, destination: string) {
  try {
    const userLocation = [guestLocation.lon, guestLocation.lat] as [number, number];
    
    // Get comprehensive transportation options
    const options: any = {
      publicTransit: {
        bus: null,
        rail: null,
        combined: null
      },
      alternatives: {
        walking: null,
        rideshare: null,
        bike: null
      },
      accessibility: {
        wheelchairAccessible: true,
        audioAnnouncements: true,
        visualAids: true
      },
      realTime: {
        delays: [],
        serviceAlerts: [],
        crowdLevels: 'moderate'
      }
    };

    // Get bus route
    const busResponse = await fetch('/api/transit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'plan_trip',
        origin: { lat: guestLocation.lat, lon: guestLocation.lon },
        destination: { lat: 21.2793, lon: -157.8293 } // Example destination
      })
    });

    if (busResponse.ok) {
      const busData = await busResponse.json();
      options.publicTransit.bus = busData.tripPlan;
    }

    // Check HART Skyline availability
    const skylinePlan = await hartSkylineService.planMultimodalTrip(
      userLocation,
      [-157.8293, 21.2793], // Example destination
      true
    );

    if (skylinePlan.skylineAvailable) {
      options.publicTransit.rail = skylinePlan;
    }

    // Add cost and sustainability information
    options.costComparison = {
      publicTransit: '$3.00 (free transfers)',
      rideshare: '$15-25 (estimated)',
      rental: '$35-50/day + parking',
      environmental: 'Public transit = 76% less CO2 than driving'
    };

    return NextResponse.json({
      success: true,
      options,
      recommendations: {
        fastest: options.publicTransit.rail ? 'HART Skyline + Bus' : 'Direct Bus',
        mostEconomical: 'Public Transit',
        mostSustainable: 'Public Transit',
        accessibility: 'All public transit options are fully accessible'
      }
    });
  } catch (error) {
    console.error('Transportation options error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get transportation options' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getTransportationInsights(location: any) {
  return {
    nearestStops: [
      { name: 'Ala Moana Center', distance: '0.3 miles', routes: ['8', '19', '20', '42'] },
      { name: 'Waikiki Beach', distance: '0.5 miles', routes: ['8', '19', '23'] }
    ],
    skylineStatus: 'Segment 1 operational, Segment 2 opening late 2025',
    tips: [
      'HOLO card provides free transfers between buses',
      'Download DaBus2 app for real-time arrivals',
      'Peak hours: 7-9 AM, 4-6 PM - allow extra time'
    ]
  };
}

async function getCulturalEvents(timeframe: string) {
  // This would integrate with cultural calendar APIs
  const events = {
    this_week: [
      {
        name: 'First Friday Art Walk',
        date: '2025-08-01',
        location: 'Chinatown',
        transitAccess: 'Routes 1, 2, 3, 9',
        culturalSignificance: 'Monthly celebration of local arts and culture'
      },
      {
        name: 'Hawaiian Music Series',
        date: '2025-08-03',
        location: 'Waikiki Beach',
        transitAccess: 'Routes 8, 19, 20, 23',
        culturalSignificance: 'Traditional and contemporary Hawaiian music'
      }
    ]
  };

  return events[timeframe as keyof typeof events] || [];
}

async function generateActivityInsights(activity: any) {
  return {
    personalizedTips: [
      `Based on your visit to ${activity.destination}, you might enjoy similar ${activity.destination.includes('Beach') ? 'beach' : 'cultural'} experiences`,
      'Consider visiting during off-peak hours for a more peaceful experience'
    ],
    nextRecommendations: [
      'Nearby attractions within 15 minutes',
      'Local food spots popular with visitors'
    ],
    sustainabilityImpact: {
      carbonSaved: activity.transportationUsed === 'public_transit' ? '2.3kg CO2' : '0kg',
      localEconomySupport: 'Your visit supports local community and conservation efforts'
    }
  };
}