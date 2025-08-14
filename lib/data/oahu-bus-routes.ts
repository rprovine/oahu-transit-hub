// Comprehensive Oahu Bus Routes Database
// Based on actual TheBus routes serving Oahu

export interface BusRoute {
  route: string;
  name: string;
  areas: string[];
  majorStops: string[];
  frequency: number; // minutes during peak hours
  hours: string;
}

export interface RouteSegment {
  from: string;
  to: string;
  routes: string[];
  transferPoints?: string[];
  duration: number; // average minutes
}

// Major areas and their coordinates for routing
export const OahuAreas = {
  // West Oahu
  KAPOLEI: { lat: 21.3356, lon: -158.0581, name: 'Kapolei' },
  EWA_BEACH: { lat: 21.3156, lon: -158.0072, name: 'Ewa Beach' },
  WAIPAHU: { lat: 21.3867, lon: -158.0092, name: 'Waipahu' },
  PEARL_CITY: { lat: 21.3972, lon: -157.9514, name: 'Pearl City' },
  WAIANAE: { lat: 21.4389, lon: -158.1814, name: 'Waianae' },
  MAKAHA: { lat: 21.4694, lon: -158.2175, name: 'Makaha' },
  
  // Central Oahu
  MILILANI: { lat: 21.4514, lon: -158.0150, name: 'Mililani' },
  WAHIAWA: { lat: 21.5025, lon: -158.0236, name: 'Wahiawa' },
  WAIPIO: { lat: 21.4183, lon: -157.9997, name: 'Waipio' },
  
  // Urban Honolulu
  AIRPORT: { lat: 21.3186, lon: -157.9225, name: 'Airport' },
  KALIHI: { lat: 21.3333, lon: -157.8700, name: 'Kalihi' },
  DOWNTOWN: { lat: 21.3100, lon: -157.8581, name: 'Downtown' },
  CHINATOWN: { lat: 21.3136, lon: -157.8619, name: 'Chinatown' },
  KAKAAKO: { lat: 21.2950, lon: -157.8583, name: 'Kakaako' },
  ALA_MOANA: { lat: 21.2906, lon: -157.8420, name: 'Ala Moana' },
  WAIKIKI: { lat: 21.2764, lon: -157.8229, name: 'Waikiki' },
  KAPAHULU: { lat: 21.2781, lon: -157.8139, name: 'Kapahulu' },
  KAIMUKI: { lat: 21.2850, lon: -157.8006, name: 'Kaimuki' },
  MANOA: { lat: 21.3156, lon: -157.8139, name: 'Manoa' },
  MOILIILI: { lat: 21.2964, lon: -157.8256, name: 'Moiliili' },
  MAKIKI: { lat: 21.3089, lon: -157.8331, name: 'Makiki' },
  SALT_LAKE: { lat: 21.3525, lon: -157.9178, name: 'Salt Lake' },
  
  // East Honolulu
  KAHALA: { lat: 21.2772, lon: -157.7861, name: 'Kahala' },
  HAWAII_KAI: { lat: 21.2778, lon: -157.7061, name: 'Hawaii Kai' },
  AINA_HAINA: { lat: 21.2792, lon: -157.7564, name: 'Aina Haina' },
  
  // Windward
  KAILUA: { lat: 21.3933, lon: -157.7394, name: 'Kailua' },
  KANEOHE: { lat: 21.3994, lon: -157.7983, name: 'Kaneohe' },
  WAIMANALO: { lat: 21.3461, lon: -157.7244, name: 'Waimanalo' },
  
  // North Shore
  HALEIWA: { lat: 21.5922, lon: -158.1036, name: 'Haleiwa' },
  WAHIAWA_BEACHES: { lat: 21.6439, lon: -158.0633, name: 'North Shore Beaches' },
  LAIE: { lat: 21.6458, lon: -157.9256, name: 'Laie' },
  KAHUKU: { lat: 21.6808, lon: -157.9503, name: 'Kahuku' }
};

