import { NextRequest, NextResponse } from 'next/server';
import { GTFSService } from '@/lib/services/gtfs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const stopId = searchParams.get('stopId');
    const radius = searchParams.get('radius');

    const gtfsService = new GTFSService();

    switch (action) {
      case 'routes':
        const routes = await gtfsService.getRoutes();
        return NextResponse.json({
          success: true,
          routes
        });

      case 'nearby_stops':
        if (!lat || !lon) {
          return NextResponse.json(
            { success: false, error: 'Latitude and longitude are required' },
            { status: 400 }
          );
        }

        const stops = await gtfsService.getNearbyStops(
          parseFloat(lat),
          parseFloat(lon),
          radius ? parseInt(radius) : 500
        );

        return NextResponse.json({
          success: true,
          stops
        });

      case 'arrivals':
        if (!stopId) {
          return NextResponse.json(
            { success: false, error: 'Stop ID is required' },
            { status: 400 }
          );
        }

        const arrivals = await gtfsService.getStopArrivals(stopId);
        return NextResponse.json({
          success: true,
          arrivals
        });

      case 'alerts':
        const alerts = await gtfsService.getServiceAlerts();
        return NextResponse.json({
          success: true,
          alerts
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Transit API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transit data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, origin, destination, time } = body;
    
    console.log('🚀 Transit API called at:', new Date().toISOString());

    if (action !== 'plan_trip') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!origin || !destination) {
      return NextResponse.json(
        { success: false, error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    // Debug logging to understand what's being received
    console.log('🔍 Transit API received:', {
      origin: origin,
      destination: destination,
      originType: typeof origin,
      destinationType: typeof destination,
      hasLatLon: origin?.lat !== undefined && origin?.lon !== undefined
    });

    // Handle string addresses (geocode them first)
    let originCoords, destCoords;
    
    if (typeof origin === 'string') {
      // Use hardcoded coordinates for known addresses
      const knownCoords: Record<string, [number, number]> = {
        '91-1020 palala street': [-158.086, 21.3285],
        '845 gulick avenue': [-157.914, 21.336],
      };
      
      const originLower = origin.toLowerCase();
      let found = false;
      for (const [pattern, coords] of Object.entries(knownCoords)) {
        if (originLower.includes(pattern)) {
          console.log('📍 Using known origin coordinates for:', pattern);
          originCoords = coords;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Try geocoding with Mapbox
        console.log('📍 Geocoding origin string:', origin);
        try {
          const mapboxService = new (await import('@/lib/services/mapbox')).MapboxService();
          const suggestions = await mapboxService.geocodeAddress(origin);
          if (suggestions?.[0]?.center) {
            originCoords = suggestions[0].center;
          } else {
            return NextResponse.json(
              { success: false, error: 'Failed to geocode origin address' },
              { status: 400 }
            );
          }
        } catch (error) {
          console.error('Geocoding failed:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to geocode origin address' },
            { status: 400 }
          );
        }
      }
    } else if (origin?.lat !== undefined && origin?.lon !== undefined) {
      originCoords = [origin.lon, origin.lat];
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid origin format' },
        { status: 400 }
      );
    }

    if (typeof destination === 'string') {
      // Use hardcoded coordinates for known addresses
      const knownCoords: Record<string, [number, number]> = {
        '91-1020 palala street': [-158.086, 21.3285],
        '845 gulick avenue': [-157.914, 21.336],
      };
      
      const destLower = destination.toLowerCase();
      let found = false;
      for (const [pattern, coords] of Object.entries(knownCoords)) {
        if (destLower.includes(pattern)) {
          console.log('📍 Using known destination coordinates for:', pattern);
          destCoords = coords;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Try geocoding with Mapbox
        console.log('📍 Geocoding destination string:', destination);
        try {
          const mapboxService = new (await import('@/lib/services/mapbox')).MapboxService();
          const suggestions = await mapboxService.geocodeAddress(destination);
          if (suggestions?.[0]?.center) {
            destCoords = suggestions[0].center;
          } else {
            return NextResponse.json(
              { success: false, error: 'Failed to geocode destination address' },
              { status: 400 }
            );
          }
        } catch (error) {
          console.error('Geocoding failed:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to geocode destination address' },
            { status: 400 }
          );
        }
      }
    } else if (destination?.lat !== undefined && destination?.lon !== undefined) {
      destCoords = [destination.lon, destination.lat];
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid destination format' },
        { status: 400 }
      );
    }

    console.log('🗺️ Using coordinates:', {
      origin: originCoords,
      destination: destCoords
    });

    const gtfsService = new GTFSService();
    const tripPlan = await gtfsService.planTrip(
      originCoords,
      destCoords,
      time
    );

    return NextResponse.json({
      success: true,
      tripPlan
    });
  } catch (error) {
    console.error('Transit planning API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to plan trip' },
      { status: 500 }
    );
  }
}