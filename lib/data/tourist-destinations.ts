// Precise tourist destination coordinates for Oahu
// These are verified, accurate locations for popular tourist spots

export interface TouristDestination {
  name: string;
  aliases: string[];
  coordinates: [number, number]; // [longitude, latitude]
  category: string;
  description: string;
  busRoutes?: string[];
}

export const TOURIST_DESTINATIONS: TouristDestination[] = [
  {
    name: "Diamond Head State Monument",
    aliases: ["Diamond Head", "Diamond Head Crater", "Le'ahi"],
    coordinates: [-157.8046, 21.2614], // Actual Diamond Head entrance
    category: "Attraction",
    description: "Iconic volcanic crater and hiking trail",
    busRoutes: ["23", "24"]
  },
  {
    name: "Waikiki Beach",
    aliases: ["Waikiki", "Waikiki Shore"],
    coordinates: [-157.8270, 21.2764], // Central Waikiki Beach
    category: "Beach",
    description: "Famous beach and tourist district",
    busRoutes: ["8", "19", "20", "23", "24", "42", "E"]
  },
  {
    name: "Pearl Harbor National Memorial",
    aliases: ["Pearl Harbor", "USS Arizona Memorial"],
    coordinates: [-157.9399, 21.3649], // Pearl Harbor Visitor Center
    category: "Historical",
    description: "WWII memorial and museum",
    busRoutes: ["20", "42"]
  },
  {
    name: "Ala Moana Center",
    aliases: ["Ala Moana Shopping Center", "Ala Moana Mall"],
    coordinates: [-157.8436, 21.2914], // Main mall entrance
    category: "Shopping",
    description: "Hawaii's largest shopping mall",
    busRoutes: ["8", "20", "23", "42", "E"]
  },
  {
    name: "Hanauma Bay Nature Preserve",
    aliases: ["Hanauma Bay", "Hanauma Bay Snorkeling"],
    coordinates: [-157.6942, 21.2694], // Parking lot entrance
    category: "Beach",
    description: "Protected marine life conservation area",
    busRoutes: ["22"]
  },
  {
    name: "Lanikai Beach",
    aliases: ["Lanikai", "Kailua Beach"],
    coordinates: [-157.7126, 21.3925], // Beach access point
    category: "Beach",
    description: "Pristine beach with turquoise waters",
    busRoutes: ["56", "57", "70"]
  },
  {
    name: "North Shore Beaches",
    aliases: ["North Shore", "Haleiwa", "Pipeline", "Sunset Beach"],
    coordinates: [-158.0430, 21.5944], // Haleiwa town center
    category: "Beach",
    description: "Famous surfing beaches",
    busRoutes: ["52", "55", "80A"]
  },
  {
    name: "Polynesian Cultural Center",
    aliases: ["PCC", "Polynesian Center"],
    coordinates: [-157.9212, 21.6394], // Main entrance
    category: "Attraction",
    description: "Cultural theme park and museum",
    busRoutes: ["55", "70"]
  },
  {
    name: "Chinatown Honolulu",
    aliases: ["Chinatown", "Downtown Chinatown"],
    coordinates: [-157.8614, 21.3136], // Hotel Street
    category: "Cultural",
    description: "Historic Chinatown district",
    busRoutes: ["1", "2", "3", "9", "13", "20", "42"]
  },
  {
    name: "Iolani Palace",
    aliases: ["Iolani", "Royal Palace"],
    coordinates: [-157.8596, 21.3065], // Palace grounds
    category: "Historical",
    description: "Only royal palace in the United States",
    busRoutes: ["1", "2", "3", "9", "13"]
  },
  {
    name: "Manoa Falls",
    aliases: ["Manoa Falls Trail", "Manoa Waterfall"],
    coordinates: [-157.8009, 21.3331], // Trail parking lot
    category: "Hiking",
    description: "Popular waterfall hiking trail",
    busRoutes: ["5", "6"]
  },
  {
    name: "Koko Head Crater Trail",
    aliases: ["Koko Head", "Koko Head Stairs", "Koko Crater"],
    coordinates: [-157.7062, 21.2833], // Trail entrance
    category: "Hiking",
    description: "Challenging stairs hike with panoramic views",
    busRoutes: ["22", "23"]
  },
  {
    name: "Makapuu Lighthouse Trail",
    aliases: ["Makapuu", "Makapuu Point"],
    coordinates: [-157.6587, 21.3104], // Trail parking
    category: "Hiking",
    description: "Easy paved trail to lighthouse viewpoint",
    busRoutes: ["22", "23"]
  },
  {
    name: "University of Hawaii at Manoa",
    aliases: ["UH Manoa", "University of Hawaii", "UH"],
    coordinates: [-157.8167, 21.2969], // Campus center
    category: "Education",
    description: "Main university campus",
    busRoutes: ["4", "5", "6", "18", "A"]
  },
  {
    name: "Honolulu International Airport",
    aliases: ["HNL", "Airport", "Daniel K. Inouye Airport"],
    coordinates: [-157.9225, 21.3186], // Main terminal
    category: "Transportation",
    description: "Main airport for Oahu",
    busRoutes: ["19", "20", "31"]
  },
  {
    name: "Ko Olina Lagoons",
    aliases: ["Ko Olina", "Ko Olina Beach"],
    coordinates: [-158.1223, 21.3356], // Lagoon 1
    category: "Beach",
    description: "Four man-made lagoons on west side",
    busRoutes: ["40", "C"]
  },
  {
    name: "Dole Plantation",
    aliases: ["Dole", "Pineapple Plantation"],
    coordinates: [-158.0376, 21.5254], // Visitor center
    category: "Attraction",
    description: "Pineapple plantation and maze",
    busRoutes: ["52"]
  },
  {
    name: "Sea Life Park",
    aliases: ["Sea Life Park Hawaii"],
    coordinates: [-157.6618, 21.3126], // Main entrance
    category: "Attraction",
    description: "Marine mammal park and aquarium",
    busRoutes: ["22", "23"]
  },
  {
    name: "Waimea Valley",
    aliases: ["Waimea Falls", "Waimea Bay"],
    coordinates: [-158.0559, 21.6383], // Valley entrance
    category: "Nature",
    description: "Botanical garden and waterfall",
    busRoutes: ["52", "55"]
  },
  {
    name: "Tantalus Lookout",
    aliases: ["Tantalus", "Puu Ualakaa State Park"],
    coordinates: [-157.8186, 21.3121], // Lookout parking
    category: "Viewpoint",
    description: "Scenic viewpoint overlooking Honolulu",
    busRoutes: ["15"] // Limited bus service
  }
];

// Function to find destination by name or alias
export function findDestination(query: string): TouristDestination | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  return TOURIST_DESTINATIONS.find(dest => 
    dest.name.toLowerCase().includes(normalizedQuery) ||
    dest.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))
  ) || null;
}

// Function to get nearby destinations
export function getNearbyDestinations(
  coordinates: [number, number], 
  maxDistanceKm: number = 5
): TouristDestination[] {
  return TOURIST_DESTINATIONS.filter(dest => {
    const distance = calculateDistance(coordinates, dest.coordinates);
    return distance <= maxDistanceKm;
  }).sort((a, b) => {
    const distA = calculateDistance(coordinates, a.coordinates);
    const distB = calculateDistance(coordinates, b.coordinates);
    return distA - distB;
  });
}

// Calculate distance between two coordinates in kilometers
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI/180);
}