#!/bin/bash

# Create app/globals.css
cat > app/globals.css << 'EOF'
@import "tailwindcss";

@theme {
  --color-ocean-50: #e6f7ff;
  --color-ocean-100: #bae7ff;
  --color-ocean-200: #91d5ff;
  --color-ocean-300: #69c0ff;
  --color-ocean-400: #40a9ff;
  --color-ocean-500: #1890ff;
  --color-ocean-600: #096dd9;
  --color-ocean-700: #0050b3;
  --color-ocean-800: #003a8c;
  --color-ocean-900: #002766;

  --color-tropical-50: #f0fdf4;
  --color-tropical-100: #dcfce7;
  --color-tropical-200: #bbf7d0;
  --color-tropical-300: #86efac;
  --color-tropical-400: #4ade80;
  --color-tropical-500: #22c55e;
  --color-tropical-600: #16a34a;
  --color-tropical-700: #15803d;
  --color-tropical-800: #166534;
  --color-tropical-900: #14532d;

  --color-sunset-50: #fef2f2;
  --color-sunset-100: #fee2e2;
  --color-sunset-200: #fecaca;
  --color-sunset-300: #fca5a5;
  --color-sunset-400: #f87171;
  --color-sunset-500: #ef4444;
  --color-sunset-600: #dc2626;
  --color-sunset-700: #b91c1c;
  --color-sunset-800: #991b1b;
  --color-sunset-900: #7f1d1d;

  --color-volcanic-50: #fafafa;
  --color-volcanic-100: #f4f4f5;
  --color-volcanic-200: #e4e4e7;
  --color-volcanic-300: #d4d4d8;
  --color-volcanic-400: #a1a1aa;
  --color-volcanic-500: #71717a;
  --color-volcanic-600: #52525b;
  --color-volcanic-700: #3f3f46;
  --color-volcanic-800: #27272a;
  --color-volcanic-900: #18181b;
  --color-volcanic-950: #09090b;
}

@keyframes sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.animate-sway {
  animation: sway 3s ease-in-out infinite;
}

.text-hawaiian {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  letter-spacing: 0.01em;
}
EOF

echo "✅ Created app/globals.css"

# Create lib/utils.ts
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

echo "✅ Created lib/utils.ts"

# Create types/index.ts
cat > types/index.ts << 'EOF'
export interface User {
  id: string;
  email: string;
  fullName?: string;
  userType: 'local' | 'tourist';
  subscriptionTier: 'free' | 'premium';
}

export interface Route {
  id: string;
  name: string;
  type: 'bus' | 'rail' | 'mixed';
  duration: number;
  distance: number;
  steps: RouteStep[];
  weatherImpact?: string;
  fare?: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  mode: 'walk' | 'bus' | 'rail';
  transitLine?: string;
  stopName?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
}

export interface TransitStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
  type: 'bus' | 'rail';
}

export interface TripPlan {
  id: string;
  userId: string;
  origin: Location;
  destination: Location;
  departureTime: Date;
  routes: Route[];
  preferences: TripPreferences;
}

export interface TripPreferences {
  mode?: 'bus' | 'rail' | 'mixed';
  maxWalkDistance?: number;
  avoidRain?: boolean;
  accessibility?: boolean;
}
EOF

echo "✅ Created types/index.ts"

echo ""
echo "📦 Essential files created!"
echo ""
echo "Project structure ready. Run 'npm run dev' to start the development server."