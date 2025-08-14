"use client";

import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SystemStatus {
  theBusApi: boolean;
  gtfsRealtime: boolean;
  mapboxApi: boolean;
  lastUpdate: Date;
  activeVehicles: number;
  serviceAlerts: number;
}

export default function RealtimeStatusBar() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Check various API endpoints
        const [vehiclesRes, alertsRes] = await Promise.all([
          fetch('/api/realtime?action=vehicles&route=C').then(r => r.json()),
          fetch('/api/realtime?action=alerts').then(r => r.json())
        ]);

        setStatus({
          theBusApi: vehiclesRes.success || false,
          gtfsRealtime: vehiclesRes.success || false,
          mapboxApi: true, // Assume working if page loads
          lastUpdate: new Date(),
          activeVehicles: vehiclesRes.vehicles?.length || 0,
          serviceAlerts: alertsRes.alerts?.length || 0
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking system status:', error);
        setStatus({
          theBusApi: false,
          gtfsRealtime: false,
          mapboxApi: true,
          lastUpdate: new Date(),
          activeVehicles: 0,
          serviceAlerts: 0
        });
        setIsLoading(false);
      }
    };

    // Initial check
    checkSystemStatus();

    // Check every 60 seconds
    const interval = setInterval(checkSystemStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 z-50">
        <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
        <span className="text-sm text-gray-600">Connecting to live data...</span>
      </div>
    );
  }

  if (!status) return null;

  const allSystemsOperational = status.theBusApi && status.gtfsRealtime && status.mapboxApi;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50 max-w-sm">
      <div className="flex items-center gap-3 mb-2">
        <Activity className={`w-5 h-5 ${allSystemsOperational ? 'text-green-500' : 'text-amber-500'} animate-pulse`} />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800">
            Real-Time Transit Status
          </h3>
          <p className="text-xs text-gray-500">
            Last updated: {status.lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">TheBus API</span>
          <div className="flex items-center gap-1">
            {status.theBusApi ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>


        {status.serviceAlerts > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Service Alerts</span>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-amber-600 font-medium">{status.serviceAlerts}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${allSystemsOperational ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
          <span className="text-xs text-gray-600">
            {allSystemsOperational ? 'All systems operational' : 'Limited real-time data'}
          </span>
        </div>
      </div>
    </div>
  );
}