// Actual TheBus routes
export const BusRoutes: BusRoute[] = [
  // EXPRESS ROUTES
  { route: 'A', name: 'City Express', areas: ['Pearl City', 'Downtown', 'UH Manoa'], majorStops: ['Pearlridge', 'Downtown', 'UH Manoa'], frequency: 30, hours: 'Weekday peak' },
  { route: 'C', name: 'Country Express', areas: ['Makaha', 'Waianae', 'Downtown'], majorStops: ['Makaha', 'Waianae Mall', 'Kapolei', 'Downtown'], frequency: 30, hours: 'Weekday peak' },
  { route: 'E', name: 'Waterfront Express', areas: ['Ewa Beach', 'Downtown', 'Waikiki'], majorStops: ['Ewa Beach', 'Downtown', 'Waikiki'], frequency: 30, hours: 'Weekday peak' },
  
  // MAJOR ROUTES
  { route: '1', name: 'Kalihi-Palama', areas: ['Kalihi', 'Downtown', 'School St'], majorStops: ['Kalihi Transit Center', 'Downtown', 'School/Middle St'], frequency: 15, hours: 'Daily' },
  { route: '2', name: 'School-Middle St', areas: ['Downtown', 'Kalihi', 'School St'], majorStops: ['Waikiki', 'Downtown', 'School/Kalihi'], frequency: 20, hours: 'Daily' },
  { route: '3', name: 'Kalihi-Foster Village', areas: ['Salt Lake', 'Kalihi', 'Downtown'], majorStops: ['Salt Lake', 'Foster Village', 'Downtown'], frequency: 30, hours: 'Daily' },
  { route: '4', name: 'Nuuanu-Punahou', areas: ['Nuuanu', 'Downtown', 'Manoa'], majorStops: ['Nuuanu', 'Downtown', 'Punahou'], frequency: 30, hours: 'Daily' },
  { route: '5', name: 'Manoa Valley', areas: ['Manoa', 'UH', 'Ala Moana'], majorStops: ['Manoa', 'UH Manoa', 'Ala Moana'], frequency: 30, hours: 'Daily' },
  { route: '6', name: 'Pauoa-Woodlawn', areas: ['Pauoa', 'Downtown', 'UH'], majorStops: ['Woodlawn', 'Downtown', 'UH Manoa'], frequency: 30, hours: 'Daily' },
  { route: '7', name: 'Kalihi Valley', areas: ['Kalihi Valley', 'Kalihi', 'Downtown'], majorStops: ['Kalihi Valley', 'King/Kalihi', 'Downtown'], frequency: 30, hours: 'Daily' },
  { route: '8', name: 'Waikiki-Ala Moana', areas: ['Waikiki', 'Ala Moana'], majorStops: ['Waikiki', 'Ala Moana Center'], frequency: 10, hours: 'Daily' },
  { route: '9', name: 'Kalihi-Kapiolani', areas: ['Airport', 'Kalihi', 'Waikiki'], majorStops: ['Airport', 'Kalihi', 'Ala Moana', 'Waikiki'], frequency: 30, hours: 'Daily' },
  
  // REGIONAL ROUTES
  { route: '20', name: 'Airport-Waikiki', areas: ['Airport', 'Downtown', 'Waikiki'], majorStops: ['Airport', 'Downtown', 'Waikiki'], frequency: 30, hours: 'Daily' },
  { route: '40', name: 'Honolulu-Ewa Beach', areas: ['Ewa Beach', 'Waipahu', 'Downtown'], majorStops: ['Ewa Beach', 'Waipahu', 'Pearl City', 'Downtown'], frequency: 30, hours: 'Daily' },
  { route: '41', name: 'Ewa Beach-Waikiki', areas: ['Ewa Beach', 'Pearl Harbor', 'Airport', 'Waikiki'], majorStops: ['Ewa Transit', 'Pearl Harbor', 'Airport', 'Waikiki'], frequency: 60, hours: 'Daily' },
  { route: '42', name: 'Ewa Beach-Waikiki', areas: ['Ewa Beach', 'Waipahu', 'Ala Moana', 'Waikiki'], majorStops: ['Ewa Transit', 'Waipahu', 'Ala Moana', 'Waikiki'], frequency: 30, hours: 'Daily' },
  { route: '52', name: 'Wahiawa-Circle Island', areas: ['Wahiawa', 'Haleiwa', 'Kaneohe'], majorStops: ['Wahiawa', 'Haleiwa', 'Turtle Bay', 'Kaneohe'], frequency: 60, hours: 'Daily' },
  { route: '55', name: 'Kaneohe-Circle Island', areas: ['Kaneohe', 'Laie', 'North Shore', 'Haleiwa'], majorStops: ['Kaneohe', 'Laie', 'Turtle Bay', 'Haleiwa'], frequency: 60, hours: 'Daily' },
  { route: '56', name: 'Kailua-Kaneohe', areas: ['Kailua', 'Kaneohe', 'Windward Mall'], majorStops: ['Kailua', 'Kaneohe', 'Windward Mall'], frequency: 30, hours: 'Daily' },
  { route: '57', name: 'Kailua-Waimanalo', areas: ['Kailua', 'Waimanalo', 'Sea Life Park'], majorStops: ['Kailua', 'Waimanalo', 'Sea Life Park'], frequency: 30, hours: 'Daily' },
  { route: '60', name: 'Kaneohe-Honolulu', areas: ['Kaneohe', 'Kailua', 'Downtown'], majorStops: ['Kaneohe', 'Pali Highway', 'Downtown'], frequency: 30, hours: 'Daily' },
  { route: '65', name: 'Kaneohe-Downtown', areas: ['Kaneohe', 'Downtown'], majorStops: ['Windward Mall', 'Likelike Highway', 'Downtown'], frequency: 30, hours: 'Daily' },
  
  // COUNTRY ROUTES
  { route: '70', name: 'Waimanalo-Kailua', areas: ['Waimanalo', 'Kailua'], majorStops: ['Waimanalo', 'Kailua Beach', 'Kailua Town'], frequency: 60, hours: 'Daily' },
  { route: '72', name: 'Koko Head-Sandy Beach', areas: ['Hawaii Kai', 'Hanauma Bay', 'Sandy Beach'], majorStops: ['Hawaii Kai', 'Hanauma Bay', 'Sandy Beach'], frequency: 60, hours: 'Daily' },
  { route: '73', name: 'Hawaii Kai Express', areas: ['Hawaii Kai', 'Downtown'], majorStops: ['Hawaii Kai', 'Aina Haina', 'Kahala Mall', 'Downtown'], frequency: 30, hours: 'Weekday peak' },
  
  // CROSSTOWN ROUTES
  { route: '80A', name: 'North Shore Express', areas: ['Wahiawa', 'Haleiwa', 'Ala Moana'], majorStops: ['Wahiawa', 'Haleiwa', 'Ala Moana'], frequency: 60, hours: 'Daily' },
  { route: '83', name: 'Wahiawa Express', areas: ['Wahiawa', 'Mililani', 'Downtown'], majorStops: ['Wahiawa', 'Mililani', 'Pearl City', 'Downtown'], frequency: 60, hours: 'Weekday peak' }
];

