// Emission Calculator Utilities

import type { Activity, ActivityCategory, EmissionStats } from '../types';
import { EMISSION_FACTORS } from '../types';

/**
 * Calculate CO2 emission for a single activity
 */
export function calculateEmission(type: string, value: number): number {
  const factor = EMISSION_FACTORS[type] || 0;
  return Math.round(factor * value * 100) / 100;
}

/**
 * Get total emissions from a list of activities
 */
export function getTotalEmissions(activities: Activity[]): number {
  return activities.reduce((total, activity) => total + activity.emission, 0);
}

/**
 * Get emissions grouped by category
 */
export function getEmissionsByCategory(activities: Activity[]): Record<ActivityCategory, number> {
  const result: Record<ActivityCategory, number> = {
    transport: 0,
    energy: 0,
    diet: 0,
    other: 0,
  };

  activities.forEach(activity => {
    result[activity.category] += activity.emission;
  });

  // Round values
  Object.keys(result).forEach(key => {
    result[key as ActivityCategory] = Math.round(result[key as ActivityCategory] * 100) / 100;
  });

  return result;
}

/**
 * Filter activities by date range
 */
export function filterByDateRange(
  activities: Activity[],
  startDate: Date,
  endDate: Date
): Activity[] {
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate && activityDate <= endDate;
  });
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of month
 */
export function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate comprehensive emission stats
 */
export function calculateStats(activities: Activity[]): EmissionStats {
  const now = new Date();
  const startOfToday = getStartOfDay(now);
  const startOfWeek = getStartOfWeek(now);
  const startOfMonth = getStartOfMonth(now);
  const endOfToday = new Date(startOfToday);
  endOfToday.setHours(23, 59, 59, 999);

  const dailyActivities = filterByDateRange(activities, startOfToday, endOfToday);
  const weeklyActivities = filterByDateRange(activities, startOfWeek, endOfToday);
  const monthlyActivities = filterByDateRange(activities, startOfMonth, endOfToday);

  return {
    daily: Math.round(getTotalEmissions(dailyActivities) * 100) / 100,
    weekly: Math.round(getTotalEmissions(weeklyActivities) * 100) / 100,
    monthly: Math.round(getTotalEmissions(monthlyActivities) * 100) / 100,
    byCategory: getEmissionsByCategory(monthlyActivities),
  };
}

/**
 * Get emissions per day for trend chart
 */
export function getDailyEmissions(activities: Activity[], days: number = 30): { date: string; emission: number }[] {
  const result: { date: string; emission: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStart = getStartOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayActivities = filterByDateRange(activities, dayStart, dayEnd);
    const emission = getTotalEmissions(dayActivities);

    result.push({
      date: dayStart.toISOString().split('T')[0],
      emission: Math.round(emission * 100) / 100,
    });
  }

  return result;
}

/**
 * Format emission value for display
 */
export function formatEmission(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} tonnes`;
  }
  return `${value.toFixed(2)} kg`;
}

/**
 * Get date formatted for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Compare current emissions with target
 */
export function getProgressToGoal(current: number, goal: number): { percentage: number; status: 'good' | 'warning' | 'danger' } {
  const percentage = Math.min((current / goal) * 100, 100);
  
  if (percentage <= 60) return { percentage, status: 'good' };
  if (percentage <= 85) return { percentage, status: 'warning' };
  return { percentage, status: 'danger' };
}

/**
 * Calculate average daily emission
 */
export function getAverageDaily(activities: Activity[], days: number = 30): number {
  const dailyData = getDailyEmissions(activities, days);
  const total = dailyData.reduce((sum, day) => sum + day.emission, 0);
  return Math.round((total / days) * 100) / 100;
}
