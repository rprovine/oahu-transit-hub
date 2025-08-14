// Comprehensive tourist destination database for Oahu, Hawaii
// Each destination includes detailed cultural, historical, and practical information

export interface TouristDestination {
  name: string;
  aliases: string[];
  coordinates: [number, number]; // [longitude, latitude]
  category: string;
  description: string;
  busRoutes?: string[];
  hawaiianName?: string;
  pronunciation?: string;
  culturalSignificance?: string;
  respectfulVisitingTips?: string[];
  bestTimeToVisit?: string;
  crowdLevel?: 'Low' | 'Medium' | 'High' | 'Variable';
  sustainabilityTips?: string[];
  safetyLevel?: 'High' | 'Medium' | 'Caution';
  accessibilityInfo?: string;
  estimatedVisitDuration?: string;
  nearbyAmenities?: string[];
  historicalContext?: string;
  activities?: string[];
  entryFee?: string;
  parkingInfo?: string;
  bestPhotographySpots?: string[];
}

export const TOURIST_DESTINATIONS: TouristDestination[] = [
  // === ICONIC ATTRACTIONS ===
  {
    name: "Diamond Head State Monument",
    aliases: ["Diamond Head", "Diamond Head Crater", "Le'ahi"],
    coordinates: [-157.8046, 21.2614],
    category: "Attraction",
    description: "Iconic 350,000-year-old volcanic tuff cone with panoramic 360-degree views of Honolulu, Waikiki, and the Pacific Ocean. Features a challenging 1.6-mile round-trip trail through historic military bunkers.",
    busRoutes: ["23", "24"],
    hawaiianName: "Lē'ahi",
    pronunciation: "lay-AH-hee",
    culturalSignificance: "Named for the yellowfin tuna (ahi) because the crater's profile resembles the dorsal fin of the fish. Sacred site to Native Hawaiians, used for centuries as a lookout point. The name 'Diamond Head' came from 19th-century British sailors who mistook calcite crystals for diamonds.",
    historicalContext: "Used as a military lookout during WWII with bunkers and tunnels built into the crater. The trail incorporates these historic military structures, offering both natural beauty and wartime history.",
    respectfulVisitingTips: [
      "Start early (6:00 AM opening) to avoid crowds and intense heat",
      "Bring plenty of water (minimum 16 oz per person)",
      "Wear sturdy closed-toe shoes with good grip",
      "Stay on designated trails to protect native plants and prevent erosion",
      "Respect any cultural or spiritual practices you may encounter",
      "Do not touch or remove anything from the site",
      "Be patient and courteous with other hikers on narrow sections"
    ],
    bestTimeToVisit: "Early morning (6:00-8:00 AM) for sunrise views and cooler temperatures, or late afternoon (4:00-6:00 PM) for sunset",
    crowdLevel: "High",
    sustainabilityTips: [
      "Take only photos, leave only footprints",
      "Use reef-safe, mineral sunscreen before hiking",
      "Pack out all trash including food scraps and tissues",
      "Use reusable water bottles to reduce plastic waste",
      "Respect native plant restoration areas"
    ],
    safetyLevel: "Medium",
    accessibilityInfo: "Steep, uneven trail with 175+ stairs and narrow tunnels. Not wheelchair accessible. Trail requires moderate fitness level.",
    estimatedVisitDuration: "2-3 hours including drive time",
    nearbyAmenities: ["Restrooms at entrance", "Gift shop", "Paid parking", "No food concessions - bring snacks"],
    activities: ["Hiking", "Photography", "Historical exploration", "Sunrise/sunset viewing"],
    entryFee: "$5 per vehicle, $1 per pedestrian",
    parkingInfo: "Limited parking fills early (by 8 AM). Arrive early or consider alternative transportation.",
    bestPhotographySpots: ["Summit crater rim", "Historic bunkers", "Waikiki and Honolulu city views", "Koko Head and southeast coastline"]
  },

  {
    name: "Pearl Harbor National Memorial",
    aliases: ["Pearl Harbor", "USS Arizona Memorial", "Pearl Harbor Historic Sites"],
    coordinates: [-157.9399, 21.3649],
    category: "Historical",
    description: "America's most significant WWII site, commemorating the December 7, 1941 attack. Includes USS Arizona Memorial, USS Missouri Battleship, USS Bowfin Submarine, and Pearl Harbor Aviation Museum.",
    busRoutes: ["20", "42"],
    hawaiianName: "Pu'uloa",
    pronunciation: "poo-oo-LOH-ah",
    culturalSignificance: "Originally called Pu'uloa meaning 'long hill' or 'curved hill.' Sacred place in Hawaiian culture where the shark goddess Ka'ahupahau was said to protect the harbor. Pearl oyster beds were abundant here, giving it the English name Pearl Harbor.",
    historicalContext: "Site of the December 7, 1941 Japanese attack that brought the United States into WWII. The USS Arizona Memorial honors the 1,177 sailors and Marines killed on the battleship. Over 2,400 Americans died in the attack.",
    respectfulVisitingTips: [
      "Maintain quiet, reverent behavior throughout all memorial sites",
      "No bags, purses, or personal items allowed (security restrictions)",
      "Dress appropriately - no swimwear, tank tops, or revealing clothing",
      "Turn off and put away cell phones during memorial presentations",
      "Stand during the national anthem and moment of silence",
      "Do not touch artifacts or memorials",
      "Reserve free timed tickets online in advance for Arizona Memorial",
      "Arrive 30 minutes before scheduled tour time"
    ],
    bestTimeToVisit: "Morning (7:30-11:00 AM) for cooler weather and shorter security lines. First tours of the day are less crowded.",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use public transportation to reduce traffic impact on this residential area",
      "Bring reusable water bottle (refill stations available)",
      "Choose digital tickets and maps when available",
      "Respect the marine environment around the harbor"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Fully wheelchair accessible including boat transport to Arizona Memorial. Assistive listening devices available for tours. Wheelchair rentals on-site.",
    estimatedVisitDuration: "Full day (6-8 hours) for all sites, 4-5 hours for Arizona Memorial and one additional site",
    nearbyAmenities: ["Visitor center", "Gift shops", "Food court", "Audio tours", "Bag storage ($7)", "Restrooms", "First aid"],
    activities: ["Historical tours", "Museum exploration", "Memorial services", "Educational programs", "Documentary films"],
    entryFee: "Arizona Memorial: Free (advance reservation required). Other sites: $34.99-$89.99",
    parkingInfo: "Free parking available. Arrive early (before 8 AM) for best spots. Some paid shuttle services available.",
    bestPhotographySpots: ["Arizona Memorial interior", "USS Missouri deck", "Harbor views", "Memorial walls", "Aircraft displays"]
  },

  {
    name: "Iolani Palace",
    aliases: ["Iolani", "Royal Palace", "Hawaiian Royal Palace"],
    coordinates: [-157.8596, 21.3065],
    category: "Historical",
    description: "The only official royal palace on American soil, built in 1882 by King Kalākaua. This Renaissance Revival palace showcases the sophisticated Hawaiian Kingdom with original furnishings, portraits, and crown jewels.",
    busRoutes: ["1", "2", "3", "9", "13"],
    hawaiianName: "'Iolani",
    pronunciation: "ee-oh-LAH-nee",
    culturalSignificance: "Named for the hawk (ʻio), representing royalty in Hawaiian culture. Served as official residence for King Kalākaua and Queen Liliʻuokalani, the last reigning Hawaiian monarchs. Site where the Hawaiian Kingdom was overthrown in 1893.",
    historicalContext: "Built during Hawaii's golden age of prosperity from sugar trade. Featured modern amenities like electricity and telephones before the White House. After the overthrow, served as the capitol building until 1969. Restored to its royal grandeur in the 1970s.",
    respectfulVisitingTips: [
      "Wear shoe covers provided to protect historic floors",
      "No photography inside palace rooms (exterior photos allowed)",
      "Maintain quiet voices during guided tours",
      "Do not touch furniture, artifacts, or exhibits",
      "Respect the cultural significance of this sacred site to Native Hawaiians",
      "Book tours in advance, especially during peak season",
      "Arrive 15 minutes early for orientation"
    ],
    bestTimeToVisit: "Weekday mornings (9:00-11:00 AM) for smaller tour groups and better lighting",
    crowdLevel: "Medium",
    sustainabilityTips: [
      "Join group tours to minimize environmental impact",
      "Use digital brochures instead of paper when available",
      "Walk or use public transport - downtown parking is limited",
      "Support the palace's conservation efforts through donations"
    ],
    safetyLevel: "High",
    accessibilityInfo: "First floor wheelchair accessible. Elevator available. Grand tour includes stairs to second floor. Audio tours available.",
    estimatedVisitDuration: "1.5-2.5 hours including grounds tour",
    nearbyAmenities: ["Gift shop with Hawaiian crafts", "Restrooms", "Historic downtown restaurants within walking distance", "Adjacent Iolani Palace grounds for picnicking"],
    activities: ["Guided palace tours", "Self-guided grounds tour", "Crown jewel viewing", "Royal portrait gallery", "Historical exhibits"],
    entryFee: "Audio tour: $14.75 adults, $6 children. Grand tour: $21.75 adults, $6 children",
    parkingInfo: "Metered street parking available. Municipal lots nearby. Consider public transportation.",
    bestPhotographySpots: ["Palace exterior and grounds", "Coronation pavilion", "Royal mausoleums", "Palace gate entrance", "Downtown skyline backdrop"]
  },

  // === BEACHES - SOUTH SHORE ===
  {
    name: "Waikiki Beach",
    aliases: ["Waikiki", "Waikiki Shore", "Royal Hawaiian Beach"],
    coordinates: [-157.8270, 21.2764],
    category: "Beach",
    description: "World's most famous beach stretching 2 miles with golden sand imported from Molokai. Historic birthplace of modern surfing, offering gentle waves perfect for beginners alongside luxury resorts and dining.",
    busRoutes: ["8", "19", "20", "23", "24", "42", "E"],
    hawaiianName: "Waikīkī",
    pronunciation: "why-kee-KEE",
    culturalSignificance: "Means 'spouting fresh water' referring to the streams and springs that once flowed here. Sacred place where Hawaiian royalty lived and played. Birthplace of Duke Kahanamoku, father of modern surfing.",
    historicalContext: "Originally a wetland area with fishponds and taro fields. Became royal retreat in the 1800s. Developed as tourist destination in early 1900s with the Royal Hawaiian Hotel. Sand imported from Molokai and California after original sand was depleted.",
    respectfulVisitingTips: [
      "Respect surf etiquette and local surfers' priority",
      "Don't take sand, rocks, or coral as souvenirs",
      "Be mindful of Hawaiian monk seals that may rest on shore",
      "Support local beach vendors and respect their designated areas",
      "Learn basic Hawaiian words like 'aloha' and 'mahalo'",
      "Understand right-of-way rules for surfers and swimmers",
      "Respect private hotel beach areas while enjoying public access"
    ],
    bestTimeToVisit: "Early morning (6:00-9:00 AM) for fewer crowds and best surf conditions, or late afternoon for sunset",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use only reef-safe, mineral sunscreen (zinc oxide or titanium dioxide)",
      "Don't feed fish or marine life",
      "Pack out all trash including cigarette butts",
      "Use reusable water bottles and avoid single-use plastics",
      "Respect sea turtle nesting areas if present",
      "Support eco-friendly local businesses"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Beach wheelchairs available at some locations. Paved walkways along beach. Accessible restrooms and showers at multiple points.",
    estimatedVisitDuration: "2-8 hours (varies widely based on activities)",
    nearbyAmenities: ["Numerous hotels and resorts", "Restaurants and bars", "Surf lesson vendors", "Beach equipment rentals", "Public restrooms and showers", "Shopping at Royal Hawaiian Center"],
    activities: ["Surfing lessons", "Stand-up paddleboarding", "Snorkeling", "Beach volleyball", "Sunset watching", "Shopping", "Dining", "People watching"],
    entryFee: "Free (public beach)",
    parkingInfo: "Limited and expensive ($3-5/hour). Consider hotel parking if staying nearby, or use public transportation.",
    bestPhotographySpots: ["Diamond Head backdrop", "Sunrise from beach", "Surfers at The Wall", "Royal Hawaiian Hotel pink facade", "Sunset from Duke Kahanamoku statue"]
  },

  {
    name: "Hanauma Bay Nature Preserve",
    aliases: ["Hanauma Bay", "Hanauma Bay Snorkeling"],
    coordinates: [-157.6942, 21.2694],
    category: "Beach",
    description: "Spectacular crescent-shaped bay formed by volcanic cone collapse, now a protected marine life conservation area. Home to over 450 species of tropical fish and Hawaii's premier snorkeling destination.",
    busRoutes: ["22"],
    hawaiianName: "Hanauma",
    pronunciation: "hah-now-mah",
    culturalSignificance: "Means 'curved bay' in Hawaiian. Created by volcanic activity 32,000 years ago. Sacred fishing grounds for Native Hawaiians. Now protected as one of Hawaii's most important marine ecosystems.",
    historicalContext: "Nearly destroyed by over-tourism in the 1980s with coral bleaching and fish population decline. Became protected nature preserve in 1990. Extensive restoration has brought back marine life diversity.",
    respectfulVisitingTips: [
      "Watch mandatory 9-minute educational video before entering",
      "No touching, standing on, or feeding coral or fish",
      "Don't chase or corner marine animals",
      "Stay in designated swimming areas only",
      "No smoking anywhere in preserve",
      "Don't bring anything that could pollute water",
      "Respect capacity limits and time restrictions",
      "Book reservations online in advance"
    ],
    bestTimeToVisit: "Early morning (7:00-9:00 AM) for clearest water, calmest conditions, and best fish activity",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use only reef-safe, mineral sunscreen (no chemical sunscreens allowed)",
      "Don't bring single-use plastics or food containers",
      "Follow all marine conservation guidelines strictly",
      "Consider visiting less crowded snorkeling sites to reduce impact",
      "Take only pictures, leave only bubbles",
      "Support the preserve through entrance fees and donations"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Steep 300-yard walk down to beach. Wheelchair-accessible tram available for those with mobility challenges ($3 round trip). Snorkel gear rental on-site.",
    estimatedVisitDuration: "3-5 hours including travel and education video",
    nearbyAmenities: ["Snorkel gear rental", "Restrooms and showers", "Gift shop", "Food truck", "First aid station", "Lockers available"],
    activities: ["Snorkeling", "Underwater photography", "Marine life observation", "Educational programs", "Beach relaxation"],
    entryFee: "$25 non-residents, $3 Hawaii residents, children under 12 free. Online reservations required.",
    parkingInfo: "Free parking included with admission, but spaces limited. Arrive early or use tour transportation.",
    bestPhotographySpots: ["Underwater coral formations", "Tropical fish schools", "Bay overview from rim", "Volcanic rock formations", "Sunrise over bay"]
  },

  {
    name: "Lanikai Beach",
    aliases: ["Lanikai", "Kailua Beach", "Lanikai Bay"],
    coordinates: [-157.7126, 21.3925],
    category: "Beach",
    description: "Consistently rated among world's best beaches with powdery white coral sand and turquoise waters. Pristine 0.5-mile stretch offering excellent swimming, kayaking to offshore islands, and stunning sunrise views.",
    busRoutes: ["56", "57", "70"],
    hawaiianName: "Lanikai",
    pronunciation: "LAH-nee-kai",
    culturalSignificance: "Means 'heavenly ocean' in Hawaiian. This area was traditionally used for fishing and gathering by Native Hawaiians. The offshore islands (Na Mokulua) are seabird sanctuaries sacred to Hawaiian culture.",
    historicalContext: "Originally called Kaʻōhao by Hawaiians. Developed as residential area in 1920s. Beach access maintained as public right despite expensive residential development. Coral sand naturally formed over centuries.",
    respectfulVisitingTips: [
      "Respect private property and use only designated beach access paths",
      "Keep noise levels low when walking through residential neighborhoods",
      "Don't take sand, coral, or rocks as souvenirs",
      "Be mindful of nesting seabirds on offshore islands",
      "Respect Hawaiian monk seals if they appear on beach",
      "Pack out all trash and belongings",
      "Don't block residential driveways when looking for parking"
    ],
    bestTimeToVisit: "Early morning (6:00-9:00 AM) for spectacular sunrise and fewer crowds, or weekdays during school hours",
    crowdLevel: "Medium",
    sustainabilityTips: [
      "Use reef-safe, mineral-based sunscreen only",
      "Don't touch or feed marine life including sea turtles",
      "Pack out all trash including organic waste",
      "Use reusable water bottles to reduce plastic waste",
      "Stay on designated paths to prevent dune erosion",
      "Don't disturb bird nesting areas on offshore islands"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Soft sand beach requires walking ability. Beach wheelchairs available at nearby Kailua Beach Park. No paved access to water.",
    estimatedVisitDuration: "2-4 hours for beach activities, full day if kayaking to islands",
    nearbyAmenities: ["Kailua Beach Park (5-minute walk)", "Beach equipment rentals in Kailua town", "Restaurants and cafes", "Public restrooms at Kailua Beach Park"],
    activities: ["Swimming", "Kayaking to Mokulua islands", "Stand-up paddleboarding", "Snorkeling", "Sunrise photography", "Beach volleyball"],
    entryFee: "Free (public beach access)",
    parkingInfo: "Very limited street parking. Best accessed by bike, walking from Kailua Beach Park, or rideshare. Some paid parking lots available.",
    bestPhotographySpots: ["Sunrise over Mokulua islands", "Crystal clear water colors", "Pristine white sand", "Offshore island views", "Beach volleyball action"]
  },

  // === BEACHES - WINDWARD SIDE ===
  {
    name: "Kailua Beach Park",
    aliases: ["Kailua Beach", "Kailua Bay", "Kailua Beach Park"],
    coordinates: [-157.7394, 21.3972],
    category: "Beach",
    description: "World-renowned 2.5-mile beach with pristine white sand and crystal-clear turquoise water. Excellent for swimming, kitesurfing, and kayaking with consistent trade winds and calm conditions.",
    busRoutes: ["56", "57", "70"],
    hawaiianName: "Kailua",
    pronunciation: "kai-LOO-ah",
    culturalSignificance: "Means 'two seas' referring to the two bodies of water that flow into Kailua Bay. Important fishing area for ancient Hawaiians with several heiau (temples) in surrounding hills.",
    historicalContext: "Home to ancient Hawaiian settlements with terraced agricultural areas visible in nearby hills. Developed as military recreation area during WWII. Became civilian beach destination in 1960s.",
    respectfulVisitingTips: [
      "Respect private beach access through residential areas",
      "Share the beach courteously with locals who've grown up here",
      "Don't monopolize space with large setups",
      "Clean up thoroughly - this is locals' backyard",
      "Respect lifeguard instructions and posted warnings",
      "Be aware of weather conditions affecting water safety",
      "Support local businesses rather than chain stores"
    ],
    bestTimeToVisit: "Early morning (7:00-10:00 AM) for best conditions and parking availability",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use reef-safe sunscreen to protect marine ecosystem",
      "Don't feed fish or disturb marine life",
      "Pack out all trash including food scraps",
      "Use reusable containers and water bottles",
      "Respect dune vegetation and stay on designated paths",
      "Consider biking or walking to reduce car traffic"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Beach wheelchair available at lifeguard station. Accessible parking, restrooms, and showers. Paved pathways to beach areas.",
    estimatedVisitDuration: "3-6 hours for full beach experience",
    nearbyAmenities: ["Lifeguard station", "Restrooms and outdoor showers", "Picnic pavilions", "Beach equipment rental shops", "Restaurants in Kailua town", "Grocery stores"],
    activities: ["Swimming", "Kitesurfing", "Windsurfing", "Stand-up paddleboarding", "Kayaking", "Beach volleyball", "Picnicking"],
    entryFee: "Free (public beach and park)",
    parkingInfo: "Free parking lot fills early (by 9 AM). Street parking limited. Consider arriving by bike or bus.",
    bestPhotographySpots: ["Turquoise water contrasts", "Kite surfers in action", "White sand details", "Beach panoramas", "Sunset from nearby Lanikai"]
  },

  {
    name: "Waimanalo Beach",
    aliases: ["Waimanalo Bay Beach Park", "Sherwoods Beach"],
    coordinates: [-157.7067, 21.3389],
    category: "Beach",
    description: "Longest sandy beach on Oahu (5.5 miles) with bodysurfing waves and local Hawaiian culture. Less touristy alternative offering authentic island experience with spectacular sunrise views.",
    busRoutes: ["57"],
    hawaiianName: "Waimānalo",
    pronunciation: "why-mah-nah-low",
    culturalSignificance: "Means 'potable water' in Hawaiian. Traditional Hawaiian homestead area with strong cultural identity. Home to many Native Hawaiian families maintaining traditional lifestyle and values.",
    historicalContext: "One of the last intact Hawaiian rural communities on Oahu. Area designated as Hawaiian Homestead in 1921. Maintains agricultural heritage with farms and ranches. Strong resistance to over-development.",
    respectfulVisitingTips: [
      "Respect this as a local community beach - be respectful visitor",
      "Don't leave valuables in cars (break-ins can occur)",
      "Be respectful of local families and their beach activities",
      "Don't take up excessive space with large tourist setups",
      "Learn about and respect Hawaiian homestead history",
      "Support local food trucks and vendors",
      "Be aware of cultural sensitivity in this Native Hawaiian community"
    ],
    bestTimeToVisit: "Early morning (6:00-9:00 AM) for beautiful sunrise and calmer conditions before trade winds pick up",
    crowdLevel: "Medium",
    sustainabilityTips: [
      "Use reef-safe sunscreen only",
      "Pack out all trash - help keep this local beach pristine",
      "Don't disturb dune vegetation or wildlife",
      "Use reusable containers and minimize waste",
      "Respect fishing areas used by local families",
      "Support Native Hawaiian businesses in the area"
    ],
    safetyLevel: "Medium",
    accessibilityInfo: "Sandy beach with natural access. Public restrooms and showers available. Some areas have rocky entry points.",
    estimatedVisitDuration: "2-4 hours",
    nearbyAmenities: ["Public restrooms and showers", "Local food trucks", "Camping areas (permit required)", "Nearby farms and agricultural stands"],
    activities: ["Swimming", "Bodysurfing", "Beachcombing", "Sunrise photography", "Fishing", "Camping (with permit)"],
    entryFee: "Free (public beach)",
    parkingInfo: "Free parking available but be cautious about valuables. Don't leave anything visible in vehicle.",
    bestPhotographySpots: ["Sunrise over ocean", "Long beach stretches", "Local Hawaiian culture", "Mountain backdrop views", "Bodysurf action shots"]
  },

  // === BEACHES - NORTH SHORE ===
  {
    name: "Pipeline Beach",
    aliases: ["Banzai Pipeline", "Pipe", "Ehukai Beach Park"],
    coordinates: [-158.0627, 21.6622],
    category: "Beach",
    description: "World's most famous surf break known for perfect barrels and dangerous shallow reef. Home to professional surfing competitions and legendary waves up to 20 feet during winter months.",
    busRoutes: ["52", "55"],
    hawaiianName: "Ehukai",
    pronunciation: "eh-hoo-kai",
    culturalSignificance: "Means 'sea spray' in Hawaiian. Sacred surfing grounds where Hawaiian surfers developed wave-riding skills. Modern Pipeline named for the perfect tube-shaped waves that form over shallow coral reef.",
    historicalContext: "Discovered as surfing spot in 1960s. Became famous through surf films and competitions starting in 1970s. Site of Vans Triple Crown of Surfing. Extremely dangerous for inexperienced surfers due to shallow reef.",
    respectfulVisitingTips: [
      "Respect experienced surfers and their priority in lineup",
      "Don't surf here unless you're highly experienced",
      "Stay well clear of surfers when swimming or bodyboarding",
      "Don't walk on reef or remove coral/rocks",
      "Be respectful spectator of professional surfing events",
      "Understand and respect local surf culture and etiquette",
      "Don't interfere with photographers or film crews"
    ],
    bestTimeToVisit: "Winter months (November-February) for big surf, or summer for calmer swimming conditions. Early morning for offshore winds.",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use reef-safe sunscreen only - this reef ecosystem is fragile",
      "Don't touch or step on coral reef",
      "Pack out all trash including organic waste",
      "Don't feed fish or disturb marine life",
      "Respect protected species including Hawaiian monk seals",
      "Support local businesses rather than chains"
    ],
    safetyLevel: "Caution",
    accessibilityInfo: "Sandy beach access but very dangerous ocean conditions. Only experienced swimmers should enter water. No accessibility accommodations.",
    estimatedVisitDuration: "2-4 hours for watching surfing, full day during competitions",
    nearbyAmenities: ["Foodland store nearby", "Restaurants in Haleiwa", "Public restrooms", "Surf shops", "Food trucks during events"],
    activities: ["Surfing (experts only)", "Surf watching", "Photography", "Professional surf competitions", "Beach walking"],
    entryFee: "Free (public beach)",
    parkingInfo: "Free but very limited parking. Arrive early or park in Haleiwa and walk. Traffic extremely heavy during surf competitions.",
    bestPhotographySpots: ["Perfect barrel waves", "Professional surfers in action", "Sunset surf sessions", "Competition crowds", "Reef and wave formations"]
  },

  {
    name: "Sunset Beach",
    aliases: ["Sunset Beach Park", "Sunset Point"],
    coordinates: [-158.0431, 21.6772],
    category: "Beach",
    description: "Two-mile stretch of golden sand beach famous for spectacular sunsets and world-class surfing. Winter brings massive 15-30 foot waves, while summer offers calmer swimming conditions.",
    busRoutes: ["52", "55"],
    hawaiianName: "Sunset Beach",
    pronunciation: "sun-set beach",
    culturalSignificance: "Named for spectacular sunset views looking west across Pacific. Important surfing location in Hawaiian surf culture. Part of the North Shore's legendary surf break collection.",
    historicalContext: "Became famous in surfing culture during 1960s surf boom. Host to professional surfing competitions. Featured in countless surf movies and documentaries. Part of Vans Triple Crown of Surfing.",
    respectfulVisitingTips: [
      "Respect powerful ocean conditions - swim only when calm",
      "Give surfers right of way and don't interfere with surf sessions",
      "Don't walk in front of photographers shooting surfers",
      "Be patient during sunset - it's crowded for good reason",
      "Respect local families who use this as their regular beach",
      "Don't leave trash or damage dune vegetation",
      "Be aware of seasonal changes in ocean conditions"
    ],
    bestTimeToVisit: "Late afternoon for sunset viewing, early morning for fewer crowds. Winter for big surf, summer for swimming.",
    crowdLevel: "Variable",
    sustainabilityTips: [
      "Use reef-safe sunscreen to protect marine ecosystem",
      "Pack out all trash and belongings",
      "Don't disturb dune plants or wildlife",
      "Use reusable containers and water bottles",
      "Stay on established paths to prevent erosion",
      "Support local North Shore businesses"
    ],
    safetyLevel: "Medium",
    accessibilityInfo: "Sandy beach with natural access. Public facilities available. Ocean conditions can be very dangerous in winter.",
    estimatedVisitDuration: "2-4 hours, longer during surf competitions or spectacular sunsets",
    nearbyAmenities: ["Ted's Bakery nearby", "Public restrooms", "Surf shops", "Food trucks", "Parking area"],
    activities: ["Surfing", "Swimming (summer only)", "Sunset watching", "Beach walking", "Photography", "Surf competitions"],
    entryFee: "Free (public beach)",
    parkingInfo: "Free roadside parking. Can be crowded during events and sunset hours. Be cautious of soft sand areas.",
    bestPhotographySpots: ["Sunset silhouettes", "Large winter waves", "Surfers in action", "Beach panoramas", "Dune grass details"]
  },

  {
    name: "Waimea Bay Beach Park",
    aliases: ["Waimea Bay", "Waimea Beach"],
    coordinates: [-158.0559, 21.6406],
    category: "Beach",
    description: "Historic bay with calm turquoise waters in summer perfect for swimming, transforming into massive 25+ foot surf waves in winter. Famous for big wave surfing and the legendary rock jumping spot.",
    busRoutes: ["52", "55"],
    hawaiianName: "Waimea",
    pronunciation: "why-may-ah",
    culturalSignificance: "Means 'reddish water' in Hawaiian, possibly referring to red soil runoff. Sacred valley with important Hawaiian cultural sites. Location where Captain Cook first landed in Hawaii in 1778.",
    historicalContext: "First contact between Hawaiians and Europeans occurred here in 1778. Ancient Hawaiian settlements throughout Waimea Valley. Became famous surf spot in 1950s. Site of The Eddie Aikau big wave surfing competition.",
    respectfulVisitingTips: [
      "Respect seasonal ocean changes - summer calm, winter dangerous",
      "Don't jump from rock unless experienced and conditions are safe",
      "Be aware of cultural significance of Waimea Valley",
      "Respect big wave surfers during winter months",
      "Don't swim during high surf warnings",
      "Be cautious of strong currents even during calm periods",
      "Learn about Captain Cook's historical landing here"
    ],
    bestTimeToVisit: "Summer (April-October) for swimming and calm conditions. Winter for spectacular big wave watching (from safe distance).",
    crowdLevel: "Variable",
    sustainabilityTips: [
      "Use only reef-safe sunscreen",
      "Don't touch or disturb marine life",
      "Pack out all trash and food waste",
      "Respect the river ecosystem flowing into the bay",
      "Stay on designated paths in parking and beach areas",
      "Support cultural preservation efforts in Waimea Valley"
    ],
    safetyLevel: "Medium",
    accessibilityInfo: "Sandy beach with accessible parking and restrooms. Ocean access depends on seasonal conditions.",
    estimatedVisitDuration: "2-4 hours for beach activities, full day if visiting Waimea Valley",
    nearbyAmenities: ["Waimea Valley nearby", "Public restrooms and showers", "Lifeguard station", "Food trucks", "Historic sites"],
    activities: ["Swimming (summer)", "Rock jumping", "Snorkeling", "Big wave watching (winter)", "Historical exploration", "River activities"],
    entryFee: "Free (beach access)",
    parkingInfo: "Free parking but fills quickly on weekends and during big surf. Arrive early morning for best spots.",
    bestPhotographySpots: ["Rock jumping action", "Crystal clear summer water", "Massive winter waves", "Bay panoramas", "Historical markers"]
  },

  // === HIKING & NATURE ===
  {
    name: "Manoa Falls Trail",
    aliases: ["Manoa Falls", "Manoa Waterfall", "Manoa Falls Hike"],
    coordinates: [-157.8009, 21.3331],
    category: "Hiking",
    description: "Gentle 1.6-mile round-trip rainforest hike to spectacular 150-foot waterfall. Lush tropical vegetation with native Hawaiian plants, perfect for families and beginner hikers.",
    busRoutes: ["5", "6"],
    hawaiianName: "Mānoa",
    pronunciation: "mah-NO-ah",
    culturalSignificance: "Means 'vast' in Hawaiian, referring to the expansive valley. Sacred valley with numerous heiau (temples). Home to native Hawaiian plants used for medicine and cultural practices.",
    historicalContext: "Ancient Hawaiian agricultural area with taro terraces. Featured in TV show 'Lost' and numerous films. Part of larger Honolulu watershed protecting city's water supply.",
    respectfulVisitingTips: [
      "Stay on marked trail to protect rare native plants",
      "Don't swim in waterfall pool - dangerous falling rocks",
      "Keep noise levels down to respect wildlife",
      "Don't pick plants or flowers",
      "Be prepared for muddy, slippery conditions",
      "Don't venture off trail into private property",
      "Pack out all trash including organic waste"
    ],
    bestTimeToVisit: "Early morning (7:00-9:00 AM) for best lighting and fewer crowds. Avoid after heavy rains due to flash flood risk.",
    crowdLevel: "High",
    sustainabilityTips: [
      "Stay strictly on designated trail",
      "Don't feed birds or wildlife",
      "Pack out all trash including tissues and fruit peels",
      "Use reusable water bottles",
      "Don't disturb stream ecosystem",
      "Support native plant conservation efforts"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Unpaved, muddy trail with tree roots and rocks. Not wheelchair accessible. Requires basic hiking ability.",
    estimatedVisitDuration: "2-3 hours including waterfall viewing time",
    nearbyAmenities: ["Parking area", "Nearby Lyon Arboretum", "University of Hawaii campus", "Manoa town restaurants"],
    activities: ["Hiking", "Nature photography", "Birdwatching", "Waterfall viewing", "Rainforest exploration"],
    entryFee: "Free",
    parkingInfo: "Limited roadside parking near trailhead. Arrive early to secure spot. Some paid parking available at nearby locations.",
    bestPhotographySpots: ["150-foot waterfall", "Lush rainforest canopy", "Native Hawaiian plants", "Stream crossings", "Bamboo groves"]
  },

  {
    name: "Koko Head Crater Trail",
    aliases: ["Koko Head", "Koko Head Stairs", "Koko Crater Trail", "Railway Trail"],
    coordinates: [-157.7062, 21.2833],
    category: "Hiking",
    description: "Intense 1.4-mile round-trip climb up 1,048 railroad tie steps to 1,208-foot summit. Extremely challenging workout hike with panoramic 360-degree views of southeast Oahu.",
    busRoutes: ["22", "23"],
    hawaiianName: "Kohelepelepe",
    pronunciation: "koh-heh-leh-peh-leh-peh",
    culturalSignificance: "Traditional Hawaiian name means 'inner lips of the vagina,' referring to the crater's shape. Used by ancient Hawaiians as lookout point for approaching canoes and weather.",
    historicalContext: "WWII military installation with railway built to transport supplies to radar station at summit. Railroad ties remain from original track, now serving as hiking trail steps.",
    respectfulVisitingTips: [
      "Start very early (5:00-6:00 AM) to avoid dangerous midday heat",
      "Bring plenty of water (32+ oz per person)",
      "Allow others to pass safely on narrow sections",
      "Don't attempt if you have heart conditions or aren't physically fit",
      "Wear proper hiking shoes with good traction",
      "Take breaks as needed - this is extremely strenuous",
      "Turn around if conditions become unsafe"
    ],
    bestTimeToVisit: "Very early morning (sunrise) for cooler temperatures and spectacular views. Avoid midday heat.",
    crowdLevel: "High",
    sustainabilityTips: [
      "Pack out all trash including water bottles",
      "Stay on railroad tie trail to prevent erosion",
      "Don't disturb native dryland plants",
      "Use reef-safe sunscreen before hiking",
      "Bring reusable water containers",
      "Respect wildlife including nesting seabirds"
    ],
    safetyLevel: "Caution",
    accessibilityInfo: "Extremely steep, uneven steps. Not accessible for wheelchairs or anyone with mobility limitations. Requires excellent physical fitness.",
    estimatedVisitDuration: "2-4 hours depending on fitness level and rest breaks",
    nearbyAmenities: ["Parking area", "No restrooms or water at trailhead", "Hanauma Bay nearby", "Hawaii Kai shops and restaurants"],
    activities: ["Strenuous hiking", "Sunrise viewing", "360-degree photography", "Physical fitness challenge", "Panoramic sightseeing"],
    entryFee: "Free",
    parkingInfo: "Free parking lot available. Fills early morning. Overflow parking on residential streets (be respectful).",
    bestPhotographySpots: ["Summit 360-degree views", "Hanauma Bay from above", "Sunrise over ocean", "Honolulu city skyline", "Railroad tie perspective shots"]
  },

  {
    name: "Makapuu Lighthouse Trail",
    aliases: ["Makapuu Point", "Makapuu Lighthouse", "Makapuu Trail"],
    coordinates: [-157.6587, 21.3104],
    category: "Hiking",
    description: "Easy 2.4-mile round-trip paved trail to historic lighthouse with spectacular ocean and island views. Excellent for whale watching during winter months and accessible for most fitness levels.",
    busRoutes: ["22", "23"],
    hawaiianName: "Makapu'u",
    pronunciation: "mah-kah-poo-oo",
    culturalSignificance: "Means 'bulging eye' in Hawaiian, referring to the shape of the point. Sacred area with ancient Hawaiian fishing shrines and cultural sites.",
    historicalContext: "Lighthouse built in 1909 to guide ships around dangerous eastern point. Automated in 1974. Trail built on former military road. Important bird migration route and whale watching area.",
    respectfulVisitingTips: [
      "Stay on paved trail to protect native coastal plants",
      "Don't climb on lighthouse or restricted areas",
      "Be respectful of wildlife, especially during nesting seasons",
      "Don't litter or disturb natural areas",
      "Keep dogs leashed if pets are allowed",
      "Be courteous to other hikers on narrow viewpoint areas",
      "Respect private property boundaries"
    ],
    bestTimeToVisit: "Early morning for cooler temperatures, or winter afternoons for whale watching (December-April)",
    crowdLevel: "Variable",
    sustainabilityTips: [
      "Pack out all trash and recyclables",
      "Use reef-safe sunscreen",
      "Stay on designated paved trail only",
      "Don't pick native plants or disturb wildlife",
      "Bring reusable water bottles",
      "Respect nesting areas for native seabirds"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Paved trail suitable for wheelchairs and strollers, though some steep sections. Accessible parking available.",
    estimatedVisitDuration: "1.5-2.5 hours",
    nearbyAmenities: ["Parking area", "No restrooms at trailhead", "Sea Life Park nearby", "Waimanalo Beach and town"],
    activities: ["Easy hiking", "Whale watching (winter)", "Lighthouse photography", "Ocean views", "Birdwatching", "Sunrise/sunset viewing"],
    entryFee: "Free",
    parkingInfo: "Free parking lot. Can fill up on weekends and during whale season. Additional roadside parking available.",
    bestPhotographySpots: ["Historic lighthouse", "Panoramic ocean views", "Offshore islands", "Whale sightings (winter)", "Coastal cliff formations"]
  },

  // === CULTURAL & HISTORICAL SITES ===
  {
    name: "Polynesian Cultural Center",
    aliases: ["PCC", "Polynesian Center", "Cultural Center"],
    coordinates: [-157.9212, 21.6394],
    category: "Attraction",
    description: "World's largest Polynesian cultural theme park featuring authentic villages from six Pacific island cultures. Experience traditional crafts, performances, and authentic cuisine from Hawaii, Samoa, Fiji, Tahiti, Tonga, and Aotearoa.",
    busRoutes: ["55", "70"],
    hawaiianName: "Polynesian Cultural Center",
    culturalSignificance: "Educational center preserving and sharing Pacific Islander cultures. Built and operated by students from Brigham Young University-Hawaii, providing scholarships through tourism revenue.",
    historicalContext: "Opened in 1963 as a way to preserve Pacific Islander cultures while providing education funding for Pacific Islander students. Features authentic reconstructed villages based on historical research.",
    respectfulVisitingTips: [
      "Show respect during cultural demonstrations and performances",
      "Engage respectfully with cultural ambassadors and ask questions",
      "Participate in hands-on activities with care and attention",
      "Don't interrupt performances or ceremonies",
      "Be mindful that these are living cultures, not just entertainment",
      "Support the educational mission by learning about each culture",
      "Dress modestly and appropriately for cultural activities"
    ],
    bestTimeToVisit: "Full day recommended. Afternoon arrival for village activities, evening for dinner show and performances.",
    crowdLevel: "High",
    sustainabilityTips: [
      "Support Pacific Islander cultural preservation through admission",
      "Choose group tours to reduce individual environmental impact",
      "Respect traditional fishing and farming practices demonstrated",
      "Support students by purchasing authentic cultural crafts",
      "Use reusable water bottles at refill stations",
      "Follow all environmental guidelines in lagoon and beach areas"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Wheelchair accessible throughout. Accessible restrooms and dining. Some cultural activities may have physical requirements.",
    estimatedVisitDuration: "6-8 hours for full experience with dinner show",
    nearbyAmenities: ["Multiple restaurants", "Gift shops", "Cultural demonstrations", "Canoe rides", "IMAX theater", "Parking included"],
    activities: ["Cultural village tours", "Traditional craft workshops", "Polynesian performances", "Canoe pageant", "IMAX films", "Luau dinner show"],
    entryFee: "Adults $69.95-$249.95 depending on package. Children and military discounts available.",
    parkingInfo: "Free parking included with admission. Large parking area accommodates buses and RVs.",
    bestPhotographySpots: ["Cultural village demonstrations", "Traditional performances", "Canoe pageant", "Sunset over lagoon", "Authentic Pacific Islander crafts"]
  },

  {
    name: "Chinatown Honolulu",
    aliases: ["Chinatown", "Downtown Chinatown", "Historic Chinatown"],
    coordinates: [-157.8614, 21.3136],
    category: "Cultural",
    description: "Historic cultural district featuring authentic Asian markets, traditional shops, art galleries, restaurants, and cultural sites. One of the oldest Chinatowns in America with rich multicultural heritage.",
    busRoutes: ["1", "2", "3", "9", "13", "20", "42"],
    culturalSignificance: "Established in the 1860s by Chinese immigrants working on sugar plantations. Now represents diverse Asian Pacific cultures including Chinese, Vietnamese, Filipino, Thai, and Hawaiian communities.",
    historicalContext: "Survived two major fires (1886, 1900) and numerous urban renewal threats. Designated National Historic Landmark. Hub of cultural preservation and contemporary Asian American arts.",
    respectfulVisitingTips: [
      "Support local family-owned businesses and restaurants",
      "Be respectful when photographing people and businesses",
      "Learn basic greetings in different languages (nihao, chao, kumusta)",
      "Respect religious sites including temples and shrines",
      "Don't touch items in traditional shops without permission",
      "Be aware of cultural practices around food and dining",
      "Support local artists and cultural organizations"
    ],
    bestTimeToVisit: "Morning (9:00-11:00 AM) for markets and fresh goods, or First Friday evening for art walk",
    crowdLevel: "Variable",
    sustainabilityTips: [
      "Support local immigrant-owned businesses",
      "Choose restaurants using local Hawaii ingredients",
      "Buy local art and crafts rather than mass-produced items",
      "Use reusable bags when shopping at markets",
      "Walk or use public transit to reduce traffic in dense area",
      "Support cultural preservation efforts through purchases and donations"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Sidewalks and main areas accessible. Some older buildings may have accessibility challenges. Street parking and bus access available.",
    estimatedVisitDuration: "2-4 hours for cultural exploration, longer during events",
    nearbyAmenities: ["Traditional markets", "Authentic restaurants", "Art galleries", "Cultural centers", "Temples and shrines", "Street parking and bus stops"],
    activities: ["Market exploration", "Art gallery tours", "Traditional dining", "Cultural shopping", "First Friday art walks", "Temple visits"],
    entryFee: "Free (public area)",
    parkingInfo: "Metered street parking and municipal lots available. Consider public transportation due to traffic congestion.",
    bestPhotographySpots: ["Traditional storefronts", "Market vendors", "Street art and murals", "Cultural architecture", "First Friday art events"]
  },

  // === MUSEUMS & EDUCATIONAL ===
  {
    name: "Bishop Museum",
    aliases: ["Bernice Pauahi Bishop Museum", "Hawaii State Museum"],
    coordinates: [-157.8719, 21.3364],
    category: "Museum",
    description: "Hawaii's premier natural and cultural history museum featuring world's largest collection of Polynesian artifacts, planetarium shows, and interactive science exhibits. Official State Museum of Hawaii.",
    busRoutes: ["1", "2", "13"],
    hawaiianName: "Hale Ho'olaule'a",
    pronunciation: "hah-leh hoh-oh-lah-oo-leh-ah",
    culturalSignificance: "Founded in 1889 to honor Princess Bernice Pauahi Bishop and preserve Hawaiian culture. Houses sacred artifacts and genealogical records essential to Native Hawaiian identity.",
    historicalContext: "Built by Charles Reed Bishop in memory of his wife, the last descendant of the royal Kamehameha family. Houses priceless Hawaiian artifacts including royal feather cloaks and ancient weapons.",
    respectfulVisitingTips: [
      "Show special respect in Hawaiian Hall with sacred artifacts",
      "Don't touch exhibits unless specifically marked as interactive",
      "Maintain quiet voices, especially around cultural displays",
      "Learn about proper pronunciation of Hawaiian names and places",
      "Support the museum's cultural preservation mission",
      "Be respectful of Native Hawaiian visitors connecting with their heritage",
      "Ask questions during guided tours to deepen understanding"
    ],
    bestTimeToVisit: "Weekday mornings (10:00 AM-12:00 PM) for smaller crowds and better access to staff",
    crowdLevel: "Medium",
    sustainabilityTips: [
      "Support cultural and scientific preservation through admission and donations",
      "Choose digital guides and materials when available",
      "Use public transportation to reduce parking demand",
      "Support museum's native plant garden and conservation efforts",
      "Purchase books and educational materials from museum store",
      "Participate in citizen science programs if available"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Fully wheelchair accessible. Elevators, accessible parking, and assistive listening devices available. Large print guides available.",
    estimatedVisitDuration: "3-5 hours for comprehensive visit including planetarium",
    nearbyAmenities: ["Museum cafe", "Gift shop with Hawaiian crafts", "Research library", "Parking garage", "Planetarium", "Garden areas"],
    activities: ["Hawaiian Hall exploration", "Planetarium shows", "Science demonstrations", "Cultural workshops", "Garden tours", "Special exhibitions"],
    entryFee: "Adults $24.95, Children $16.95, Hawaii residents receive discounts",
    parkingInfo: "On-site parking garage ($5). Limited street parking available. Bus transportation recommended.",
    bestPhotographySpots: ["Hawaiian Hall interior", "Royal feather cloaks", "Planetarium dome", "Science exhibits", "Museum architecture"]
  },

  // === LOCAL FOOD EXPERIENCES ===
  {
    name: "KCC Farmers Market",
    aliases: ["Kapiolani Community College Farmers Market", "Saturday Farmers Market", "KCC Market"],
    coordinates: [-157.8159, 21.2733],
    category: "Food",
    description: "Hawaii's premier farmers market featuring local produce, prepared foods, and artisanal products. Every Saturday morning, showcasing the best of Hawaii's agricultural diversity and culinary creativity.",
    busRoutes: ["14", "23"],
    culturalSignificance: "Represents Hawaii's agricultural heritage and local food movement. Supports small farmers, local food producers, and sustainable agriculture practices in Hawaii.",
    historicalContext: "Started in 1979 as a way to support local farmers and educate community about local food systems. Became model for farmers markets throughout Hawaii and Pacific.",
    respectfulVisitingTips: [
      "Bring cash - many vendors don't accept cards",
      "Arrive early (8:00-9:00 AM) for best selection before items sell out",
      "Respect vendors' cultural backgrounds and food traditions",
      "Don't sample without asking permission",
      "Support local farmers by choosing Hawaii-grown produce",
      "Be patient during busy periods and respect lines",
      "Learn about Hawaiian food traditions and ingredients"
    ],
    bestTimeToVisit: "Early Saturday morning (7:30-9:00 AM) for best selection and cooler weather",
    crowdLevel: "High",
    sustainabilityTips: [
      "Choose locally grown and organic produce to support sustainable farming",
      "Bring reusable bags and containers",
      "Compost organic waste properly",
      "Support vendors using sustainable and traditional farming methods",
      "Choose seasonal items to reduce environmental impact",
      "Learn about traditional Hawaiian food plants and their uses"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Outdoor market on paved surfaces. Accessible parking available. Some vendor stalls may have accessibility challenges.",
    estimatedVisitDuration: "1-3 hours depending on shopping and dining",
    nearbyAmenities: ["Public restrooms", "Parking area", "Diamond Head nearby", "Kahala Mall area", "Various food vendors"],
    activities: ["Fresh produce shopping", "Local food sampling", "Artisan craft shopping", "Cultural food education", "Supporting local agriculture"],
    entryFee: "Free entry (individual vendor pricing)",
    parkingInfo: "Free parking at KCC. Arrives fills early (by 8:30 AM). Limited street parking nearby.",
    bestPhotographySpots: ["Colorful produce displays", "Local vendors and farmers", "Unique Hawaii fruits and vegetables", "Food preparation", "Community interactions"]
  },

  {
    name: "Leonard's Bakery Malasada",
    aliases: ["Leonard's Bakery", "Malasada Shop", "Portuguese Donuts"],
    coordinates: [-157.8267, 21.3019],
    category: "Food",
    description: "Iconic Hawaii bakery since 1952, famous for fresh malasadas (Portuguese donuts). Local institution serving traditional and filled malasadas, plus Portuguese sweet bread and local favorites.",
    busRoutes: ["1", "2", "3", "4"],
    culturalSignificance: "Represents Portuguese immigrant heritage in Hawaii. Malasadas became local comfort food, especially popular on Shrove Tuesday and as after-school treats for generations of Hawaii families.",
    historicalContext: "Founded by Leonard and Margaret Rego, Portuguese immigrants. Family recipes passed down through generations. Became cultural icon representing Hawaii's diverse immigrant food heritage.",
    respectfulVisitingTips: [
      "Be patient - malasadas are made fresh and may take time",
      "Don't expect quiet atmosphere - it's a busy local institution",
      "Support the family business and local tradition",
      "Try traditional flavors before exotic ones to appreciate heritage",
      "Respect local customers who may be regulars for decades",
      "Learn about Portuguese immigration to Hawaii",
      "Bring cash for faster service"
    ],
    bestTimeToVisit: "Early morning (7:00-9:00 AM) for freshest malasadas, or avoid school hours (3:00-4:00 PM) for shorter lines",
    crowdLevel: "High",
    sustainabilityTips: [
      "Support this local family business over chain alternatives",
      "Choose reusable containers when possible",
      "Walk or bike if nearby to reduce car trips",
      "Appreciate traditional recipes and local food heritage",
      "Share with others to reduce waste",
      "Learn about sustainable food traditions"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Small shop with counter service. May have limited space for wheelchairs during busy periods. Sidewalk access available.",
    estimatedVisitDuration: "15-30 minutes for ordering and eating",
    nearbyAmenities: ["Street parking", "Nearby shops and restaurants", "Bus stops", "Residential area"],
    activities: ["Fresh malasada tasting", "Portuguese sweet bread sampling", "Local culture experience", "Traditional bakery shopping"],
    entryFee: "Individual item pricing ($1.50-$4.00 per malasada)",
    parkingInfo: "Limited street parking. High turnover during busy periods. Consider walking or bus if staying nearby.",
    bestPhotographySpots: ["Fresh malasadas being made", "Display case with varieties", "Historic bakery storefront", "Local customers enjoying treats"]
  },

  // === WEST SIDE ATTRACTIONS ===
  {
    name: "Ko Olina Lagoons",
    aliases: ["Ko Olina", "Ko Olina Beach", "Four Lagoons", "Disney Aulani Area"],
    coordinates: [-158.1223, 21.3356],
    category: "Beach",
    description: "Four pristine man-made lagoons with calm, protected waters perfect for families. White sand beaches, luxury resorts, and excellent snorkeling in crystal-clear water with tropical fish.",
    busRoutes: ["40", "C"],
    hawaiianName: "Ko 'Olina",
    pronunciation: "koh oh-LEE-nah",
    culturalSignificance: "Means 'place of joy' in Hawaiian. Originally fishponds created by ancient Hawaiians, later developed as luxury resort area while maintaining public beach access.",
    historicalContext: "Traditional Hawaiian fishing area with ancient fishponds. Developed in 1990s as planned resort community. Lagoons engineered to create calm waters while maintaining ocean circulation.",
    respectfulVisitingTips: [
      "Respect this is a residential and resort area - follow posted rules",
      "Share beach space courteously with resort guests and locals",
      "Don't remove coral, sand, or rocks from lagoons",
      "Be mindful of families with small children in calm waters",
      "Respect private resort areas while enjoying public beach access",
      "Keep noise levels appropriate for family-friendly environment",
      "Support local businesses and food vendors"
    ],
    bestTimeToVisit: "Morning (8:00-11:00 AM) for calm conditions and parking availability, or late afternoon for sunset",
    crowdLevel: "Variable",
    sustainabilityTips: [
      "Use only reef-safe, mineral sunscreen to protect lagoon ecosystem",
      "Don't feed fish or disturb marine life",
      "Pack out all trash and recyclables",
      "Use reusable water bottles and containers",
      "Respect engineered ecosystem that maintains water quality",
      "Support resort sustainability programs when staying nearby"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Paved pathways to beaches. Beach wheelchairs may be available at resorts. Accessible parking and restrooms at resort areas.",
    estimatedVisitDuration: "3-6 hours for full lagoon experience",
    nearbyAmenities: ["Disney Aulani Resort", "Four Seasons Resort", "Restaurants and shops", "Public restrooms and showers", "Parking areas"],
    activities: ["Swimming in calm lagoons", "Snorkeling", "Family beach activities", "Sunset viewing", "Resort dining", "Beach walking between lagoons"],
    entryFee: "Free (public beach access)",
    parkingInfo: "Public parking available but limited and fills early on weekends. Some resort parking available for guests and dining customers.",
    bestPhotographySpots: ["Four lagoons panorama", "Sunset over lagoons", "Families enjoying calm water", "Resort architecture", "Clear water and marine life"]
  },

  {
    name: "Dole Plantation",
    aliases: ["Dole", "Pineapple Plantation", "Dole Pineapple Experience"],
    coordinates: [-158.0376, 21.5254],
    category: "Attraction",
    description: "Historic pineapple plantation offering three attractions: world's largest maze, Pineapple Express train tour, and Plantation Garden tour. Educational experience about Hawaii's pineapple history and agriculture.",
    busRoutes: ["52"],
    culturalSignificance: "Represents Hawaii's agricultural heritage and the pineapple industry that shaped Hawaii's economy from 1900-1990s. Educational center for sustainable agriculture and Hawaiian farming history.",
    historicalContext: "Founded by James Dole in 1900, became symbol of Hawaii agriculture worldwide. While commercial pineapple farming largely moved overseas, site preserves agricultural heritage and education.",
    respectfulVisitingTips: [
      "Stay on designated paths in maze and gardens to protect plants",
      "Don't pick pineapples or other plants without permission",
      "Follow all safety guidelines on train tour",
      "Be respectful of agricultural workers if present",
      "Learn about sustainable farming practices demonstrated",
      "Support educational mission through purchases and participation",
      "Be patient during busy periods and respect capacity limits"
    ],
    bestTimeToVisit: "Morning (9:00-11:00 AM) for cooler weather and shorter lines, especially for maze",
    crowdLevel: "High",
    sustainabilityTips: [
      "Support sustainable agriculture education through admission",
      "Learn about water conservation and sustainable farming practices",
      "Choose locally grown pineapple products over imported alternatives",
      "Use reusable water bottles and containers",
      "Respect native and introduced plant species in gardens",
      "Support agricultural preservation in Hawaii"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Paved pathways for most areas. Train and garden tours wheelchair accessible. Maze has narrow paths that may be challenging for wheelchairs.",
    estimatedVisitDuration: "2-4 hours for all three attractions",
    nearbyAmenities: ["Gift shop with pineapple products", "Snack bar and restaurant", "Large parking area", "Restrooms", "Picnic areas"],
    activities: ["World's largest maze challenge", "Train tour of plantation", "Garden tour with tropical plants", "Pineapple cutting demonstration", "Shopping for local products"],
    entryFee: "Individual attractions $7-$13, combo packages available. Free admission to grounds and gift shop.",
    parkingInfo: "Large free parking area. Rarely fills completely except during peak holiday periods.",
    bestPhotographySpots: ["Pineapple fields and plants", "Historic train and tracks", "Maze aerial views", "Garden tropical plants", "Family activities and demonstrations"]
  }

  // Additional destinations would continue with similar detailed information...
];

// Utility functions for filtering and searching destinations
export function getDestinationsByCategory(
  category: string,
  userLocation?: [number, number]
): TouristDestination[] {
  let filtered = TOURIST_DESTINATIONS.filter(dest => 
    dest.category.toLowerCase() === category.toLowerCase()
  );
  
  if (userLocation) {
    // Sort by distance from user location
    filtered.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
  }
  
  return filtered;
}

export function getDestinationsByTimeOfDay(
  hour: number,
  userLocation?: [number, number]
): TouristDestination[] {
  let recommendations: TouristDestination[] = [];
  
  if (hour >= 5 && hour <= 8) {
    // Early morning - hiking and sunrise spots
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.bestTimeToVisit?.includes('morning') || 
      dest.bestTimeToVisit?.includes('sunrise')
    );
  } else if (hour >= 9 && hour <= 15) {
    // Day time - beaches and outdoor activities
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.category === 'Beach' || dest.category === 'Hiking'
    );
  } else if (hour >= 16 && hour <= 19) {
    // Evening - sunset spots and cultural sites
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.bestTimeToVisit?.includes('sunset') || 
      dest.category === 'Cultural' || 
      dest.category === 'Historical'
    );
  }
  
  if (userLocation) {
    recommendations.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
  }
  
  return recommendations.slice(0, 10);
}

export function getDestinationsByRegion(region: string): TouristDestination[] {
  // This would be enhanced with region mapping based on coordinates
  return TOURIST_DESTINATIONS.filter(dest => {
    // Simple regional filtering based on coordinates
    const [lng, lat] = dest.coordinates;
    
    switch (region.toLowerCase()) {
      case 'honolulu':
        return lng > -157.9 && lat < 21.35;
      case 'windward':
        return lng > -157.8 && lat > 21.35;
      case 'north shore':
        return lat > 21.6;
      case 'west side':
        return lng < -158.0;
      default:
        return true;
    }
  });
}

export function getCrowdAwareAlternatives(
  destination: TouristDestination
): TouristDestination[] {
  if (destination.crowdLevel === 'High') {
    // Return similar destinations with lower crowd levels
    return TOURIST_DESTINATIONS.filter(dest => 
      dest.category === destination.category &&
      dest.name !== destination.name &&
      dest.crowdLevel !== 'High'
    ).slice(0, 3);
  }
  return [];
}

export function searchDestinations(
  query: string,
  userLocation?: [number, number]
): TouristDestination[] {
  const searchTerm = query.toLowerCase();
  let results = TOURIST_DESTINATIONS.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm) ||
    dest.aliases.some(alias => alias.toLowerCase().includes(searchTerm)) ||
    dest.hawaiianName?.toLowerCase().includes(searchTerm) ||
    dest.description.toLowerCase().includes(searchTerm) ||
    dest.category.toLowerCase().includes(searchTerm)
  );
  
  if (userLocation) {
    results.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
  }
  
  return results;
}

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getNearbyDestinations(
  userLocation: [number, number],
  radiusKm: number = 5
): TouristDestination[] {
  return TOURIST_DESTINATIONS.filter(dest => {
    const distance = calculateDistance(userLocation, dest.coordinates);
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distA = calculateDistance(userLocation, a.coordinates);
    const distB = calculateDistance(userLocation, b.coordinates);
    return distA - distB;
  });
}

export function findDestination(query: string): TouristDestination | undefined {
  const searchTerm = query.toLowerCase();
  return TOURIST_DESTINATIONS.find(dest =>
    dest.name.toLowerCase() === searchTerm ||
    dest.aliases.some(alias => alias.toLowerCase() === searchTerm) ||
    dest.hawaiianName?.toLowerCase() === searchTerm
  );
}