// Route segments with connections
export const RouteSegments: RouteSegment[] = [
  // West to Urban
  { from: 'Kapolei', to: 'Downtown', routes: ['C', '40'], duration: 45 },
  { from: 'Kapolei', to: 'Ala Moana', routes: ['40', '42'], duration: 50 },
  { from: 'Kapolei', to: 'Waikiki', routes: ['E', '42'], duration: 60 },
  { from: 'Kapolei', to: 'Kalihi', routes: ['C'], transferPoints: ['Downtown'], duration: 55 },
  { from: 'Ewa Beach', to: 'Downtown', routes: ['40', 'E'], duration: 40 },
  { from: 'Ewa Beach', to: 'Waikiki', routes: ['41', '42', 'E'], duration: 55 },
  { from: 'Waipahu', to: 'Downtown', routes: ['40', 'C'], duration: 35 },
  { from: 'Pearl City', to: 'Downtown', routes: ['40', 'A'], duration: 30 },
  { from: 'Pearl City', to: 'UH Manoa', routes: ['A'], duration: 40 },
  
  // Urban to Urban
  { from: 'Kalihi', to: 'Downtown', routes: ['1', '2', '3', '9'], duration: 15 },
  { from: 'Kalihi', to: 'Waikiki', routes: ['9'], duration: 30 },
  { from: 'Downtown', to: 'Waikiki', routes: ['2', '13', '19', '20', '42', 'E'], duration: 20 },
  { from: 'Downtown', to: 'Ala Moana', routes: ['8', '19', '20', '42', '55', '56', '57', '65'], duration: 15 },
  { from: 'Downtown', to: 'UH Manoa', routes: ['4', '5', '6', 'A'], duration: 25 },
  { from: 'Ala Moana', to: 'Waikiki', routes: ['8', '19', '20', '22', '23', '24'], duration: 15 },
  { from: 'Ala Moana', to: 'Kaimuki', routes: ['9', '13'], duration: 20 },
  
  // Windward to Urban
  { from: 'Kailua', to: 'Downtown', routes: ['56', '57'], transferPoints: ['Kaneohe'], duration: 45 },
  { from: 'Kaneohe', to: 'Downtown', routes: ['60', '65'], duration: 35 },
  { from: 'Kaneohe', to: 'Ala Moana', routes: ['60', '65'], transferPoints: ['Downtown'], duration: 45 },
  
  // East to Urban
  { from: 'Hawaii Kai', to: 'Downtown', routes: ['73'], duration: 35 },
  { from: 'Hawaii Kai', to: 'Waikiki', routes: ['22', '23'], duration: 25 },
  
  // North Shore to Urban
  { from: 'Haleiwa', to: 'Ala Moana', routes: ['80A'], duration: 90 },
  { from: 'Haleiwa', to: 'Wahiawa', routes: ['52'], duration: 30 },
  { from: 'Wahiawa', to: 'Downtown', routes: ['83'], duration: 60 },
  
  // Central to Urban
  { from: 'Mililani', to: 'Downtown', routes: ['83'], duration: 45 },
  { from: 'Wahiawa', to: 'Pearl City', routes: ['83'], duration: 30 }
];

