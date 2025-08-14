import { NextRequest, NextResponse } from 'next/server';
import { MapboxService } from '@/lib/services/mapbox';

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

    const mapboxService = new MapboxService();
    const bias: [number, number] | undefined = lat && lon ? [parseFloat(lon), parseFloat(lat)] : undefined;
    
    const suggestions = await mapboxService.geocodeAddress(query, bias);

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