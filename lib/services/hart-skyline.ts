export interface SkylineStation {
  id: string;
  name: string;
  hawaiianName?: string;
  coordinates: [number, number]; // [lng, lat]
  isOperational: boolean;
  openingDate: string;
  connections: {
    busRoutes: string[];
    parking?: {
      spaces: number;
      cost: string;
    };
    amenities: string[];
  };
  ridership?: {
    dailyAverage: number;
    peakHours: string[];
  };
}

export interface MultimodalTripPlan {
  skylineAvailable: boolean;
  totalTime: number;
  cost: string;
  carbonSavings: string;
  legs: {
    mode: 'WALK' | 'BUS' | 'RAIL';
    from: string;
    to: string;
    duration: number;
    route?: string;
    routeName?: string;
    instructions: string;
  }[];
  alternatives: {
    busOnly: any;
    comparison: {
      timeComparison: string;
      costComparison: string;
      comfortLevel: string;
    };
  };
}

export interface SkylineStatus {
  systemStatus: 'operational' | 'partial' | 'maintenance' | 'planned';
  operationalSegments: number;
  totalSegments: number;
  nextOpening?: {
    segment: string;
    expectedDate: string;
    stations: string[];
  };
  serviceAlerts: string[];
  ridership?: {
    dailyAverage: string;
    weeklyTrend: string;
  };
}