// Function to find best route between two areas
export function findBestRoute(fromArea: string, toArea: string): RouteSegment | null {
  // Direct route
  const directRoute = RouteSegments.find(
    segment => segment.from.toLowerCase() === fromArea.toLowerCase() && 
               segment.to.toLowerCase() === toArea.toLowerCase()
  );
  if (directRoute) return directRoute;
  
  // Reverse route (some routes work both ways)
  const reverseRoute = RouteSegments.find(
    segment => segment.to.toLowerCase() === fromArea.toLowerCase() && 
               segment.from.toLowerCase() === toArea.toLowerCase()
  );
  if (reverseRoute) {
    return {
      ...reverseRoute,
      from: toArea,
      to: fromArea
    };
  }
  
  // TODO: Implement transfer route finding
  return null;
}

// Function to determine area from coordinates
export function getAreaFromCoordinates(lat: number, lon: number): string {
  let closestArea = '';
  let minDistance = Infinity;
  
  for (const [key, area] of Object.entries(OahuAreas)) {
    const distance = Math.sqrt(
      Math.pow(area.lat - lat, 2) + Math.pow(area.lon - lon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestArea = area.name;
    }
  }
  
  return closestArea;
}

// Get route details
export function getRouteDetails(routeNumber: string): BusRoute | undefined {
  return BusRoutes.find(r => r.route === routeNumber);
}