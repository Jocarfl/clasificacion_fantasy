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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/50 p-3.5 sm:p-5 shadow-xl shadow-amber-500/5 flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-300 truncate">
              Bote Recaudado
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 sm:gap-2 mb-1.5">
              <span className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.totalPot.toFixed(2)}€
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden border border-slate-600/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, stats.progressPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span className="text-amber-300">{stats.progressPercent.toFixed(1)}%</span>
                <span>{stats.estimatedFinalPot.toFixed(0)}€ est.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Jornadas Computadas */}
        <div className="rounded-2xl bg-surface-card border border-slate-700/80 p-3.5 sm:p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
              Jornadas
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-600">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-white">
                {stats.computedJourneys}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-bold">
                / {stats.totalJourneysCount}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1 truncate font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{stats.remainingJourneys} restantes</span>
            </p>
          </div>
        </div>

        {/* 3. Paga la Coca (Líder) */}
        <div className="rounded-2xl bg-surface-card border border-amber-500/30 p-3.5 sm:p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-300 truncate">
              Líder Multas
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg sm:text-2xl font-black text-white block mb-0.5 truncate">
              {stats.leader ? stats.leader.name : 'Nadie'}
            </span>
            <p className="text-[11px] sm:text-xs text-amber-300 font-extrabold truncate">
              {stats.leader ? `${stats.leader.amount.toFixed(2)}€ deuda` : '0.00€'}
            </p>
          </div>
        </div>

        {/* 4. El Rata (Menos multado) */}
        <div className="rounded-2xl bg-surface-card border border-emerald-500/30 p-3.5 sm:p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-300 truncate">
              El Rata (0€)
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-base sm:text-xl font-black text-white block mb-0.5 truncate">
              {stats.ratas.length > 0
                ? stats.ratas.map(r => r.name).slice(0, 2).join(', ') + (stats.ratas.length > 2 ? ` (+${stats.ratas.length - 2})` : '')
                : 'Nadie'}
            </span>
            <p className="text-[11px] sm:text-xs text-emerald-300 font-bold truncate">
              {stats.ratas.length > 0 ? `${stats.ratas.length} invictos` : '0.00€'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

