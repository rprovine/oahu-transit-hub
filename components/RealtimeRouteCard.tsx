"use client";

import { useEffect, useState } from 'react';
import { Bus, Clock, Users, AlertTriangle, MapPin, Activity } from 'lucide-react';

interface RealtimeData {
  arrivalTime?: Date;
  delay?: number;
  vehicleId?: string;
  occupancy?: 'EMPTY' | 'MANY_SEATS' | 'FEW_SEATS' | 'STANDING_ROOM' | 'CRUSHED' | 'FULL';
  lastUpdate?: Date;
}

interface RealtimeRouteCardProps {
  route: string;
  stopId?: string;
  destination: string;
  scheduledTime?: string;
  className?: string;
}

export default function RealtimeRouteCard({ 
  route, 
  stopId, 
  destination, 
  scheduledTime,
  className = "" 
}: RealtimeRouteCardProps) {
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stopId) {
      setIsLoading(false);
      return;
    }

    const fetchRealtimeData = async () => {
      try {
        const response = await fetch(`/api/realtime?stopId=${stopId}&route=${route}`);
        if (!response.ok) throw new Error('Failed to fetch realtime data');
        
        const data = await response.json();
        if (data.success && data.arrivals?.length > 0) {
          const arrival = data.arrivals[0];
          setRealtimeData({
            arrivalTime: new Date(arrival.arrivalTime),
            delay: arrival.delay,
            vehicleId: arrival.vehicleId,
            occupancy: arrival.occupancyStatus,
            lastUpdate: new Date()
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching realtime data:', err);
        setError('Unable to load live data');
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchRealtimeData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchRealtimeData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [stopId, route]);

  const getOccupancyIcon = (occupancy?: string) => {
    switch (occupancy) {
      case 'EMPTY':
      case 'MANY_SEATS':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'FEW_SEATS':
        return <Users className="w-4 h-4 text-yellow-600" />;
      case 'STANDING_ROOM':
      case 'CRUSHED':
      case 'FULL':
        return <Users className="w-4 h-4 text-red-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOccupancyText = (occupancy?: string) => {
    switch (occupancy) {
      case 'EMPTY': return 'Empty';
      case 'MANY_SEATS': return 'Many seats';
      case 'FEW_SEATS': return 'Few seats';
      case 'STANDING_ROOM': return 'Standing room';
      case 'CRUSHED': return 'Very crowded';
      case 'FULL': return 'Full';
      default: return 'Unknown';
    }
  };

  const formatArrivalTime = (arrivalTime?: Date, delay?: number) => {
    if (!arrivalTime) return scheduledTime || 'N/A';
    
    const now = new Date();
    const minutesUntil = Math.round((arrivalTime.getTime() - now.getTime()) / 60000);
    
    if (minutesUntil <= 0) return 'Now';
    if (minutesUntil === 1) return '1 min';
    if (minutesUntil < 60) return `${minutesUntil} min`;
    
    return arrivalTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const getDelayStatus = (delay?: number) => {
    if (!delay) return null;
    const delayMinutes = Math.round(delay / 60);
    
    if (delayMinutes > 0) {
      return (
        <span className="text-red-600 text-xs font-medium">
          +{delayMinutes} min late
        </span>
      );
    } else if (delayMinutes < 0) {
      return (
        <span className="text-green-600 text-xs font-medium">
          {Math.abs(delayMinutes)} min early
        </span>
      );
    }
    return <span className="text-green-600 text-xs font-medium">On time</span>;
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              <Bus className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-lg">Route {route}</span>
            </div>
            {realtimeData && (
              <span title="Live tracking">
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="w-3 h-3" />
            <span>To {destination}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-base">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  formatArrivalTime(realtimeData?.arrivalTime, realtimeData?.delay)
                )}
              </span>
            </div>

            {realtimeData?.delay !== undefined && getDelayStatus(realtimeData.delay)}
          </div>

          {realtimeData?.occupancy && (
            <div className="flex items-center gap-2 mt-2">
              {getOccupancyIcon(realtimeData.occupancy)}
              <span className="text-sm text-gray-600">
                {getOccupancyText(realtimeData.occupancy)}
              </span>
            </div>
          )}

          {realtimeData?.vehicleId && (
            <div className="text-xs text-gray-500 mt-1">
              Bus #{realtimeData.vehicleId}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}

          {realtimeData?.lastUpdate && (
            <div className="text-xs text-gray-400 mt-2">
              Last updated: {realtimeData.lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}