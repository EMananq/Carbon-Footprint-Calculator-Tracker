// Activity Types for Carbon Footprint Tracking

export type ActivityCategory = 'transport' | 'energy' | 'diet' | 'other';

export interface Activity {
  id: string;
  userId: string;
  category: ActivityCategory;
  type: string;
  value: number;
  unit: string;
  emission: number;
  date: string;
  createdAt: string;
  notes?: string;
}

export interface EmissionStats {
  daily: number;
  weekly: number;
  monthly: number;
  byCategory: Record<ActivityCategory, number>;
}

// Emission factors in kg CO2 per unit
export const EMISSION_FACTORS: Record<string, number> = {
  // Transport (per km)
  car_petrol: 0.12,
  car_diesel: 0.14,
  car_electric: 0.05,
  bus: 0.05,
  train: 0.03,
  flight_short: 0.255,
  flight_long: 0.195,
  bicycle: 0,
  walking: 0,
  // Energy (per kWh)
  electricity: 0.5,
  natural_gas: 0.2,
  heating_oil: 0.27,
  // Diet (per meal)
  beef: 6.0,
  pork: 3.5,
  chicken: 2.5,
  fish: 2.0,
  vegetarian: 1.5,
  vegan: 0.9,
};

// Display names for activity types
export const ACTIVITY_LABELS: Record<string, string> = {
  car_petrol: 'Car (Petrol)',
  car_diesel: 'Car (Diesel)',
  car_electric: 'Electric Car',
  bus: 'Bus',
  train: 'Train',
  flight_short: 'Flight (Short-haul)',
  flight_long: 'Flight (Long-haul)',
  bicycle: 'Bicycle',
  walking: 'Walking',
  electricity: 'Electricity',
  natural_gas: 'Natural Gas',
  heating_oil: 'Heating Oil',
  beef: 'Beef Meal',
  pork: 'Pork Meal',
  chicken: 'Chicken Meal',
  fish: 'Fish Meal',
  vegetarian: 'Vegetarian Meal',
  vegan: 'Vegan Meal',
};

// Category labels
export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  transport: 'Transportation',
  energy: 'Energy',
  diet: 'Diet',
  other: 'Other',
};

// Category colors for charts
export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  diet: '#10b981',
  other: '#8b5cf6',
};

// Activity options grouped by category
export const ACTIVITY_OPTIONS: Record<ActivityCategory, { value: string; label: string; unit: string }[]> = {
  transport: [
    { value: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
    { value: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
    { value: 'car_electric', label: 'Electric Car', unit: 'km' },
    { value: 'bus', label: 'Bus', unit: 'km' },
    { value: 'train', label: 'Train', unit: 'km' },
    { value: 'flight_short', label: 'Flight (Short-haul)', unit: 'km' },
    { value: 'flight_long', label: 'Flight (Long-haul)', unit: 'km' },
    { value: 'bicycle', label: 'Bicycle', unit: 'km' },
    { value: 'walking', label: 'Walking', unit: 'km' },
  ],
  energy: [
    { value: 'electricity', label: 'Electricity', unit: 'kWh' },
    { value: 'natural_gas', label: 'Natural Gas', unit: 'kWh' },
    { value: 'heating_oil', label: 'Heating Oil', unit: 'kWh' },
  ],
  diet: [
    { value: 'beef', label: 'Beef Meal', unit: 'meals' },
    { value: 'pork', label: 'Pork Meal', unit: 'meals' },
    { value: 'chicken', label: 'Chicken Meal', unit: 'meals' },
    { value: 'fish', label: 'Fish Meal', unit: 'meals' },
    { value: 'vegetarian', label: 'Vegetarian Meal', unit: 'meals' },
    { value: 'vegan', label: 'Vegan Meal', unit: 'meals' },
  ],
  other: [],
};
