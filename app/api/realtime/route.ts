import { NextRequest, NextResponse } from 'next/server';
import { RealtimeTransitService } from '@/lib/services/realtime-transit';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stopId = searchParams.get('stopId');
    const routeId = searchParams.get('route');
    const action = searchParams.get('action');

    const realtimeService = new RealtimeTransitService();

    // Get vehicle positions for a route
    if (action === 'vehicles' && routeId) {
      const vehicles = await realtimeService.getVehiclePositions(routeId);
      return NextResponse.json({
        success: true,
        vehicles,
        timestamp: Date.now()
      });
    }

    // Get arrivals for a stop
    if (stopId) {
      const arrivals = await realtimeService.getStopArrivals(stopId);
      
      // Filter by route if specified
      const filteredArrivals = routeId 
        ? arrivals.filter(a => a.routeId === routeId)
        : arrivals;

      return NextResponse.json({
        success: true,
        arrivals: filteredArrivals,
        timestamp: Date.now()
      });
    }

    // Get service alerts
    if (action === 'alerts') {
      const alerts = await realtimeService.getServiceAlerts(routeId || undefined);
      return NextResponse.json({
        success: true,
        alerts,
        timestamp: Date.now()
      });
    }

    // Get all real-time data for a route
    if (routeId && !stopId) {
      const [vehicles, alerts] = await Promise.all([
        realtimeService.getVehiclePositions(routeId),
        realtimeService.getServiceAlerts(routeId || undefined)
      ]);

      return NextResponse.json({
        success: true,
        vehicles,
        alerts,
        timestamp: Date.now()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Please provide a stopId or routeId parameter'
    }, { status: 400 });

  } catch (error) {
    console.error('Realtime API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripPlan } = body;

    if (!tripPlan) {
      return NextResponse.json({
        success: false,
        error: 'Trip plan required'
      }, { status: 400 });
    }

    const realtimeService = new RealtimeTransitService();
    const realtimeData = await realtimeService.getTripRealtimeData(tripPlan);

    return NextResponse.json({
      success: true,
      realtimeData,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Realtime API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time data'
    }, { status: 500 });
  }
}