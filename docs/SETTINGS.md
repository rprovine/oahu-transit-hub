# ⚙️ User Settings - Documentation

## Overview

The Oahu Transit Hub provides comprehensive user settings management, allowing users to personalize their transit experience with saved locations, notification preferences, and travel settings.

## Settings Page

**Location**: `/app/settings/page.tsx`
**Route**: `/settings`

### Features

- **📍 Saved Locations**: Home, work, and favorite addresses
- **🔔 Notification Preferences**: Route alerts, weather, and service disruptions
- **🚶 Travel Preferences**: Default route types and accessibility options
- **💾 Data Persistence**: Local storage with optional cloud sync

## Saved Locations

### Location Types

#### 🏠 Home
- Primary residence address
- Quick access for "Go Home" routes
- Used for commute planning

#### 🏢 Work  
- Primary workplace address
- Quick access for work commutes
- Used for scheduling notifications

#### ⭐ Favorites
- Frequently visited locations
- Custom names and descriptions
- Quick destination selection

### Location Management

#### Adding Locations
```typescript
interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'favorite';
}
```

#### Address Autocomplete
- **Primary**: Mapbox Geocoding API
- **Fallback**: Local Oahu location database
- **Validation**: Real-time address verification

#### Example Usage:
1. Select location type (Home/Work/Favorite)
2. Enter custom name
3. Type address with autocomplete suggestions
4. Save to local storage and cloud (if authenticated)

## Notification Preferences

### Notification Types

#### 🚌 Route Alerts
- Real-time delay notifications
- Route changes and diversions
- Service restoration updates
- **Default**: Enabled

#### 🌦️ Weather Alerts
- Weather-related transit advisories
- Storm and high wind warnings
- Beach condition updates for coastal routes
- **Default**: Enabled

#### ⚠️ Service Disruptions
- Major system outages
- Emergency service changes
- Planned maintenance notifications
- **Default**: Enabled

#### 📧 Email Updates
- Weekly transit summary
- New feature announcements
- Service improvement updates
- **Default**: Disabled

### Implementation
```typescript
interface NotificationSettings {
  routeAlerts: boolean;
  weatherAlerts: boolean;
  serviceDisruptions: boolean;
  emailUpdates: boolean;
}
```

## Travel Preferences

### Default Route Type

#### ⚡ Fastest Route
- Prioritizes travel time
- Optimizes for minimal delays
- Considers real-time traffic

#### 💰 Cheapest Route
- Minimizes transportation costs
- Prefers free options (walking)
- Considers transfer costs

#### 🌱 Most Eco-Friendly
- Maximizes environmental benefits
- Prioritizes public transit over driving
- Calculates CO₂ savings

### Walking Distance

- **Range**: 0.1 - 2.0 miles
- **Default**: 0.5 miles
- **Purpose**: Maximum distance willing to walk to/from transit stops
- **Impact**: Affects route suggestions and stop selections

### Accessibility Mode

- **Purpose**: Prioritize wheelchair accessible routes
- **Features**:
  - ADA-compliant stop selection
  - Elevator availability checks
  - Accessible vehicle prioritization
  - Audio/visual assistance preferences

## Data Storage

### Local Storage
```typescript
// Storage key
const SETTINGS_KEY = 'oahu_transit_settings';

// Storage structure
interface Settings {
  locations: SavedLocation[];
  notifications: NotificationSettings;
  preferences: TravelPreferences;
}
```

### Cloud Sync (Optional)
- **Backend**: Supabase
- **Endpoint**: `/api/user/settings`
- **Authentication**: Required for cloud sync
- **Fallback**: Local storage always primary

### Privacy Considerations
- All settings stored locally by default
- Cloud sync requires explicit user consent
- No location tracking without permission
- Settings can be exported/imported

## Settings API

### Save Settings
```typescript
const saveSettings = async (settings: Settings) => {
  // Save to localStorage
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  
  // Optional cloud sync
  try {
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (error) {
    // Graceful degradation - localStorage is primary
    console.log('Cloud sync failed, using local storage');
  }
};
```

### Load Settings
```typescript
const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  } catch (error) {
    return defaultSettings;
  }
};
```

## UI Components

### Tab Navigation
- **Locations Tab**: Manage saved addresses
- **Notifications Tab**: Configure alert preferences  
- **Preferences Tab**: Set travel defaults

### Form Components
- **Address Input**: Autocomplete with geocoding
- **Toggle Switches**: iOS-style notification toggles
- **Range Slider**: Walking distance preference
- **Dropdown Selects**: Route type preferences

### Responsive Design
- **Mobile**: Stacked form layout
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid with sidebar

## Integration Points

### Trip Planner Integration
```typescript
// Auto-populate origin/destination
const useSettings = () => {
  const settings = loadSettings();
  
  const getQuickOrigins = () => [
    { name: 'Home', address: settings.locations.find(l => l.type === 'home')?.address },
    { name: 'Work', address: settings.locations.find(l => l.type === 'work')?.address }
  ];
  
  return { settings, getQuickOrigins };
};
```

### Dashboard Integration
- Quick access buttons for saved locations
- Personalized route suggestions
- Notification display based on preferences

### Route Details Integration
- Apply accessibility preferences to route display
- Use walking distance for stop suggestions
- Respect default route type preferences

## Default Settings

```typescript
const defaultSettings: Settings = {
  locations: [],
  notifications: {
    routeAlerts: true,
    weatherAlerts: true,
    serviceDisruptions: true,
    emailUpdates: false
  },
  preferences: {
    defaultTransportMode: 'fastest',
    walkingDistance: 0.5,
    accessibilityMode: false,
    language: 'en'
  }
};
```

## Error Handling

### Geocoding Failures
- Fallback to static Oahu locations
- User-friendly error messages
- Retry mechanisms for API calls

### Storage Failures
- Graceful degradation to session storage
- Error notifications for users
- Data recovery mechanisms

### Validation
- Address format validation
- Distance range enforcement
- Type safety for all inputs

## Future Enhancements

### Planned Features
- **Multi-language Support**: Hawaiian, Japanese, Korean
- **Family Accounts**: Shared location management
- **Calendar Integration**: Automatic commute scheduling
- **Smart Suggestions**: AI-powered location recommendations
- **Group Travel**: Shared trip planning
- **Advanced Notifications**: Custom alert rules

### API Enhancements
- Real-time location sharing (opt-in)
- Predictive route suggestions
- Integration with external calendar apps
- Smart home integration (Alexa, Google Home)

---

## Quick Start Guide

1. **Access Settings**: Click gear icon in navigation or visit `/settings`
2. **Add Home/Work**: Use the "Saved Locations" tab to add primary addresses
3. **Configure Notifications**: Enable/disable alerts based on your needs
4. **Set Preferences**: Choose default route type and walking distance
5. **Save Settings**: Click "Save Settings" button to persist changes

Settings are automatically applied to all trip planning and route suggestions throughout the application.

For technical support or feature requests, create an issue on GitHub or contact the development team.