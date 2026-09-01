import React from 'react';
import { Coins, CalendarCheck, Crown, ShieldAlert, TrendingUp } from 'lucide-react';
import { GlobalStats } from '../../types/fantasy';

interface KpiCardsProps {
  stats: GlobalStats;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  return (
    <div className="space-y-3">

      {/* 4 Core KPIs in 2x2 on Mobile / 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {/* 1. Bote Recaudado (Hero Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-500/30 p-3.5 sm:p-5 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400/90 truncate">
              Bote Recaudado
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 sm:gap-2 mb-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.totalPot.toFixed(2)}€
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, stats.progressPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{stats.progressPercent.toFixed(1)}%</span>
                <span>{stats.estimatedFinalPot.toFixed(0)}€ est.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Jornadas Computadas */}
        <div className="rounded-2xl bg-surface/90 border border-surface-border p-3.5 sm:p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
              Jornadas
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
                {stats.computedJourneys}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                / {stats.totalJourneysCount}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 truncate">
              <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>{stats.remainingJourneys} restantes</span>
            </p>
          </div>
        </div>

        {/* 3. Paga la Coca (Líder) */}
        <div className="rounded-2xl bg-surface/90 border border-surface-border p-3.5 sm:p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400/90 truncate">
              Líder Multas
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg sm:text-2xl font-bold text-slate-100 block mb-0.5 truncate">
              {stats.leader ? stats.leader.name : 'Nadie'}
            </span>
            <p className="text-[10px] sm:text-xs text-amber-400 font-bold truncate">
              {stats.leader ? `${stats.leader.amount.toFixed(2)}€ deuda` : '0.00€'}
            </p>
          </div>
        </div>

        {/* 4. El Rata (Menos multado) */}
        <div className="rounded-2xl bg-surface/90 border border-surface-border p-3.5 sm:p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400/90 truncate">
              El Rata (0€)
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-base sm:text-xl font-bold text-slate-100 block mb-0.5 truncate">
              {stats.ratas.length > 0
                ? stats.ratas.map(r => r.name).slice(0, 2).join(', ') + (stats.ratas.length > 2 ? ` (+${stats.ratas.length - 2})` : '')
                : 'Nadie'}
            </span>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold truncate">
              {stats.ratas.length > 0 ? `${stats.ratas.length} invictos` : '0.00€'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

