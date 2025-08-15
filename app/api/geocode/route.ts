import { NextRequest, NextResponse } from 'next/server';
import { MapboxService } from '@/lib/services/mapbox';
import { GooglePlacesService } from '@/lib/services/google-places';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Try Google Places first for better POI recognition
    const googleService = new GooglePlacesService();
    const bias: [number, number] | undefined = lat && lon ? [parseFloat(lon), parseFloat(lat)] : undefined;
    
    let suggestions = await googleService.geocodeAddress(query, bias);
    
    // Fallback to Mapbox if Google doesn't return results
    if (suggestions.length === 0) {
      console.log('Google Places returned no results, trying Mapbox...');
      const mapboxService = new MapboxService();
      suggestions = await mapboxService.geocodeAddress(query, bias);
    }

    return NextResponse.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to geocode address' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, profile = 'walking' } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { success: false, error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    console.log('🚶 Geocode API received coordinates:', {
      origin: origin,
      destination: destination,
      originArray: [origin.lon, origin.lat],
      destArray: [destination.lon, destination.lat]
    });
    
    const mapboxService = new MapboxService();
    
    // Get directions for different travel modes
    const [walkingRoutes, cyclingRoutes, transitRoutes] = await Promise.all([
      mapboxService.getDirections({
        origin: [origin.lon, origin.lat],
        destination: [destination.lon, destination.lat],
        profile: 'walking'
      }),
      mapboxService.getDirections({
        origin: [origin.lon, origin.lat],
        destination: [destination.lon, destination.lat],
        profile: 'cycling'
      }),
      mapboxService.getTransitDirections([origin.lon, origin.lat], [destination.lon, destination.lat])
    ]);

    return NextResponse.json({
      success: true,
      routes: {
        walking: walkingRoutes,
        cycling: cyclingRoutes,
        transit: transitRoutes
      }
    });
  } catch (error) {
    console.error('Directions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get directions' },
      { status: 500 }
    );
  }
}