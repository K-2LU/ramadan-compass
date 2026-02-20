import { PrayerData } from './types';

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

/**
 * Creates a Date object for a given time string (HH:MM) today.
 */
export function getTimeToday(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
  return date;
}

/**
 * Creates a Date object for a given time string (HH:MM) tomorrow.
 */
export function getTimeTomorrow(timeString: string): Date {
  const date = getTimeToday(timeString);
  date.setDate(date.getDate() + 1);
  return date;
}

/**
 * Determines the next prayer event (Fajr or Maghrib) and its target Date.
 */
export function getNextEvent(prayerTimes: PrayerData | null): { targetDate: Date; eventName: 'Suhoor' | 'Iftar' } | null {
  if (!prayerTimes) return null;

  const now = new Date();
  const fajrTime = getTimeToday(prayerTimes.fajr);
  const maghribTime = getTimeToday(prayerTimes.maghrib);

  if (now < fajrTime) {
    return { targetDate: fajrTime, eventName: 'Suhoor' };
  } else if (now < maghribTime) {
    return { targetDate: maghribTime, eventName: 'Iftar' };
  } else {
    // Both events passed today, go to tomorrow's Fajr
    const tomorrowFajr = getTimeTomorrow(prayerTimes.fajr);
    return { targetDate: tomorrowFajr, eventName: 'Suhoor' };
  }
}

/**
 * Calculates the time remaining until a target Date.
 */
export function calculateTimeRemaining(targetDate: Date): CountdownTime {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isComplete: false };
}
