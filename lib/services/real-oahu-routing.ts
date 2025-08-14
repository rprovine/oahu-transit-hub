import { DEFAULT_TRIP_FARE } from '@/lib/constants/transit-fares';

interface RealRoute {
  id: string;
  totalTime: number;
  totalCost: number;
  co2Saved: number;
  type: 'fastest' | 'cheapest' | 'greenest';
  steps: RealStep[];
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}

interface RealStep {
  mode: 'walk' | 'bus' | 'rail';
  instruction: string;
  duration: number;
  route?: string;
  distance?: number;
}

export class RealOahuRouting {
  
  /**
   * Plan real trips using actual Oahu transit knowledge
   */
  async planRealTrip(
    originText: string, 
    destinationText: string, 
    originCoords?: [number, number], 
    destCoords?: [number, number]
  ): Promise<RealRoute[]> {
    
    console.log(`Planning real Oahu trip from "${originText}" to "${destinationText}"`);
    
    // Normalize location names for matching
    const origin = originText.toLowerCase();
    const destination = destinationText.toLowerCase();
    
    const routes: RealRoute[] = [];
    
    // KAPOLEI TO KO OLINA - Very close, should be simple
    if ((origin.includes('kapolei') || origin.includes('palala')) && 
        (destination.includes('ko olina') || destination.includes('olina'))) {
      
      routes.push({
        id: 'kapolei-ko-olina-local',
        totalTime: 25,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 2.1,
        type: 'fastest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to Farrington Highway', duration: 8, distance: 400 },
          { mode: 'bus', instruction: 'Route 401 or local shuttle to Ko Olina', duration: 12, route: '401' },
          { mode: 'walk', instruction: 'Walk to Ko Olina Lagoons', duration: 5, distance: 300 }
        ],
        notes: 'Ko Olina is very close to Kapolei - consider rideshare for convenience'
      });
      
      routes.push({
        id: 'kapolei-ko-olina-walking',
        totalTime: 45,
        totalCost: 0,
        co2Saved: 3.2,
        type: 'greenest',
        confidence: 'medium',
        steps: [
          { mode: 'walk', instruction: 'Walk via Farrington Highway to Ko Olina', duration: 45, distance: 3200 }
        ],
        notes: 'About 2 miles - walkable but hot. Bring water and sun protection.'
      });
    }
    
    // WAIKIKI TO DIAMOND HEAD
    else if (origin.includes('waikiki') && 
             (destination.includes('diamond') || destination.includes('head'))) {
      
      routes.push({
        id: 'waikiki-diamond-head',
        totalTime: 25,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 1.8,
        type: 'fastest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to Kalakaua Ave bus stop', duration: 5 },
          { mode: 'bus', instruction: 'Route 23 toward Hawaii Kai', duration: 15, route: '23' },
          { mode: 'walk', instruction: 'Walk up Diamond Head Road to entrance', duration: 5 }
        ]
      });
    }
    
    // AIRPORT TO WAIKIKI
    else if ((origin.includes('airport') || origin.includes('hnl')) && 
             destination.includes('waikiki')) {
      
      routes.push({
        id: 'airport-waikiki-20',
        totalTime: 45,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 4.5,
        type: 'cheapest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to Airport bus stop (Terminal 2)', duration: 8 },
          { mode: 'bus', instruction: 'Route 20 to Waikiki via downtown', duration: 35, route: '20' },
          { mode: 'walk', instruction: 'Walk to hotel/destination', duration: 2 }
        ]
      });
    }
    
    // PEARL HARBOR AREA
    else if (destination.includes('pearl harbor') || destination.includes('arizona')) {
      
      routes.push({
        id: 'to-pearl-harbor',
        totalTime: 55,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 5.2,
        type: 'fastest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to nearest bus stop', duration: 8 },
          { mode: 'bus', instruction: 'Route 20 or 42 toward Pearl Harbor', duration: 40, route: '20' },
          { mode: 'walk', instruction: 'Walk to Pearl Harbor visitor entrance', duration: 7 }
        ],
        notes: 'Allow extra time for Pearl Harbor security screening'
      });
    }
    
    // GENERAL WEST OAHU TO TOWN (KAPOLEI/EWA TO HONOLULU/WAIKIKI)
    else if ((origin.includes('kapolei') || origin.includes('ewa') || origin.includes('waipahu')) &&
             (destination.includes('honolulu') || destination.includes('waikiki') || destination.includes('downtown'))) {
      
      routes.push({
        id: 'west-oahu-to-town-express',
        totalTime: 65,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 6.8,
        type: 'fastest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to Kapolei Transit Center', duration: 10 },
          { mode: 'bus', instruction: 'Route C (Country Express) to Downtown', duration: 45, route: 'C' },
          { mode: 'walk', instruction: 'Walk to final destination', duration: 10 }
        ]
      });
      
      routes.push({
        id: 'west-oahu-to-town-local',
        totalTime: 85,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 6.8,
        type: 'cheapest',
        confidence: 'medium',
        steps: [
          { mode: 'walk', instruction: 'Walk to bus stop', duration: 8 },
          { mode: 'bus', instruction: 'Route 40 toward Honolulu', duration: 65, route: '40' },
          { mode: 'walk', instruction: 'Walk to destination', duration: 12 }
        ]
      });
    }
    
    // ALA MOANA TO ANYWHERE (major hub)
    else if (origin.includes('ala moana') || destination.includes('ala moana')) {
      
      routes.push({
        id: 'ala-moana-hub',
        totalTime: 35,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 3.2,
        type: 'fastest',
        confidence: 'high',
        steps: [
          { mode: 'walk', instruction: 'Walk to Ala Moana Center bus stops', duration: 8 },
          { mode: 'bus', instruction: 'Multiple routes available from Ala Moana hub', duration: 20, route: '8' },
          { mode: 'walk', instruction: 'Walk to final destination', duration: 7 }
        ],
        notes: 'Ala Moana is the main transit hub - most routes stop here'
      });
    }
    
    // FALLBACK - GENERAL ADVICE
    if (routes.length === 0) {
      routes.push({
        id: 'general-advice',
        totalTime: 60,
        totalCost: DEFAULT_TRIP_FARE,
        co2Saved: 4.0,
        type: 'fastest',
        confidence: 'low',
        steps: [
          { mode: 'walk', instruction: 'Walk to nearest major bus stop or transit center', duration: 15 },
          { mode: 'bus', instruction: 'Take route toward Ala Moana (major hub)', duration: 30, route: '?' },
          { mode: 'bus', instruction: 'Transfer at Ala Moana to route toward destination', duration: 30, route: '?' },
          { mode: 'walk', instruction: 'Walk to final destination', duration: 10 }
        ],
        notes: `For trips from "${originText}" to "${destinationText}", try: 1) Go to Ala Moana Center first (major hub), 2) Use Route C for west-to-east travel, 3) Routes 8, 19, 20, 42 are frequent, 4) Consider rideshare for complex trips`
      });
    }
    
    return routes;
  }
}

export const realOahuRouting = new RealOahuRouting();