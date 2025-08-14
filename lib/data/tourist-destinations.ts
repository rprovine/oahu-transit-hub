// Precise tourist destination coordinates for Oahu
// These are verified, accurate locations for popular tourist spots

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
}

export const TOURIST_DESTINATIONS: TouristDestination[] = [
  {
    name: "Diamond Head State Monument",
    aliases: ["Diamond Head", "Diamond Head Crater", "Le'ahi"],
    coordinates: [-157.8046, 21.2614], // Actual Diamond Head entrance
    category: "Attraction",
    description: "Iconic volcanic crater and hiking trail",
    busRoutes: ["23", "24"],
    hawaiianName: "Lē'ahi",
    pronunciation: "lay-AH-hee",
    culturalSignificance: "Named for the yellow fin tuna (ahi) because the crater's profile resembles the dorsal fin of the fish. Sacred site with ancient Hawaiian significance.",
    respectfulVisitingTips: [
      "Start early to avoid crowds and heat",
      "Bring water and wear proper hiking shoes",
      "Stay on designated trails to protect native plants",
      "Respect any cultural or spiritual practices you may encounter"
    ],
    bestTimeToVisit: "Early morning (6:00-8:00 AM) for sunrise and cooler temperatures",
    crowdLevel: "High",
    sustainabilityTips: [
      "Take only photos, leave only footprints",
      "Use reef-safe sunscreen before hiking",
      "Pack out all trash including food scraps"
    ],
    safetyLevel: "Medium",
    accessibilityInfo: "Steep, uneven trail with stairs. Not wheelchair accessible.",
    estimatedVisitDuration: "2-3 hours"
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
    busRoutes: ["20", "42"],
    hawaiianName: "Pu'uloa",
    pronunciation: "poo-oo-LOH-ah",
    culturalSignificance: "Originally called Pu'uloa meaning 'long hill' or 'curved hill.' Sacred place in Hawaiian culture, later became site of tragic historical events.",
    respectfulVisitingTips: [
      "Maintain quiet, respectful behavior throughout the memorial",
      "No bags allowed - use storage facility or travel light",
      "Arrive early for timed tickets to USS Arizona Memorial",
      "Dress appropriately - no swimwear or revealing clothing",
      "Turn off cell phones during memorial presentations"
    ],
    bestTimeToVisit: "Morning (8:00-11:00 AM) for cooler weather and shorter lines",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use public transportation to reduce traffic impact",
      "Bring reusable water bottle (fill at visitor center)",
      "Choose digital tickets when available"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Fully wheelchair accessible. Assistive listening devices available.",
    estimatedVisitDuration: "4-6 hours"
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
    busRoutes: ["22"],
    hawaiianName: "Hanauma",
    pronunciation: "hah-now-mah",
    culturalSignificance: "Means 'curved bay' in Hawaiian. Sacred snorkeling site with protected marine ecosystem.",
    respectfulVisitingTips: [
      "Watch required educational video before entering",
      "No touching or standing on coral",
      "Do not feed fish or marine animals",
      "Respect marked conservation areas"
    ],
    bestTimeToVisit: "Early morning (7:00-9:00 AM) for clearest water and fewer crowds",
    crowdLevel: "High",
    sustainabilityTips: [
      "Use only reef-safe, mineral sunscreen",
      "Do not bring single-use plastics",
      "Follow all marine conservation guidelines",
      "Consider visiting less crowded beaches to reduce impact"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Steep walk down to beach. Shuttle available for those with mobility challenges.",
    estimatedVisitDuration: "3-5 hours"
  },
  {
    name: "Lanikai Beach",
    aliases: ["Lanikai", "Kailua Beach"],
    coordinates: [-157.7126, 21.3925], // Beach access point
    category: "Beach",
    description: "Pristine beach with turquoise waters",
    busRoutes: ["56", "57", "70"],
    hawaiianName: "Lanikai",
    pronunciation: "LAH-nee-kai",
    culturalSignificance: "Means 'heavenly ocean' in Hawaiian. This area was traditionally used for fishing and gathering by Native Hawaiians.",
    respectfulVisitingTips: [
      "Respect private beach access through residential areas",
      "Keep noise levels low in residential neighborhoods",
      "Do not take sand, rocks, or coral as souvenirs",
      "Be mindful of nesting seabirds and monk seals"
    ],
    bestTimeToVisit: "Early morning (6:00-9:00 AM) for fewer crowds and optimal lighting",
    crowdLevel: "Medium",
    sustainabilityTips: [
      "Use reef-safe, mineral-based sunscreen only",
      "Do not feed or touch marine life",
      "Pack out all trash including cigarette butts",
      "Use reusable water bottles to reduce plastic waste"
    ],
    safetyLevel: "High",
    accessibilityInfo: "Soft sand beach access. Beach wheelchairs may be available at nearby Kailua Beach Park.",
    estimatedVisitDuration: "2-4 hours"
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
  },
  
  // === BEACHES - SOUTH SHORE ===
  {
    name: "Keeaumoku Beach",
    aliases: ["Keeaumoku", "Magic Island Lagoon"],
    coordinates: [-157.8493, 21.2885],
    category: "Beach",
    description: "Calm lagoon perfect for families with small children",
    busRoutes: ["8", "19", "20", "42"],
    hawaiianName: "Keeaumoku",
    pronunciation: "keh-eh-ah-oo-moh-koo",
    culturalSignificance: "Man-made lagoon at Ala Moana Beach Park, popular with local families.",
    bestTimeToVisit: "Afternoon for calm waters",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "2-3 hours"
  },
  {
    name: "Sand Island Beach Park",
    aliases: ["Sand Island"],
    coordinates: [-157.8833, 21.3019],
    category: "Beach",
    description: "Local beach with picnic areas and city views",
    busRoutes: ["19", "20"],
    hawaiianName: "Sand Island",
    pronunciation: "sand EYE-land",
    culturalSignificance: "Popular local spot for fishing and family gatherings.",
    bestTimeToVisit: "Sunset for city skyline views",
    crowdLevel: "Low",
    safetyLevel: "High",
    estimatedVisitDuration: "2-4 hours"
  },
  {
    name: "Keehole Point Beach",
    aliases: ["Diamond Head Beach", "Kuilei Cliffs"],
    coordinates: [-157.8087, 21.2581],
    category: "Beach",
    description: "Secluded beach below Diamond Head with great snorkeling",
    busRoutes: ["23"],
    hawaiianName: "Keehole",
    pronunciation: "keh-eh-HOH-leh",
    culturalSignificance: "Hidden gem below Diamond Head, less crowded alternative.",
    bestTimeToVisit: "Morning for calm conditions",
    crowdLevel: "Low",
    safetyLevel: "Medium",
    estimatedVisitDuration: "2-3 hours"
  },
  
  // === BEACHES - WINDWARD SIDE ===
  {
    name: "Kailua Beach Park",
    aliases: ["Kailua Beach", "Kailua Bay"],
    coordinates: [-157.7394, 21.3972],
    category: "Beach",
    description: "World-renowned beach with powdery white sand",
    busRoutes: ["56", "57", "70"],
    hawaiianName: "Kailua",
    pronunciation: "kai-LOO-ah",
    culturalSignificance: "Means 'two seas' referring to the two bodies of water that flow into Kailua Bay.",
    bestTimeToVisit: "Early morning (7:00-10:00 AM)",
    crowdLevel: "High",
    safetyLevel: "High",
    sustainabilityTips: ["Use reef-safe sunscreen", "Respect beach access through neighborhoods"],
    estimatedVisitDuration: "3-6 hours"
  },
  {
    name: "Bellows Beach",
    aliases: ["Bellows Field Beach Park"],
    coordinates: [-157.7144, 21.3711],
    category: "Beach",
    description: "Military beach open to public on weekends",
    busRoutes: ["57"],
    hawaiianName: "Bellows",
    culturalSignificance: "Military recreation area, weekend access only for civilians.",
    bestTimeToVisit: "Weekends only (Friday-Sunday)",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "4-6 hours"
  },
  {
    name: "Waimanalo Beach",
    aliases: ["Waimanalo Bay Beach Park"],
    coordinates: [-157.7067, 21.3389],
    category: "Beach",
    description: "Long sandy beach popular with locals",
    busRoutes: ["57"],
    hawaiianName: "Waimānalo",
    pronunciation: "why-mah-nah-loh",
    culturalSignificance: "Means 'potable water' in Hawaiian. Important Native Hawaiian homestead community.",
    bestTimeToVisit: "Morning to avoid afternoon trade winds",
    crowdLevel: "Medium",
    safetyLevel: "High",
    respectfulVisitingTips: ["Respect local community", "Be mindful this is a residential area"],
    estimatedVisitDuration: "3-5 hours"
  },
  
  // === BEACHES - NORTH SHORE ===
  {
    name: "Pipeline Beach",
    aliases: ["Banzai Pipeline", "Ehukai Beach"],
    coordinates: [-158.0567, 21.6581],
    category: "Beach",
    description: "World-famous surfing spot with powerful waves",
    busRoutes: ["52", "55"],
    hawaiianName: "'Ehukai",
    pronunciation: "eh-hoo-kai",
    culturalSignificance: "Sacred surfing grounds, respect surf culture and lineup.",
    bestTimeToVisit: "Winter months for big surf viewing",
    crowdLevel: "High",
    safetyLevel: "Caution",
    respectfulVisitingTips: ["Never turn back on ocean", "Respect surfers", "Dangerous swimming conditions"],
    estimatedVisitDuration: "2-4 hours"
  },
  {
    name: "Waimea Bay Beach",
    aliases: ["Waimea Bay"],
    coordinates: [-158.0644, 21.6417],
    category: "Beach",
    description: "Historic bay with rock jumping and big wave surfing",
    busRoutes: ["52", "55"],
    hawaiianName: "Waimea",
    pronunciation: "why-MEH-ah",
    culturalSignificance: "Means 'reddish water' in Hawaiian. Historic landing site of early Polynesian voyagers.",
    bestTimeToVisit: "Summer for swimming, winter for wave watching",
    crowdLevel: "High",
    safetyLevel: "Medium",
    estimatedVisitDuration: "3-5 hours"
  },
  {
    name: "Haleiwa Beach Park",
    aliases: ["Haleiwa Harbor"],
    coordinates: [-158.1081, 21.5947],
    category: "Beach",
    description: "Protected harbor beach perfect for families",
    busRoutes: ["52", "55"],
    hawaiianName: "Hale'iwa",
    pronunciation: "hah-leh-EE-vah",
    culturalSignificance: "Means 'house of the frigate bird' in Hawaiian. Historic North Shore town.",
    bestTimeToVisit: "Anytime - protected from big waves",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "2-4 hours"
  },
  
  // === BEACHES - WEST SIDE ===
  {
    name: "Ko Olina Lagoon 1",
    aliases: ["Ko Olina", "Lagoon One"],
    coordinates: [-158.1223, 21.3356],
    category: "Beach",
    description: "Man-made lagoon with calm waters",
    busRoutes: ["40", "C"],
    hawaiianName: "Ko 'Olina",
    pronunciation: "koh oh-LEE-nah",
    culturalSignificance: "Means 'place of joy' in Hawaiian. Modern resort development.",
    bestTimeToVisit: "Afternoon for sunset views",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "2-4 hours"
  },
  {
    name: "Makaha Beach",
    aliases: ["Makaha"],
    coordinates: [-158.2256, 21.4633],
    category: "Beach",
    description: "West side surfing beach with local vibe",
    busRoutes: ["51"],
    hawaiianName: "Mākaha",
    pronunciation: "mah-KAH-hah",
    culturalSignificance: "Means 'fierce' or 'savage' in Hawaiian, referring to currents and waves.",
    bestTimeToVisit: "Morning for calmer conditions",
    crowdLevel: "Low",
    safetyLevel: "Medium",
    respectfulVisitingTips: ["Respect local surf culture", "Be cautious of strong currents"],
    estimatedVisitDuration: "3-5 hours"
  },
  
  // === CULTURAL ATTRACTIONS ===
  {
    name: "Bishop Museum",
    aliases: ["Bernice Pauahi Bishop Museum"],
    coordinates: [-157.8708, 21.3361],
    category: "Museum",
    description: "Premier natural and cultural history museum of Hawaii",
    busRoutes: ["1", "2"],
    hawaiianName: "Hale Hōknā",
    pronunciation: "hah-leh oh-koo-nah",
    culturalSignificance: "Founded in 1889, houses world's largest collection of Polynesian cultural artifacts.",
    bestTimeToVisit: "Morning for planetarium shows",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "3-4 hours"
  },
  {
    name: "Shangri La Museum",
    aliases: ["Doris Duke's Shangri La"],
    coordinates: [-157.8167, 21.2644],
    category: "Museum",
    description: "Islamic art museum in stunning oceanfront setting",
    busRoutes: ["23"],
    culturalSignificance: "Features one of the finest collections of Islamic art outside the Middle East.",
    bestTimeToVisit: "Advanced reservations required",
    crowdLevel: "Low",
    safetyLevel: "High",
    estimatedVisitDuration: "2.5 hours"
  },
  {
    name: "Honolulu Museum of Art",
    aliases: ["HoMA"],
    coordinates: [-157.8481, 21.3031],
    category: "Museum",
    description: "Premier art museum with Asian and Western collections",
    busRoutes: ["1", "2", "3", "13"],
    culturalSignificance: "Founded in 1922, showcases art from around the Pacific Rim.",
    bestTimeToVisit: "Weekday mornings",
    crowdLevel: "Low",
    safetyLevel: "High",
    estimatedVisitDuration: "2-3 hours"
  },
  {
    name: "Kawaiahao Church",
    aliases: ["Westminster Abbey of Hawaii"],
    coordinates: [-157.8583, 21.3036],
    category: "Historical",
    description: "Historic coral block church, Hawaii's first Christian church",
    busRoutes: ["1", "2", "3", "13"],
    hawaiianName: "Kawaihao",
    pronunciation: "kah-vah-ee-ah-HAH-oh",
    culturalSignificance: "Built in 1842, site of Hawaiian royal ceremonies and historic events.",
    bestTimeToVisit: "Sunday services for cultural experience",
    crowdLevel: "Low",
    safetyLevel: "High",
    respectfulVisitingTips: ["Dress respectfully", "Maintain quiet reverence"],
    estimatedVisitDuration: "1 hour"
  },
  {
    name: "Royal Mausoleum",
    aliases: ["Mauna Ala"],
    coordinates: [-157.8583, 21.3233],
    category: "Historical",
    description: "Final resting place of Hawaiian royalty",
    busRoutes: ["1", "4"],
    hawaiianName: "Mauna 'Ala",
    pronunciation: "mah-oo-nah AH-lah",
    culturalSignificance: "Sacred burial ground of Hawaiian ali'i (royalty). Most sacred site in Hawaii.",
    bestTimeToVisit: "Respectful daytime visits only",
    crowdLevel: "Low",
    safetyLevel: "High",
    respectfulVisitingTips: ["Maintain utmost reverence", "No loud voices", "Respect cultural protocols"],
    estimatedVisitDuration: "30-45 minutes"
  },
  
  // === NATURE & HIKING ===
  {
    name: "Lyon Arboretum",
    aliases: ["University of Hawaii Lyon Arboretum"],
    coordinates: [-157.8022, 21.3311],
    category: "Nature",
    description: "194-acre botanical garden and research facility",
    busRoutes: ["5"],
    culturalSignificance: "Preserves native Hawaiian plants and showcases tropical flora from around the world.",
    bestTimeToVisit: "Morning for cooler temperatures",
    crowdLevel: "Low",
    safetyLevel: "High",
    estimatedVisitDuration: "2-3 hours"
  },
  {
    name: "Nuuanu Pali Lookout",
    aliases: ["Pali Lookout"],
    coordinates: [-157.7925, 21.3653],
    category: "Viewpoint",
    description: "Historic mountain pass with windward views",
    busRoutes: ["55", "65"],
    hawaiianName: "Nu'uanu Pali",
    pronunciation: "noo-oo-AH-noo PAH-lee",
    culturalSignificance: "Site of historic 1795 battle where King Kamehameha I conquered Oahu.",
    bestTimeToVisit: "Clear days for best views",
    crowdLevel: "Medium",
    safetyLevel: "High",
    respectfulVisitingTips: ["Respect historical significance", "Be prepared for strong winds"],
    estimatedVisitDuration: "1 hour"
  },
  {
    name: "Lanikai Pillboxes",
    aliases: ["Kaiwa Ridge Trail", "Pillbox Hike"],
    coordinates: [-157.7267, 21.3983],
    category: "Hiking",
    description: "Short hike to WWII bunkers with panoramic views",
    busRoutes: ["56", "57"],
    culturalSignificance: "WWII military observation posts, now popular viewpoint.",
    bestTimeToVisit: "Early morning or late afternoon",
    crowdLevel: "High",
    safetyLevel: "Medium",
    estimatedVisitDuration: "2-3 hours"
  },
  
  // === LOCAL FOOD - HONOLULU ===
  {
    name: "Leonard's Bakery",
    aliases: ["Leonard's Malasadas"],
    coordinates: [-157.8236, 21.2961],
    category: "Food",
    description: "Famous malasadas since 1952",
    busRoutes: ["4", "18"],
    hawaiianName: "Leonard's",
    culturalSignificance: "Portuguese donut shop beloved by locals for over 70 years.",
    bestTimeToVisit: "Morning when malasadas are fresh",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "30 minutes"
  },
  {
    name: "Rainbow Drive-In",
    aliases: ["Rainbow Drive In"],
    coordinates: [-157.8458, 21.2886],
    category: "Food",
    description: "Local plate lunch institution since 1961",
    busRoutes: ["8", "19", "20"],
    culturalSignificance: "Obama's childhood favorite, iconic local drive-in.",
    bestTimeToVisit: "Lunch time (11 AM - 2 PM)",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "45 minutes"
  },
  {
    name: "Helena's Hawaiian Food",
    aliases: ["Helena's"],
    coordinates: [-157.8592, 21.3242],
    category: "Food",
    description: "James Beard Award winner serving traditional Hawaiian food",
    busRoutes: ["1", "4"],
    hawaiianName: "Helena's",
    culturalSignificance: "Family-owned since 1946, authentic Hawaiian cuisine preserving traditional recipes.",
    bestTimeToVisit: "Lunch or early dinner",
    crowdLevel: "Medium",
    safetyLevel: "High",
    respectfulVisitingTips: ["Try poi and traditional dishes", "Respect cultural food traditions"],
    estimatedVisitDuration: "1-1.5 hours"
  },
  {
    name: "Ted's Bakery",
    aliases: ["Ted's Chocolate Haupia Pie"],
    coordinates: [-158.0444, 21.5944],
    category: "Food",
    description: "Famous for chocolate haupia pie and plate lunches",
    busRoutes: ["52", "55"],
    culturalSignificance: "North Shore institution famous for haupia (coconut) desserts.",
    bestTimeToVisit: "After beach activities",
    crowdLevel: "High",
    safetyLevel: "High",
    estimatedVisitDuration: "30-45 minutes"
  },
  {
    name: "Giovanni's Shrimp Truck",
    aliases: ["Giovanni's Kahuku"],
    coordinates: [-157.9528, 21.6831],
    category: "Food",
    description: "Original garlic shrimp truck",
    busRoutes: ["55"],
    culturalSignificance: "Started the North Shore food truck phenomenon in 1993.",
    bestTimeToVisit: "Lunch time",
    crowdLevel: "High",
    safetyLevel: "High",
    estimatedVisitDuration: "30 minutes"
  },
  {
    name: "Ono Seafood",
    aliases: ["Ono Poke"],
    coordinates: [-157.8458, 21.2958],
    category: "Food",
    description: "Authentic local poke shop",
    busRoutes: ["4", "18"],
    hawaiianName: "'Ono",
    pronunciation: "OH-noh",
    culturalSignificance: "'Ono' means delicious in Hawaiian. Traditional poke preparation.",
    bestTimeToVisit: "Lunch for freshest fish",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "30 minutes"
  },
  {
    name: "Marukame Udon",
    aliases: ["Marukame"],
    coordinates: [-157.8264, 21.2775],
    category: "Food",
    description: "Fresh handmade udon noodles",
    busRoutes: ["8", "19", "20", "23"],
    culturalSignificance: "Japanese-Hawaiian fusion representing Hawaii's multicultural food scene.",
    bestTimeToVisit: "Off-peak hours to avoid long lines",
    crowdLevel: "High",
    safetyLevel: "High",
    estimatedVisitDuration: "45 minutes"
  },
  {
    name: "Liliha Bakery",
    aliases: ["Liliha Coco Puffs"],
    coordinates: [-157.8642, 21.3267],
    category: "Food",
    description: "Local bakery famous for coco puffs since 1950",
    busRoutes: ["1", "4"],
    culturalSignificance: "Historic local bakery, family recipes passed down through generations.",
    bestTimeToVisit: "Morning for fresh pastries",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "30-45 minutes"
  },
  {
    name: "Da Spot Health Foods",
    aliases: ["Da Spot"],
    coordinates: [-157.8272, 21.2778],
    category: "Food",
    description: "Healthy local plates and smoothies",
    busRoutes: ["8", "19", "20", "23"],
    culturalSignificance: "Represents Hawaii's health-conscious food culture.",
    bestTimeToVisit: "Breakfast or lunch",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "45 minutes"
  },
  {
    name: "Highway Inn",
    aliases: ["Highway Inn Kalihi"],
    coordinates: [-157.8742, 21.3378],
    category: "Food",
    description: "Traditional Hawaiian food since 1947",
    busRoutes: ["1", "2"],
    hawaiianName: "Highway Inn",
    culturalSignificance: "One of Hawaii's oldest family-owned restaurants serving traditional Hawaiian food.",
    bestTimeToVisit: "Lunch for daily specials",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "1 hour"
  },
  
  // === LOCAL FOOD - CHINATOWN ===
  {
    name: "Lucky Belly",
    aliases: ["Lucky Belly Chinatown"],
    coordinates: [-157.8636, 21.3122],
    category: "Food",
    description: "Modern Asian fusion restaurant",
    busRoutes: ["1", "2", "3", "9"],
    culturalSignificance: "Represents Chinatown's culinary evolution and Asian-Hawaiian fusion.",
    bestTimeToVisit: "Dinner for full experience",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "1.5-2 hours"
  },
  {
    name: "Fete",
    aliases: ["Fete Hawaii"],
    coordinates: [-157.8625, 21.3125],
    category: "Food",
    description: "Farm-to-table restaurant in historic Chinatown",
    busRoutes: ["1", "2", "3", "9"],
    culturalSignificance: "Showcases local Hawaii ingredients in modern preparations.",
    bestTimeToVisit: "Dinner reservations recommended",
    crowdLevel: "Medium",
    safetyLevel: "High",
    estimatedVisitDuration: "2 hours"
  },
  {
    name: "Mei Sum Chinese Dim Sum",
    aliases: ["Mei Sum"],
    coordinates: [-157.8614, 21.3136],
    category: "Food",
    description: "Authentic dim sum in heart of Chinatown",
    busRoutes: ["1", "2", "3", "9"],
    culturalSignificance: "Traditional Chinese tea house culture in historic Chinatown district.",
    bestTimeToVisit: "Weekend mornings for full dim sum service",
    crowdLevel: "High",
    safetyLevel: "High",
    estimatedVisitDuration: "1-1.5 hours"
  }
];

// Location-based filtering functions
export function getDestinationsByRegion(region: 'Honolulu' | 'Windward' | 'North Shore' | 'Leeward' | 'Central'): TouristDestination[] {
  return TOURIST_DESTINATIONS.filter(dest => {
    const [lon, lat] = dest.coordinates;
    
    switch (region) {
      case 'Honolulu':
        return lat >= 21.25 && lat <= 21.35 && lon >= -157.9 && lon <= -157.8;
      case 'Windward':
        return lon >= -157.8 && lat >= 21.3;
      case 'North Shore':
        return lat >= 21.55;
      case 'Leeward':
        return lon <= -158.0;
      case 'Central':
        return lat >= 21.3 && lat <= 21.5 && lon >= -158.0 && lon <= -157.8;
      default:
        return true;
    }
  });
}

export function getDestinationsByCategory(
  category: 'Beach' | 'Food' | 'Attraction' | 'Museum' | 'Historical' | 'Hiking' | 'Nature' | 'Viewpoint',
  userLocation?: [number, number]
): TouristDestination[] {
  let destinations = TOURIST_DESTINATIONS.filter(dest => dest.category === category);
  
  // Sort by distance if user location provided
  if (userLocation) {
    destinations = destinations.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
  }
  
  return destinations;
}

export function getDestinationsByTimeOfDay(
  hour: number,
  userLocation?: [number, number]
): TouristDestination[] {
  let recommendations = [];
  
  if (hour >= 6 && hour <= 9) {
    // Morning recommendations
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.bestTimeToVisit?.includes('morning') || 
      dest.bestTimeToVisit?.includes('early') ||
      dest.category === 'Hiking'
    );
  } else if (hour >= 10 && hour <= 14) {
    // Midday recommendations
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.category === 'Museum' || 
      dest.category === 'Food' ||
      (dest.category === 'Beach' && dest.crowdLevel === 'Low')
    );
  } else if (hour >= 15 && hour <= 18) {
    // Afternoon recommendations
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.bestTimeToVisit?.includes('afternoon') || 
      dest.bestTimeToVisit?.includes('sunset') ||
      dest.category === 'Viewpoint'
    );
  } else {
    // Evening recommendations
    recommendations = TOURIST_DESTINATIONS.filter(dest => 
      dest.category === 'Food' && !dest.bestTimeToVisit?.includes('morning')
    );
  }
  
  // Sort by distance if user location provided
  if (userLocation) {
    recommendations = recommendations.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
  }
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
}

export function getCrowdAwareAlternatives(
  destination: TouristDestination,
  userLocation?: [number, number]
): TouristDestination[] {
  // Find alternatives in same category with lower crowd levels
  const alternatives = TOURIST_DESTINATIONS.filter(dest => 
    dest.category === destination.category &&
    dest.name !== destination.name &&
    ((dest.crowdLevel === 'Low') || 
     (dest.crowdLevel === 'Medium' && destination.crowdLevel === 'High'))
  );
  
  // Sort by distance if user location provided
  if (userLocation) {
    return alternatives.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    }).slice(0, 3);
  }
  
  return alternatives.slice(0, 3);
}

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