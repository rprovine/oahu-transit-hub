// Official TheBus and HART Fare Information
// Source: https://www.thebus.org/fare/fare.asp
// Last verified: January 2024
// Note: Prices effective July 1, 2022

export const TRANSIT_FARES = {
  // TheBus Fares
  BUS: {
    // Adult fares
    ADULT_SINGLE_RIDE: 3.00,           // One-way adult fare
    ADULT_DAY_PASS: 7.50,              // Unlimited rides for one day
    ADULT_MONTHLY_PASS: 80.00,         // Unlimited rides for one month
    ADULT_ANNUAL_PASS: 880.00,         // Unlimited rides for one year
    
    // Youth fares (6-17 years)
    YOUTH_SINGLE_RIDE: 1.50,           // One-way youth fare
    YOUTH_DAY_PASS: 3.75,              // Unlimited rides for one day
    YOUTH_MONTHLY_PASS: 40.00,         // Unlimited rides for one month
    YOUTH_ANNUAL_PASS: 440.00,         // Unlimited rides for one year
    
    // Senior/Disabled fares (65+ or with disability)
    SENIOR_SINGLE_RIDE: 1.25,          // One-way senior fare
    SENIOR_DAY_PASS: 3.00,             // Unlimited rides for one day
    SENIOR_MONTHLY_PASS: 35.00,        // Unlimited rides for one month
    SENIOR_ANNUAL_PASS: 385.00,        // Unlimited rides for one year
    
    // Transfer
    TRANSFER_WINDOW: 150,              // Minutes for free transfer (2.5 hours)
  },
  
  // HART Skyline Rail Fares (when it opens)
  RAIL: {
    ADULT_SINGLE_RIDE: 3.00,           // Same as bus fare for seamless transfers
    ADULT_DAY_PASS: 7.50,              // Combined bus+rail day pass
    ADULT_MONTHLY_PASS: 80.00,         // Combined bus+rail monthly pass
  },
  
  // Special fares
  SPECIAL: {
    CHILDREN_UNDER_5: 0.00,            // Free for children under 5
    HOLO_CARD_FEE: 2.00,              // One-time HOLO card purchase fee
  }
};

// Helper functions to get appropriate fare
export function getBaseFare(passengerType: 'adult' | 'youth' | 'senior' = 'adult'): number {
  switch (passengerType) {
    case 'youth':
      return TRANSIT_FARES.BUS.YOUTH_SINGLE_RIDE;
    case 'senior':
      return TRANSIT_FARES.BUS.SENIOR_SINGLE_RIDE;
    default:
      return TRANSIT_FARES.BUS.ADULT_SINGLE_RIDE;
  }
}

export function calculateTripCost(
  numberOfTransfers: number,
  passengerType: 'adult' | 'youth' | 'senior' = 'adult',
  hasHoloCard: boolean = false
): number {
  // With HOLO card, transfers within 2.5 hours are free
  // Without HOLO card, each boarding is a new fare
  const baseFare = getBaseFare(passengerType);
  
  if (hasHoloCard) {
    return baseFare; // Free transfers within window
  } else {
    // Without HOLO card, pay for each boarding
    return baseFare * (numberOfTransfers + 1);
  }
}

export function getDayPassSavings(trips: number, passengerType: 'adult' | 'youth' | 'senior' = 'adult'): number {
  const singleFare = getBaseFare(passengerType);
  const dayPassCost = passengerType === 'youth' 
    ? TRANSIT_FARES.BUS.YOUTH_DAY_PASS
    : passengerType === 'senior'
    ? TRANSIT_FARES.BUS.SENIOR_DAY_PASS
    : TRANSIT_FARES.BUS.ADULT_DAY_PASS;
    
  const regularCost = singleFare * trips;
  return Math.max(0, regularCost - dayPassCost);
}

// Default fare for trip planning (adult single ride with HOLO card - includes transfers)
export const DEFAULT_TRIP_FARE = TRANSIT_FARES.BUS.ADULT_SINGLE_RIDE;