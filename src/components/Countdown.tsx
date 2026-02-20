'use client';

import { useEffect, useState } from 'react';
import { calculateTimeRemaining, CountdownTime } from '@/lib/timeUtils';

interface CountdownProps {
  targetDate: Date;
  eventName: string;
  onComplete?: () => void;
}

export default function Countdown({ targetDate, eventName, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial calculation
    setTimeLeft(calculateTimeRemaining(targetDate));

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.isComplete) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  // Avoid hydration mismatch by not rendering the countdown until mounted on client
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl m-4 w-full max-w-md mx-auto animate-pulse">
        <div className="h-6 bg-slate-700 w-48 rounded mb-6"></div>
        <div className="flex space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-700 rounded-lg mb-2"></div>
              <div className="h-4 bg-slate-700 w-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/20 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] m-4 w-full max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <h2 className="text-xl font-medium text-slate-300 mb-6 flex items-center gap-2">
        Time remaining until <span className="text-emerald-400 font-semibold">{eventName}</span>
      </h2>
      
      <div className="flex space-x-6 z-10">
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-4xl text-emerald-500/50 font-light mt-2">:</span>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <span className="text-4xl text-emerald-500/50 font-light mt-2">:</span>
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800 border border-slate-700 shadow-inner w-20 h-24 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-white/5 border-b border-white/5"></div>
        <span className="text-5xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent transform tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs tracking-widest text-slate-400 uppercase font-medium">{label}</span>
    </div>
  );
}
