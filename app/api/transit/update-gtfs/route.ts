// API endpoint to update GTFS data from TheBus
import { NextRequest, NextResponse } from 'next/server';
import { gtfsProcessor } from '@/lib/services/gtfs-processor';

export async function GET(request: NextRequest) {
  try {
    // Check if data exists
    if (gtfsProcessor.hasData()) {
      const lastUpdate = gtfsProcessor.getLastUpdateTime();
      return NextResponse.json({
        success: true,
        message: 'GTFS data already exists',
        lastUpdate: lastUpdate?.toISOString(),
        needsUpdate: false
      });
    }

    // Download and process GTFS data
    await gtfsProcessor.downloadAndExtractGTFS();
    await gtfsProcessor.loadAllData();
    
    // Get summary
    const stops = gtfsProcessor.getStops();
    const routes = gtfsProcessor.getRoutes();
    
    return NextResponse.json({
      success: true,
      message: 'GTFS data updated successfully',
      summary: {
        stops: stops.length,
        routes: routes.length,
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GTFS update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update GTFS data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Force update GTFS data
    await gtfsProcessor.downloadAndExtractGTFS();
    await gtfsProcessor.loadAllData();
    
    // Get summary
    const stops = gtfsProcessor.getStops();
    const routes = gtfsProcessor.getRoutes();
    
    return NextResponse.json({
      success: true,
      message: 'GTFS data force updated successfully',
      summary: {
        stops: stops.length,
        routes: routes.length,
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GTFS force update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to force update GTFS data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}