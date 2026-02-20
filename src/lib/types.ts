export interface LocationData {
  city: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimings;
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

export interface PrayerData {
  fajr: string;    // Suhoor end
  maghrib: string; // Iftar
}

export interface AppState {
  location: LocationData | null;
  prayerTimes: PrayerData | null;
  loading: boolean;
  error: string | null;
}
