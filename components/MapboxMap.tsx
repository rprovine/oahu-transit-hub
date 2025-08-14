"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  route?: any;
  isLive?: boolean;
  currentStepIndex?: number;
  className?: string;
  origin?: string;
  destination?: string;
}

export default function MapboxMap({ 
  center = [-157.8583, 21.3099], // Default to Honolulu
  zoom = 11,
  route,
  isLive = false,
  currentStepIndex = 0,
  className = "w-full h-full rounded-xl",
  origin,
  destination
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null);
  const routeCoordinates = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox token is available
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.warn('Mapbox access token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: '© Oahu Transit Hub'
      }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
      fetchAndDrawRoute();
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const fetchAndDrawRoute = async () => {
    if (!map.current) return;

    try {
      // Get origin and destination coordinates
      const originAddress = origin || route?.from || 'Kapolei, HI';
      const destAddress = destination || route?.to || 'Downtown Honolulu, HI';

      // Geocode addresses to get coordinates
      const [originCoords, destCoords] = await Promise.all([
        geocodeAddress(originAddress),
        geocodeAddress(destAddress)
      ]);

      if (!originCoords || !destCoords) {
        console.error('Could not geocode addresses');
        return;
      }

      // Fetch actual driving route from Mapbox Directions API
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
      
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        routeCoordinates.current = route.geometry.coordinates;

        // Add the route to the map
        if (map.current.getSource('route')) {
          (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          });
        } else {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': isLive ? '#3B82F6' : '#0EA5E9',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        }

        // Add markers for origin and destination
        addMarkers(originCoords, destCoords);

        // Fit map to route bounds
        const bounds = new mapboxgl.LngLatBounds();
        routeCoordinates.current.forEach(coord => bounds.extend(coord as [number, number]));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line if directions API fails
      addFallbackRoute();
    }
  };

  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1&bbox=-158.3,21.2,-157.6,21.7`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center as [number, number];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const addMarkers = (originCoords: [number, number], destCoords: [number, number]) => {
    if (!map.current) return;

    // Origin marker
    const originEl = document.createElement('div');
    originEl.className = 'custom-marker';
    originEl.style.cssText = `
      background-color: #10B981;
      border: 3px solid white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    originEl.innerHTML = '🏠';

    new mapboxgl.Marker(originEl)
      .setLngLat(originCoords)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-sm">Start</h3>
              <p class="text-xs text-gray-600">${origin || route?.from || 'Origin'}</p>
            </div>
          `)
      )
      .addTo(map.current);

    // Destination marker
    const destEl = document.createElement('div');
    destEl.className = 'custom-marker';
    destEl.style.cssText = `
      background-color: #EF4444;
      border: 3px solid white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    destEl.innerHTML = '🎯';

    new mapboxgl.Marker(destEl)
      .setLngLat(destCoords)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-sm">Destination</h3>
              <p class="text-xs text-gray-600">${destination || route?.to || 'Destination'}</p>
            </div>
          `)
      )
      .addTo(map.current);

    // Add bus stop markers if available
    if (route?.stops) {
      route.stops.forEach((stop: any, index: number) => {
        if (stop.type === 'bus_stop' || stop.type === 'transfer') {
          // Estimate position along route
          const progress = (index + 1) / (route.stops.length + 1);
          const routeIndex = Math.floor(progress * routeCoordinates.current.length);
          const coords = routeCoordinates.current[routeIndex] || originCoords;

          const stopEl = document.createElement('div');
          stopEl.className = 'custom-marker';
          stopEl.style.cssText = `
            background-color: #3B82F6;
            border: 2px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          `;
          stopEl.innerHTML = '🚌';

          new mapboxgl.Marker(stopEl)
            .setLngLat(coords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-3">
                    <h3 class="font-semibold text-sm">${stop.name}</h3>
                    <p class="text-xs text-gray-600">${stop.description}</p>
                    <p class="text-xs font-medium text-blue-600">${stop.time}</p>
                  </div>
                `)
            )
            .addTo(map.current);
        }
      });
    }
  };

  const addFallbackRoute = () => {
    if (!map.current || !route) return;

    // Use known Oahu coordinates for common routes
    const routeCoords: { [key: string]: [number, number][] } = {
      'kapolei-kalihi': [
        [-158.0581, 21.3356], // Kapolei
        [-158.0092, 21.3867], // Waipahu
        [-157.9514, 21.3972], // Pearl City
        [-157.9225, 21.3186], // Airport
        [-157.8700, 21.3333]  // Kalihi
      ],
      'kapolei-downtown': [
        [-158.0581, 21.3356], // Kapolei
        [-158.0092, 21.3867], // Waipahu
        [-157.9514, 21.3972], // Pearl City
        [-157.8581, 21.3100]  // Downtown
      ],
      'default': [
        [-158.0072, 21.3156], // Ewa Beach
        [-157.8420, 21.2906]  // Ala Moana
      ]
    };

    let coordinates = routeCoords['default'];
    if (route.from?.includes('Kapolei') && route.to?.includes('Kalihi')) {
      coordinates = routeCoords['kapolei-kalihi'];
    } else if (route.from?.includes('Kapolei') && route.to?.includes('Downtown')) {
      coordinates = routeCoords['kapolei-downtown'];
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FFA500',
        'line-width': 3,
        'line-opacity': 0.7,
        'line-dasharray': [2, 2]
      }
    });

    // Add markers
    addMarkers(coordinates[0], coordinates[coordinates.length - 1]);

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    map.current.fitBounds(bounds, { padding: 50 });
  };

  // Update live position when currentStepIndex changes
  useEffect(() => {
    if (isLive && map.current && routeCoordinates.current.length > 0 && currentStepIndex < routeCoordinates.current.length) {
      const progress = currentStepIndex / Math.max(routeCoordinates.current.length - 1, 1);
      const routeIndex = Math.floor(progress * routeCoordinates.current.length);
      const coords = routeCoordinates.current[routeIndex];

      if (vehicleMarker.current) {
        vehicleMarker.current.setLngLat(coords);
      } else {
        const vehicleEl = document.createElement('div');
        vehicleEl.style.cssText = `
          background: linear-gradient(45deg, #3B82F6, #1D4ED8);
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        `;

        vehicleMarker.current = new mapboxgl.Marker(vehicleEl)
          .setLngLat(coords)
          .addTo(map.current);
      }
    }
  }, [currentStepIndex, isLive]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center border-2 border-dashed border-gray-200`}>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Map</h3>
          <p className="text-sm text-gray-600 mb-4">Mapbox integration ready</p>
          <div className="bg-blue-100 rounded-lg p-3 text-sm text-blue-800">
            Configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable live maps
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Live tracking indicator */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          🔴 Live Tracking
        </div>
      )}
      
      {/* Map controls overlay */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 space-x-2 flex">
        <button 
          onClick={() => map.current?.zoomIn()}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          +
        </button>
        <button 
          onClick={() => map.current?.zoomOut()}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          -
        </button>
        <button 
          onClick={() => {
            if (routeCoordinates.current.length > 0) {
              const bounds = new mapboxgl.LngLatBounds();
              routeCoordinates.current.forEach(coord => bounds.extend(coord));
              map.current?.fitBounds(bounds, { padding: 50 });
            }
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          📍
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}