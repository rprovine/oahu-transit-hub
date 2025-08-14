"use client";

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface VehiclePosition {
  vehicleId: string;
  routeId: string;
  lat: number;
  lon: number;
  bearing?: number;
  occupancyStatus?: string;
  timestamp: number;
}

interface RealtimeMapLayerProps {
  map: mapboxgl.Map | null;
  routeIds: string[];
  showVehicles?: boolean;
  showStops?: boolean;
  updateInterval?: number;
}

export default function RealtimeMapLayer({
  map,
  routeIds,
  showVehicles = true,
  showStops = true,
  updateInterval = 30000 // 30 seconds
}: RealtimeMapLayerProps) {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const vehicleMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const updateTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!map || routeIds.length === 0) return;

    const fetchVehiclePositions = async () => {
      try {
        const promises = routeIds.map(routeId =>
          fetch(`/api/realtime?action=vehicles&route=${routeId}`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);
        const allVehicles: VehiclePosition[] = [];

        results.forEach(result => {
          if (result.success && result.vehicles) {
            allVehicles.push(...result.vehicles);
          }
        });

        setVehicles(allVehicles);
        updateVehicleMarkers(allVehicles);
      } catch (error) {
        console.error('Error fetching vehicle positions:', error);
      }
    };

    const updateVehicleMarkers = (vehicleData: VehiclePosition[]) => {
      if (!map) return;

      // Remove markers for vehicles no longer in data
      const currentVehicleIds = new Set(vehicleData.map(v => v.vehicleId));
      vehicleMarkers.current.forEach((marker, vehicleId) => {
        if (!currentVehicleIds.has(vehicleId)) {
          marker.remove();
          vehicleMarkers.current.delete(vehicleId);
        }
      });

      // Add or update markers for current vehicles
      vehicleData.forEach(vehicle => {
        const existingMarker = vehicleMarkers.current.get(vehicle.vehicleId);

        if (existingMarker) {
          // Update existing marker position with animation
          existingMarker.setLngLat([vehicle.lon, vehicle.lat]);
        } else {
          // Create new marker
          const el = createVehicleElement(vehicle);
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat([vehicle.lon, vehicle.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(createVehiclePopupHTML(vehicle))
            )
            .addTo(map);

          vehicleMarkers.current.set(vehicle.vehicleId, marker);
        }
      });
    };

    const createVehicleElement = (vehicle: VehiclePosition) => {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.cssText = `
        position: relative;
        width: 30px;
        height: 30px;
      `;

      // Create bus icon with rotation
      const busIcon = document.createElement('div');
      busIcon.style.cssText = `
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
        border: 2px solid white;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transform: rotate(${vehicle.bearing || 0}deg);
        transition: transform 0.3s ease;
      `;
      busIcon.innerHTML = '🚌';

      // Add occupancy indicator
      const occupancyDot = document.createElement('div');
      const occupancyColor = getOccupancyColor(vehicle.occupancyStatus);
      occupancyDot.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        width: 12px;
        height: 12px;
        background-color: ${occupancyColor};
        border: 2px solid white;
        border-radius: 50%;
        animation: pulse 2s infinite;
      `;

      el.appendChild(busIcon);
      el.appendChild(occupancyDot);

      // Add pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `;
      if (!document.head.querySelector('style[data-realtime-map]')) {
        style.setAttribute('data-realtime-map', 'true');
        document.head.appendChild(style);
      }

      return el;
    };

    const createVehiclePopupHTML = (vehicle: VehiclePosition) => {
      const occupancyText = getOccupancyText(vehicle.occupancyStatus);
      const lastUpdate = new Date(vehicle.timestamp).toLocaleTimeString();

      return `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            Route ${vehicle.routeId} - Bus #${vehicle.vehicleId}
          </h3>
          <div style="font-size: 12px; color: #666;">
            <div style="margin-bottom: 4px;">
              <strong>Occupancy:</strong> ${occupancyText}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Last Update:</strong> ${lastUpdate}
            </div>
            ${vehicle.bearing ? `
              <div>
                <strong>Heading:</strong> ${getHeadingText(vehicle.bearing)}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    };

    const getOccupancyColor = (occupancy?: string) => {
      switch (occupancy) {
        case 'EMPTY':
        case 'MANY_SEATS':
          return '#10B981'; // green
        case 'FEW_SEATS':
          return '#F59E0B'; // yellow
        case 'STANDING_ROOM':
        case 'CRUSHED':
        case 'FULL':
          return '#EF4444'; // red
        default:
          return '#6B7280'; // gray
      }
    };

    const getOccupancyText = (occupancy?: string) => {
      switch (occupancy) {
        case 'EMPTY': return 'Empty';
        case 'MANY_SEATS': return 'Many seats available';
        case 'FEW_SEATS': return 'Few seats available';
        case 'STANDING_ROOM': return 'Standing room only';
        case 'CRUSHED': return 'Very crowded';
        case 'FULL': return 'Full';
        default: return 'Unknown';
      }
    };

    const getHeadingText = (bearing: number) => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const index = Math.round(bearing / 45) % 8;
      return directions[index];
    };

    // Initial fetch
    fetchVehiclePositions();

    // Set up polling
    updateTimerRef.current = setInterval(fetchVehiclePositions, updateInterval);

    return () => {
      // Cleanup
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
      vehicleMarkers.current.forEach(marker => marker.remove());
      vehicleMarkers.current.clear();
    };
  }, [map, routeIds, updateInterval]);

  return null; // This component doesn't render anything directly
}