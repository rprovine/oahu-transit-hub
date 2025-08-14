// API endpoint to update GTFS data from TheBus
import { NextRequest, NextResponse } from 'next/server';
import { gtfsMemoryProcessor } from '@/lib/services/gtfs-memory-processor';

export async function GET(request: NextRequest) {
  try {
    // Check if data exists
    if (gtfsMemoryProcessor.hasData()) {
      const summary = gtfsMemoryProcessor.getSummary();
      return NextResponse.json({
        success: true,
        message: 'GTFS data already loaded',
        summary,
        needsUpdate: false
      });
    }

    // Download and process GTFS data
    await gtfsMemoryProcessor.downloadAndProcessGTFS();
    
    // Get summary
    const summary = gtfsMemoryProcessor.getSummary();
    
    return NextResponse.json({
      success: true,
      message: 'GTFS data loaded successfully',
      summary
    });
  } catch (error) {
    console.error('GTFS update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load GTFS data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Force update GTFS data
    await gtfsMemoryProcessor.downloadAndProcessGTFS();
    
    // Get summary
    const summary = gtfsMemoryProcessor.getSummary();
    
    return NextResponse.json({
      success: true,
      message: 'GTFS data force updated successfully',
      summary
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