class HARTSkylineService {
  private stations: SkylineStation[] = [
    {
      id: 'east-kapolei',
      name: 'East Kapolei Station',
      hawaiianName: 'Kapolei Hikina',
      coordinates: [-158.0589, 21.3362],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C'],
        parking: { spaces: 564, cost: 'Free' },
        amenities: ['Park & Ride', 'Bus Transit Center', 'Covered Walkways']
      },
      ridership: {
        dailyAverage: 850,
        peakHours: ['6:00-9:00 AM', '4:00-7:00 PM']
      }
    },
    {
      id: 'uh-west-oahu',
      name: 'UH West Oahu Station',
      hawaiianName: 'Kulanui Hawaii Kapolei',
      coordinates: [-158.0789, 21.3445],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C'],
        amenities: ['University Access', 'Student Services', 'Bike Racks']
      }
    },
    {
      id: 'hoopili',
      name: "Ho'opili Station",
      hawaiianName: "Ho'opili",
      coordinates: [-158.0445, 21.3456],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C'],
        amenities: ['Transit-Oriented Development', 'Shopping Center Access']
      }
    },
    {
      id: 'westloch',
      name: 'West Loch Station',
      hawaiianName: 'Loko Komohana',
      coordinates: [-158.0234, 21.3567],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48'],
        amenities: ['Community Center Access', 'Recreation Areas']
      }
    },
    {
      id: 'waipahu-transit-center',
      name: 'Waipahu Transit Center',
      hawaiianName: 'Pahu Kaha Waipahu',
      coordinates: [-158.0123, 21.3678],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48', '433'],
        parking: { spaces: 325, cost: 'Free' },
        amenities: ['Major Bus Transit Hub', 'Shopping Access', 'Food Services']
      }
    },
    {
      id: 'leeward-community-college',
      name: 'Leeward Community College Station',
      hawaiianName: 'Kulanui Kaiakahi Komohana',
      coordinates: [-158.0012, 21.3789],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48'],
        amenities: ['College Access', 'Student Facilities', 'Library Access']
      }
    },
    {
      id: 'pearl-highlands',
      name: 'Pearl Highlands Station',
      hawaiianName: 'Puʻuloa Mauka',
      coordinates: [-157.9901, 21.3890],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48', '52'],
        parking: { spaces: 1050, cost: 'Free' },
        amenities: ['Shopping Center', 'Movie Theater', 'Restaurants']
      }
    },
    {
      id: 'pearlridge',
      name: 'Pearlridge Station',
      hawaiianName: 'Kualapa Puʻuloa',
      coordinates: [-157.9790, 21.3991],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48', '52'],
        amenities: ['Major Shopping Mall', 'Food Court', 'Medical Services']
      }
    },
    {
      id: 'aloha-stadium',
      name: 'Aloha Stadium Station',
      hawaiianName: 'Kahua Kinai Aloha',
      coordinates: [-157.9679, 21.4092],
      isOperational: true,
      openingDate: '2023-06-30',
      connections: {
        busRoutes: ['40', 'C', '48', '52', '53'],
        parking: { spaces: 675, cost: 'Free (game days may vary)' },
        amenities: ['Stadium Access', 'Swap Meet', 'Event Parking']
      }
    },
    // Segment 2 Stations (Opening Late 2025)
    {
      id: 'halawa',
      name: 'Halawa Station',
      hawaiianName: 'Halawa',
      coordinates: [-157.9234, 21.3825],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['54', '56'],
        amenities: ['Industrial Area Access', 'Freeway Connection']
      }
    },
    {
      id: 'aiea',
      name: 'Aiea Station',
      hawaiianName: 'ʻAiea',
      coordinates: [-157.9345, 21.3936],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['11', '20'],
        amenities: ['Community Access', 'Medical Center Connections']
      }
    },
    {
      id: 'pearl-harbor',
      name: 'Pearl Harbor Naval Shipyard Station',
      hawaiianName: 'Puʻuloa',
      coordinates: [-157.9456, 21.3647],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['20', '42'],
        amenities: ['Naval Base Access', 'Security Clearance Required']
      }
    },
    {
      id: 'stadium',
      name: 'Stadium Station',
      hawaiianName: 'Kahua Kinai',
      coordinates: [-157.9567, 21.3258],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '20'],
        amenities: ['Sports Complex Access', 'Event Transportation']
      }
    },
    {
      id: 'kalihi-palama',
      name: 'Kalihi-Palama Station',
      hawaiianName: 'Kalihi-Palama',
      coordinates: [-157.9678, 21.3369],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3'],
        amenities: ['Community Center', 'Health Services']
      }
    },
    {
      id: 'kapalama',
      name: 'Kapalama Station',
      hawaiianName: 'Kapalama',
      coordinates: [-157.9789, 21.3170],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3', '9'],
        amenities: ['Harbor Access', 'Industrial Connections']
      }
    },
    {
      id: 'sand-island',
      name: 'Sand Island Station',
      hawaiianName: 'Mokumoa',
      coordinates: [-157.8890, 21.3081],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['19', '20'],
        amenities: ['Park Access', 'Recreation Areas', 'Harbor Views']
      }
    },
    {
      id: 'keeaumoku',
      name: 'Keeaumoku Station',
      hawaiianName: 'Keʻeaumoku',
      coordinates: [-157.8601, 21.3092],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '13'],
        amenities: ['Shopping District', 'Medical Center Access']
      }
    },
    {
      id: 'middle-street',
      name: 'Middle Street Station',
      hawaiianName: 'Alanui Waenakonu',
      coordinates: [-157.8512, 21.3203],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3', '13'],
        amenities: ['Transit Hub', 'Downtown Access']
      }
    },
    {
      id: 'civic-center',
      name: 'Civic Center Station',
      hawaiianName: 'Pahu Aupuni',
      coordinates: [-157.8423, 21.3314],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3', '9', '13'],
        amenities: ['Government Buildings', 'City Services', 'Court Access']
      }
    },
    {
      id: 'downtown',
      name: 'Downtown Station',
      hawaiianName: 'Kaulana Kekahi',
      coordinates: [-157.8334, 21.3425],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3', '9', '13', '19', '20'],
        amenities: ['Business District', 'Financial Center', 'Shopping']
      }
    },
    {
      id: 'chinatown',
      name: 'Chinatown Station',
      hawaiianName: 'Kaulana Pake',
      coordinates: [-157.8245, 21.3536],
      isOperational: false,
      openingDate: '2025-12-01',
      connections: {
        busRoutes: ['1', '2', '3', '9'],
        amenities: ['Cultural District', 'Art Galleries', 'Restaurants', 'Markets']
      }
    }
  ];

  async getSkylineStatus(): Promise<SkylineStatus> {
    return {
      systemStatus: 'partial',
      operationalSegments: 1,
      totalSegments: 2,
      nextOpening: {
        segment: 'Segment 2 (Pearl Highlands to Chinatown)',
        expectedDate: 'Late 2025',
        stations: [
          'Halawa', 'Aiea', 'Pearl Harbor Naval Shipyard', 'Stadium',
          'Kalihi-Palama', 'Kapalama', 'Sand Island', 'Keeaumoku',
          'Middle Street', 'Civic Center', 'Downtown', 'Chinatown'
        ]
      },
      serviceAlerts: [],
      ridership: {
        dailyAverage: '4,200',
        weeklyTrend: '+8% from last month'
      }
    };
  }

  getOperationalStations(): SkylineStation[] {
    return this.stations.filter(station => station.isOperational);
  }

  getAllStations(): SkylineStation[] {
    return this.stations;
  }

  getStationByName(name: string): SkylineStation | undefined {
    return this.stations.find(station => 
      station.name.toLowerCase().includes(name.toLowerCase()) ||
      station.hawaiianName?.toLowerCase().includes(name.toLowerCase())
    );
  }

  getNearestStation(userLocation: [number, number], includeUpcoming: boolean = false): SkylineStation | null {
    const stationsToCheck = includeUpcoming ? this.stations : this.getOperationalStations();
    
    if (stationsToCheck.length === 0) return null;

    let nearest = stationsToCheck[0];
    let minDistance = this.calculateDistance(userLocation, nearest.coordinates);

    for (const station of stationsToCheck.slice(1)) {
      const distance = this.calculateDistance(userLocation, station.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    }

    return nearest;
  }

  async planMultimodalTrip(
    origin: [number, number],
    destination: [number, number],
    includeUpcoming: boolean = false
  ): Promise<MultimodalTripPlan> {
    const nearestOriginStation = this.getNearestStation(origin, includeUpcoming);
    const nearestDestStation = this.getNearestStation(destination, includeUpcoming);

    if (!nearestOriginStation || !nearestDestStation) {
      return {
        skylineAvailable: false,
        totalTime: 0,
        cost: '$0',
        carbonSavings: '0kg CO2',
        legs: [],
        alternatives: {
          busOnly: null,
          comparison: {
            timeComparison: 'Skyline not available for this route',
            costComparison: 'Bus only option available',
            comfortLevel: 'Standard bus service'
          }
        }
      };
    }

    const walkToStation = this.calculateDistance(origin, nearestOriginStation.coordinates) * 12; // ~12 min/km walking
    const railTime = 45; // Estimated rail travel time
    const walkFromStation = this.calculateDistance(nearestDestStation.coordinates, destination) * 12;

    const legs = [
      {
        mode: 'WALK' as const,
        from: 'Current Location',
        to: nearestOriginStation.name,
        duration: Math.round(walkToStation),
        instructions: `Walk to ${nearestOriginStation.name}`
      },
      {
        mode: 'RAIL' as const,
        from: nearestOriginStation.name,
        to: nearestDestStation.name,
        duration: railTime,
        route: 'HART Skyline',
        routeName: 'HART Skyline Rail',
        instructions: `Take HART Skyline from ${nearestOriginStation.name} to ${nearestDestStation.name}`
      },
      {
        mode: 'WALK' as const,
        from: nearestDestStation.name,
        to: 'Destination',
        duration: Math.round(walkFromStation),
        instructions: `Walk from ${nearestDestStation.name} to destination`
      }
    ];

    return {
      skylineAvailable: nearestOriginStation.isOperational && nearestDestStation.isOperational,
      totalTime: Math.round(walkToStation + railTime + walkFromStation),
      cost: '$3.00',
      carbonSavings: '1.8kg CO2 vs driving',
      legs,
      alternatives: {
        busOnly: null, // Would be populated by bus service
        comparison: {
          timeComparison: 'Rail typically 25% faster than bus',
          costComparison: 'Same fare with HOLO card transfers',
          comfortLevel: 'Climate-controlled, spacious, accessible'
        }
      }
    };
  }

  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async getStationInfo(stationId: string): Promise<SkylineStation | null> {
    const station = this.stations.find(s => s.id === stationId);
    return station || null;
  }

  async getServiceAlerts(): Promise<string[]> {
    // In production, this would fetch real-time service alerts
    return [
      'Service running on schedule',
      'Free parking available at all Park & Ride stations'
    ];
  }

  async getRidershipData(): Promise<any> {
    return {
      today: {
        ridership: 4200,
        trend: '+8%'
      },
      weekly: {
        average: 4100,
        peak_day: 'Friday',
        lowest_day: 'Sunday'
      },
      monthly: {
        total: 125000,
        growth: '+12% vs last month'
      }
    };
  }

  // Integration helpers for tourism features
  async getDestinationConnections(destinationName: string): Promise<{
    railAccess: boolean;
    nearestStation?: SkylineStation;
    connectionDetails?: string;
  }> {
    // Map popular tourist destinations to nearby stations
    const destinationStationMapping: { [key: string]: string } = {
      'Pearl Harbor': 'pearl-harbor',
      'Aloha Stadium': 'aloha-stadium',
      'Pearlridge Center': 'pearlridge',
      'UH West Oahu': 'uh-west-oahu',
      'Downtown Honolulu': 'downtown',
      'Chinatown': 'chinatown'
    };

    const stationId = destinationStationMapping[destinationName];
    if (stationId) {
      const station = await this.getStationInfo(stationId);
      return {
        railAccess: station?.isOperational || false,
        nearestStation: station || undefined,
        connectionDetails: station?.isOperational 
          ? `Direct rail access via ${station.name}`
          : `Rail access coming ${station?.openingDate}`
      };
    }

    return {
      railAccess: false,
      connectionDetails: 'Bus connections available'
    };
  }
}

export const hartSkylineService = new HARTSkylineService();