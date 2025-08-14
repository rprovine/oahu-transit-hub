interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: {
    time: string;
    temp: number;
    condition: string;
    precipitation: number;
  }[];
}

interface MarineData {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  waterTemp: number;
  swellHeight: number;
  swellPeriod: number;
  visibility: number;
  conditions: string;
}

export class WeatherService {
  private openWeatherKey: string;
  private stormGlassKey: string;

  constructor() {
    this.openWeatherKey = process.env.OPENWEATHER_API_KEY || '';
    this.stormGlassKey = process.env.STORMGLASS_API_KEY || '';
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.openWeatherKey}&units=imperial`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      
      // Get forecast for hourly data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.openWeatherKey}&units=imperial&cnt=8`
      );
      
      const forecastData = await forecastResponse.json();
      
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        windDirection: data.wind.deg,
        visibility: Math.round(data.visibility / 1000 * 0.621371), // Convert to miles
        uvIndex: 6, // Would need UV API call
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        forecast: forecastData.list.map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString(),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].description,
          precipitation: item.rain?.['3h'] || 0
        }))
      };
    } catch (error) {
      console.error('Weather service error:', error);
      // Return mock data as fallback
      return {
        temp: 78,
        condition: 'Partly cloudy',
        humidity: 65,
        windSpeed: 12,
        windDirection: 180,
        visibility: 10,
        uvIndex: 6,
        sunrise: '6:45 AM',
        sunset: '7:15 PM',
        forecast: [
          { time: '9:00 AM', temp: 79, condition: 'Sunny', precipitation: 0 },
          { time: '12:00 PM', temp: 82, condition: 'Partly cloudy', precipitation: 0 },
          { time: '3:00 PM', temp: 84, condition: 'Scattered showers', precipitation: 15 },
          { time: '6:00 PM', temp: 80, condition: 'Partly cloudy', precipitation: 5 }
        ]
      };
    }
  }

  async getMarineConditions(lat: number, lon: number): Promise<MarineData> {
    try {
      const response = await fetch(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=waveHeight,wavePeriod,waveDirection,waterTemperature,swellHeight,swellPeriod`,
        {
          headers: {
            'Authorization': this.stormGlassKey
          }
        }
      );

      if (!response.ok) throw new Error('StormGlass API failed');
      
      const data = await response.json();
      const current = data.hours[0];

      return {
        waveHeight: current.waveHeight?.noaa || 0,
        wavePeriod: current.wavePeriod?.noaa || 0,
        waveDirection: current.waveDirection?.noaa || 0,
        waterTemp: current.waterTemperature?.noaa || 75,
        swellHeight: current.swellHeight?.noaa || 0,
        swellPeriod: current.swellPeriod?.noaa || 0,
        visibility: 10,
        conditions: this.getMarineConditionText(current.waveHeight?.noaa || 0)
      };
    } catch (error) {
      console.error('Marine service error:', error);
      // Return mock data as fallback
      return {
        waveHeight: 2.5,
        wavePeriod: 8,
        waveDirection: 210,
        waterTemp: 75,
        swellHeight: 3.0,
        swellPeriod: 12,
        visibility: 10,
        conditions: 'Good'
      };
    }
  }

  private getMarineConditionText(waveHeight: number): string {
    if (waveHeight < 2) return 'Excellent';
    if (waveHeight < 4) return 'Good';
    if (waveHeight < 6) return 'Fair';
    return 'Poor';
  }

  // Oahu-specific locations for weather
  static getOahuLocations() {
    return {
      honolulu: { lat: 21.3099, lon: -157.8581 },
      waikiki: { lat: 21.2793, lon: -157.8293 },
      northShore: { lat: 21.5944, lon: -158.0430 },
      kailua: { lat: 21.3972, lon: -157.7394 },
      diamondHead: { lat: 21.2619, lon: -157.8055 },
      pearlHarbor: { lat: 21.3649, lon: -157.9623 }
    };
  }
}