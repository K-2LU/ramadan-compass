'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sunrise, Sunset, MapPin, Loader2, AlertCircle, Compass } from 'lucide-react';
import { AppState, LocationData, PrayerData } from '@/lib/types';
import { getNextEvent } from '@/lib/timeUtils';
import Countdown from '@/components/Countdown';
import PrayerCard from '@/components/PrayerCard';

export default function Home() {
  const [state, setState] = useState<AppState>({
    location: null,
    prayerTimes: null,
    loading: true,
    error: null,
  });

  const [nextEvent, setNextEvent] = useState<{ targetDate: Date; eventName: 'Suhoor' | 'Iftar' } | null>(null);

  const [cityInput, setCityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const initManualMode = () => {
    setState({
      location: null,
      prayerTimes: null,
      loading: false,
      error: null, // Removed error state on initialization
    });
  };

  const handleBrowserLocation = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const prayerRes = await fetch(`/api/prayer?lat=${latitude}&lng=${longitude}`);
          if (!prayerRes.ok) throw new Error('Failed to fetch prayer times for your coordinates.');
          const prayerData: PrayerData = await prayerRes.json();

          setState({
            location: { city: "Your Location", country_name: "Detected", latitude, longitude },
            prayerTimes: prayerData,
            loading: false,
            error: null,
          });
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err.message || 'An unexpected error occurred.',
          }));
        }
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: `Error getting location: ${error.message}`,
        }));
      }
    );
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput || !countryInput) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const prayerRes = await fetch(`/api/prayer?city=${encodeURIComponent(cityInput)}&country=${encodeURIComponent(countryInput)}`);
      if (!prayerRes.ok) throw new Error('Failed to fetch prayer times for that location.');
      const prayerData: PrayerData = await prayerRes.json();

      setState({
        location: { city: cityInput, country_name: countryInput, latitude: 0, longitude: 0 },
        prayerTimes: prayerData,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'An unexpected error occurred.',
      }));
    }
  };

  useEffect(() => {
    initManualMode();
  }, []);

  useEffect(() => {
    if (state.prayerTimes) {
      setNextEvent(getNextEvent(state.prayerTimes));
    }
  }, [state.prayerTimes]);

  const handleCountdownComplete = () => {
    if (state.prayerTimes) {
      setNextEvent(getNextEvent(state.prayerTimes));
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-800/50 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl z-10 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center space-x-2 bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded-full mb-4">
            <h1 className="text-sm font-semibold tracking-widest uppercase text-emerald-400">
              Ramadan Compass
            </h1>
          </div>
          
          {state.loading ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-slate-400">Detecting location and calculating times...</p>
            </div>
          ) : !state.location && !state.prayerTimes ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center space-y-4 backdrop-blur-sm">
              <Compass className="w-12 h-12 text-emerald-500 mx-auto" />
              <div className="text-slate-200 text-left">
                <h2 className="text-lg font-semibold mb-2 text-center text-emerald-300">Set Your Location</h2>
                <p className="text-sm text-slate-400 mb-6 text-center">
                  {state.error || "Enter your city or use device location to get accurate prayer times."}
                </p>
                
                <form onSubmit={handleManualSearch} className="space-y-4 max-w-sm mx-auto bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm text-slate-300 font-medium pb-2 border-b border-slate-700/50 mb-2">Search Manually:</h3>
                  <div>
                    <input 
                      type="text" 
                      placeholder="City (e.g. London)" 
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Country (e.g. UK)" 
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit"
                      className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors border border-emerald-500 text-sm font-medium shadow-lg shadow-emerald-900/20"
                    >
                      Search City
                    </button>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={handleBrowserLocation}
                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors border border-slate-700 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" /> Use Device Location
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : state.location && state.prayerTimes && (
            <div className="space-y-10">
              {/* Location Badge */}
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-500/70" />
                <span className="text-lg font-medium">
                  {state.location.city}, {state.location.country_name}
                </span>
              </div>

              {/* Countdown Section */}
              {nextEvent && (
                <div className="transform transition-all">
                  <Countdown 
                    targetDate={nextEvent.targetDate}
                    eventName={nextEvent.eventName}
                    onComplete={handleCountdownComplete}
                  />
                </div>
              )}

              {/* Prayer Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PrayerCard 
                  title="Suhoor Ends"
                  description="Fajr time"
                  time={state.prayerTimes.fajr}
                  icon={<Sunrise className="w-6 h-6" />}
                  isActive={nextEvent?.eventName === 'Suhoor'}
                />
                <PrayerCard 
                  title="Iftar"
                  description="Maghrib time"
                  time={state.prayerTimes.maghrib}
                  icon={<Sunset className="w-6 h-6" />}
                  isActive={nextEvent?.eventName === 'Iftar'}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center pt-8 text-slate-500 text-xs">
          Built with completely accurate localized times powered by AlAdhan.
        </div>
      </div>
    </main>
  );
}
