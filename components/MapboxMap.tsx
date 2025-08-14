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
}

export default function MapboxMap({ 
  center = [-157.8583, 21.3099], // Default to Honolulu
  zoom = 11,
  route,
  isLive = false,
  currentStepIndex = 0,
  className = "w-full h-full rounded-xl"
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null);

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
      addRouteLayer();
      addStopMarkers();
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const addRouteLayer = () => {
    if (!map.current || !route?.stops) return;

    // Create a simple route line between stops
    const coordinates = route.stops.map((stop: any, index: number) => {
      // Generate realistic coordinates for Oahu locations
      const baseCoords = [-157.8583, 21.3099]; // Honolulu center
      return [
        baseCoords[0] + (Math.random() - 0.5) * 0.1, 
        baseCoords[1] + (Math.random() - 0.5) * 0.05
      ];
    });

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
        'line-color': isLive ? '#3B82F6' : '#0EA5E9',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Fit map to route
    if (coordinates.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord: any) => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const addStopMarkers = () => {
    if (!map.current || !route?.stops) return;

    route.stops.forEach((stop: any, index: number) => {
      // Generate realistic coordinates for each stop
      const baseCoords = [-157.8583, 21.3099];
      const coords: [number, number] = [
        baseCoords[0] + (Math.random() - 0.5) * 0.1,
        baseCoords[1] + (Math.random() - 0.5) * 0.05
      ];

      const getStopIcon = () => {
        switch (stop.type) {
          case 'walk': return '🚶';
          case 'bus_stop': return '🚌';
          case 'transfer': return '🔄';
          case 'destination': return '🎯';
          default: return '📍';
        }
      };

      const getStopColor = () => {
        if (isLive) {
          switch (stop.status) {
            case 'completed': return '#10B981';
            case 'current': return '#3B82F6';
            case 'upcoming': return '#6B7280';
            default: return '#6B7280';
          }
        }
        return index === 0 ? '#3B82F6' : '#6B7280';
      };

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background-color: ${getStopColor()};
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
        transition: all 0.3s ease;
      `;
      el.innerHTML = getStopIcon();

      // Add hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-sm">${stop.name}</h3>
                <p class="text-xs text-gray-600">${stop.description}</p>
                <p class="text-xs font-medium text-blue-600">${stop.time}</p>
                ${stop.routeInfo ? `<p class="text-xs text-green-600">${stop.routeInfo}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current!);

      // Store current position marker for live tracking
      if (isLive && index === currentStepIndex) {
        if (vehicleMarker.current) {
          vehicleMarker.current.remove();
        }
        
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
          .addTo(map.current!);
      }
    });
  };

  // Update live position when currentStepIndex changes
  useEffect(() => {
    if (isLive && map.current && route?.stops && currentStepIndex < route.stops.length) {
      const stop = route.stops[currentStepIndex];
      const baseCoords = [-157.8583, 21.3099];
      const coords: [number, number] = [
        baseCoords[0] + (Math.random() - 0.5) * 0.1,
        baseCoords[1] + (Math.random() - 0.5) * 0.05
      ];

      if (vehicleMarker.current) {
        vehicleMarker.current.setLngLat(coords);
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
            if (route?.stops && route.stops.length > 1) {
              const coordinates = route.stops.map(() => {
                const baseCoords = [-157.8583, 21.3099];
                return [
                  baseCoords[0] + (Math.random() - 0.5) * 0.1,
                  baseCoords[1] + (Math.random() - 0.5) * 0.05
                ] as [number, number];
              });
              const bounds = new mapboxgl.LngLatBounds();
              coordinates.forEach((coord: any) => bounds.extend(coord));
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