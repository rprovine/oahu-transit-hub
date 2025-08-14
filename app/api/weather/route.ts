import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/services/weather';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '21.3099'); // Default to Honolulu
    const lon = parseFloat(searchParams.get('lon') || '-157.8583');
    const includeMarine = searchParams.get('marine') === 'true';

    const weatherService = new WeatherService();
    
    const [weather, marine] = await Promise.all([
      weatherService.getCurrentWeather(lat, lon),
      includeMarine ? weatherService.getMarineConditions(lat, lon) : null
    ]);

    return NextResponse.json({
      success: true,
      weather,
      marine,
      location: { lat, lon }
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locations } = body; // Array of {lat, lon, name}
    
    const weatherService = new WeatherService();
    const weatherData = await Promise.all(
      locations.map(async (location: any) => {
        const weather = await weatherService.getCurrentWeather(location.lat, location.lon);
        return {
          ...location,
          weather
        };
      })
    );

    return NextResponse.json({
      success: true,
      locations: weatherData
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}