interface PlaceResult {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

interface LocationSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties: {
    category?: string;
    landmark?: boolean;
    address?: string;
  };
}

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyAqVgpfDBt3cCgUCk4Al-BZHoOPHm62pVU';
  }

  async geocodeAddress(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // First try Places Text Search for better POI results
      const textSearchResults = await this.textSearch(query, bias);
      if (textSearchResults.length > 0) {
        return textSearchResults;
      }

      // Fallback to Geocoding API
      return await this.geocode(query, bias);
    } catch (error) {
      console.error('Google Places geocoding error:', error);
      return [];
    }
  }

  private async textSearch(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // Add Hawaii/Oahu context if not present
      let searchQuery = query;
      if (!query.toLowerCase().includes('hawaii') && 
          !query.toLowerCase().includes('honolulu') && 
          !query.toLowerCase().includes('oahu')) {
        searchQuery = `${query} Oahu Hawaii`;
      }

      const params = new URLSearchParams({
        query: searchQuery,
        key: this.apiKey,
        region: 'us',
        language: 'en'
      });

      // Add location bias for Oahu
      if (bias) {
        params.append('location', `${bias[1]},${bias[0]}`);
        params.append('radius', '50000'); // 50km radius
      } else {
        // Default to Honolulu center
        params.append('location', '21.3099,-157.8583');
        params.append('radius', '50000');
      }

      const url = `${this.baseUrl}/place/textsearch/json?${params}`;
      console.log('Google Places Text Search:', searchQuery);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API error:', data.status, data.error_message);
        return [];
      }

      return (data.results || []).slice(0, 8).map((place: PlaceResult) => ({
        id: place.place_id,
        text: place.name,
        place_name: place.formatted_address,
        center: [place.geometry.location.lng, place.geometry.location.lat] as [number, number],
        properties: {
          category: place.types?.[0],
          landmark: place.types?.includes('point_of_interest')
        }
      }));
    } catch (error) {
      console.error('Text search error:', error);
      return [];
    }
  }

  private async geocode(query: string, bias?: [number, number]): Promise<LocationSuggestion[]> {
    try {
      // Add Hawaii context if not present
      let searchAddress = query;
      if (!query.toLowerCase().includes('hawaii') && 
          !query.toLowerCase().includes('hi')) {
        searchAddress = `${query}, Hawaii`;
      }

      const params = new URLSearchParams({
        address: searchAddress,
        key: this.apiKey,
        region: 'us',
        language: 'en'
      });

      // Bounds for Oahu
      params.append('bounds', '21.2044,-158.2878|21.7135,-157.6417');

      const url = `${this.baseUrl}/geocode/json?${params}`;
      console.log('Google Geocoding API:', searchAddress);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Geocoding API error:', data.status, data.error_message);
        return [];
      }

      return (data.results || []).slice(0, 8).map((place: any) => ({
        id: place.place_id,
        text: place.address_components?.[0]?.long_name || place.formatted_address.split(',')[0],
        place_name: place.formatted_address,
        center: [place.geometry.location.lng, place.geometry.location.lat] as [number, number],
        properties: {
          category: place.types?.[0],
          landmark: place.types?.includes('point_of_interest')
        }
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'name,formatted_address,geometry,types'
      });

      const url = `${this.baseUrl}/place/details/json?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Place details error:', data.status);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  // Get autocomplete suggestions for address input
  async getAutocompleteSuggestions(input: string, sessionToken?: string): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        input,
        key: this.apiKey,
        types: 'geocode|establishment',
        components: 'country:us',
        language: 'en'
      });

      // Restrict to Oahu area
      params.append('location', '21.3099,-157.8583');
      params.append('radius', '50000');
      
      if (sessionToken) {
        params.append('sessiontoken', sessionToken);
      }

      const url = `${this.baseUrl}/place/autocomplete/json?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Autocomplete error:', data.status);
        return [];
      }

      return (data.predictions || []).map((pred: any) => pred.description);
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }
}