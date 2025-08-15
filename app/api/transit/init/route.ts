import { NextRequest, NextResponse } from 'next/server';
import { gtfsMemoryProcessor } from '@/lib/services/gtfs-memory-processor';

export const maxDuration = 60; // Maximum allowed duration in seconds for Vercel Pro

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GTFS initialization requested');
    
    // Check if data is already loaded
    if (gtfsMemoryProcessor.hasData()) {
      const summary = gtfsMemoryProcessor.getSummary();
      return NextResponse.json({
        success: true,
        message: 'GTFS data already loaded',
        summary
      });
    }
    
    // Download and process GTFS data
    console.log('📥 Starting GTFS download...');
    const startTime = Date.now();
    
    await gtfsMemoryProcessor.downloadAndProcessGTFS();
    
    const duration = Date.now() - startTime;
    const summary = gtfsMemoryProcessor.getSummary();
    
    console.log(`✅ GTFS initialization complete in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      message: 'GTFS data loaded successfully',
      duration,
      summary
    });
  } catch (error) {
    console.error('GTFS initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize GTFS data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}