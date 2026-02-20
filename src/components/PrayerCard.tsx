import { ReactNode } from 'react';

interface PrayerCardProps {
  title: string;
  time: string;
  icon: ReactNode;
  isActive?: boolean;
  description?: string;
}

export default function PrayerCard({ title, time, icon, isActive = false, description }: PrayerCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 transition-all duration-300 
        flex flex-row items-center justify-between border
        ${
          isActive
            ? 'bg-linear-gradient-to-r from-emerald-900/40 to-emerald-800/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] transform scale-[1.02]'
            : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
        }
      `}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      )}
      
      <div className="flex items-center space-x-4 z-10">
        <div 
          className={`
            p-3 rounded-full 
            ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}
          `}
        >
          {icon}
        </div>
        <div>
          <h3 className={`text-lg font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="text-right z-10">
        <div className={`text-3xl font-light tracking-wider tabular-nums ${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
