import React from 'react';
import { Crown } from 'lucide-react';
import { ParticipantStats } from '../../types/fantasy';

interface PodiumProps {
  ranking: ParticipantStats[];
  onSelectPlayer: (player: ParticipantStats) => void;
}

export const Podium: React.FC<PodiumProps> = ({ ranking, onSelectPlayer }) => {
  const first = ranking[0];
  const second = ranking[1];
  const third = ranking[2];

  return (
    <div className="rounded-2xl bg-surface-card border border-surface-border p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="font-display text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>👑 Podio de Aportaciones al Bote</span>
          </h2>
          <p className="text-xs text-slate-300 font-medium">Los 3 participantes con mayor aportación acumulada</p>
        </div>
      </div>

      <div className="flex items-end justify-center gap-2 sm:gap-6 max-w-xl mx-auto pt-4 pb-2">
        
        {/* 2nd Place */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => second && onSelectPlayer(second)}
            className="w-full text-center group cursor-pointer transition-transform active:scale-95 focus:outline-none"
          >
            <div className="relative inline-block mb-1.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-850 border-2 border-slate-500 flex items-center justify-center font-display font-black text-sm sm:text-base text-slate-100 shadow-md group-hover:border-slate-300 transition-colors">
                {second ? second.name.slice(0, 2).toUpperCase() : '2º'}
              </div>
              <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] font-black text-slate-100 border border-slate-500 shadow-sm">
                2º
              </span>
            </div>
            <h4 className="font-display font-black text-xs sm:text-sm text-slate-100 truncate group-hover:text-amber-300 transition-colors">
              {second?.name || '-'}
            </h4>
            <span className="text-[11px] sm:text-xs font-black text-slate-200">
              {second ? `${second.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-20 sm:h-24 mt-2.5 rounded-t-xl bg-gradient-to-b from-slate-700 to-slate-900 border-t-2 border-x border-slate-600 flex items-center justify-center font-display font-black text-xl sm:text-2xl text-slate-400 shadow-inner">
            2
          </div>
        </div>

        {/* 1st Place (Winner / Paga la Coca) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/60 text-[10px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1 shadow-md animate-pulse">
            <Crown className="w-3 h-3 text-amber-300" /> Paga la Coca
          </div>
          <button
            onClick={() => first && onSelectPlayer(first)}
            className="w-full text-center group cursor-pointer transition-transform active:scale-95 focus:outline-none"
          >
            <div className="relative inline-block mb-1.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500/40 to-amber-600/20 border-2 border-amber-400 flex items-center justify-center font-display font-black text-lg sm:text-xl text-amber-200 shadow-lg shadow-amber-500/20 group-hover:border-amber-300 transition-colors">
                {first ? first.name.slice(0, 2).toUpperCase() : '1º'}
              </div>
              <span className="absolute -bottom-1.5 -right-1 px-2 py-0.2 rounded-full bg-amber-400 text-[10px] font-black text-slate-950 shadow-md">
                1º
              </span>
            </div>
            <h4 className="font-display font-black text-sm sm:text-base text-white truncate group-hover:text-amber-300 transition-colors">
              {first?.name || '-'}
            </h4>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {first ? `${first.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-28 sm:h-36 mt-2.5 rounded-t-xl bg-gradient-to-b from-amber-500/30 via-slate-800 to-slate-900 border-t-2 border-x border-amber-400/80 flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-amber-400 shadow-inner">
            1
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => third && onSelectPlayer(third)}
            className="w-full text-center group cursor-pointer transition-transform active:scale-95 focus:outline-none"
          >
            <div className="relative inline-block mb-1.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-900/50 to-slate-800 border-2 border-amber-700/80 flex items-center justify-center font-display font-black text-sm sm:text-base text-amber-200 shadow-md group-hover:border-amber-500 transition-colors">
                {third ? third.name.slice(0, 2).toUpperCase() : '3º'}
              </div>
              <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-amber-900 text-[10px] font-black text-amber-200 border border-amber-700 shadow-sm">
                3º
              </span>
            </div>
            <h4 className="font-display font-black text-xs sm:text-sm text-slate-100 truncate group-hover:text-amber-300 transition-colors">
              {third?.name || '-'}
            </h4>
            <span className="text-[11px] sm:text-xs font-black text-slate-200">
              {third ? `${third.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-14 sm:h-16 mt-2.5 rounded-t-xl bg-gradient-to-b from-amber-950/60 to-slate-900 border-t-2 border-x border-amber-800/80 flex items-center justify-center font-display font-black text-lg sm:text-xl text-amber-600">
            3
          </div>
        </div>

      </div>

      {/* Rules Banner */}
      <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs font-semibold text-slate-200">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/40">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <strong>9º:</strong> 3.00€
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/40">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <strong>8º:</strong> 2.00€
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <strong>7º:</strong> 1.00€
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-200 border border-slate-600">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <strong>6º:</strong> 0.50€
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          1º-5º: 0€ (Libres)
        </span>
      </div>
    </div>
  );
};

