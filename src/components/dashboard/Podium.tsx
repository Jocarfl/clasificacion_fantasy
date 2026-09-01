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
    <div className="rounded-2xl bg-surface/80 border border-surface-border p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>👑 Podio de Aportaciones al Bote</span>
          </h2>
          <p className="text-xs text-slate-400">Los 3 participantes que más dinero han aportado hasta la fecha</p>
        </div>
      </div>

      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-xl mx-auto pt-6 pb-2">
        
        {/* 2nd Place */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => second && onSelectPlayer(second)}
            className="w-full text-center group cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
          >
            <div className="relative inline-block mb-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-2xl shadow-md group-hover:border-slate-400 transition-colors">
                {second?.avatar || '🥈'}
              </div>
              <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-600">
                2º
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-slate-200 truncate group-hover:text-amber-300 transition-colors">
              {second?.name || '-'}
            </h4>
            <span className="text-xs font-semibold text-slate-300">
              {second ? `${second.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-20 mt-3 rounded-t-xl bg-gradient-to-b from-slate-800 to-slate-900 border-t border-x border-slate-700/80 flex items-center justify-center font-display font-black text-2xl text-slate-600">
            2
          </div>
        </div>

        {/* 1st Place (Winner / Paga la Coca) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-extrabold text-amber-400 uppercase tracking-wide flex items-center gap-1 shadow-sm animate-pulse">
            <Crown className="w-3 h-3" /> Paga la Coca
          </div>
          <button
            onClick={() => first && onSelectPlayer(first)}
            className="w-full text-center group cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
          >
            <div className="relative inline-block mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/10 group-hover:border-amber-400 transition-colors">
                {first?.avatar || '🥇'}
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-extrabold text-slate-950 shadow-sm">
                1º
              </span>
            </div>
            <h4 className="font-display font-extrabold text-base text-slate-100 truncate group-hover:text-amber-400 transition-colors">
              {first?.name || '-'}
            </h4>
            <span className="text-sm font-extrabold text-amber-400">
              {first ? `${first.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-28 mt-3 rounded-t-xl bg-gradient-to-b from-amber-500/20 to-slate-900 border-t-2 border-x border-amber-500/40 flex items-center justify-center font-display font-black text-3xl text-amber-500/60 shadow-inner">
            1
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={() => third && onSelectPlayer(third)}
            className="w-full text-center group cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
          >
            <div className="relative inline-block mb-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-amber-800/60 flex items-center justify-center text-2xl shadow-md group-hover:border-amber-700 transition-colors">
                {third?.avatar || '🥉'}
              </div>
              <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-amber-900/80 text-[10px] font-bold text-amber-200 border border-amber-800">
                3º
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-slate-200 truncate group-hover:text-amber-300 transition-colors">
              {third?.name || '-'}
            </h4>
            <span className="text-xs font-semibold text-slate-300">
              {third ? `${third.totalPaid.toFixed(2)}€` : '0.00€'}
            </span>
          </button>
          <div className="w-full h-14 mt-3 rounded-t-xl bg-gradient-to-b from-amber-950/40 to-slate-900 border-t border-x border-amber-900/50 flex items-center justify-center font-display font-black text-xl text-amber-900/60">
            3
          </div>
        </div>

      </div>

      {/* Rules Banner (Refined and Subtle) */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <strong>9º:</strong> 3.00€
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <strong>8º:</strong> 2.00€
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <strong>7º:</strong> 1.00€
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <strong>6º:</strong> 0.50€
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          1º al 5º: 0.00€ (Libres)
        </span>
      </div>
    </div>
  );
};
