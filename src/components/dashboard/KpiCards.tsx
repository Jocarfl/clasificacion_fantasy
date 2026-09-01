import React from 'react';
import { Coins, CalendarCheck, Crown, ShieldAlert, TrendingUp } from 'lucide-react';
import { GlobalStats } from '../../types/fantasy';

interface KpiCardsProps {
  stats: GlobalStats;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Bote Recaudado (Hero Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-500/30 p-5 shadow-lg shadow-black/40">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
            Bote Recaudado
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-display text-3xl font-extrabold text-white tracking-tight">
            {stats.totalPot.toFixed(2)}€
          </span>
          <span className="text-xs text-slate-400">
            de {stats.estimatedFinalPot.toFixed(0)}€ est.
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, stats.progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{stats.progressPercent.toFixed(1)}% acumulado</span>
            <span>38 Jornadas</span>
          </div>
        </div>
      </div>

      {/* 2. Jornadas Computadas */}
      <div className="rounded-2xl bg-surface/90 border border-surface-border p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Jornadas Jugadas
          </span>
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-display text-3xl font-bold text-slate-100">
              {stats.computedJourneys}
            </span>
            <span className="text-sm text-slate-500 font-medium">
              / {stats.totalJourneysCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Restan {stats.remainingJourneys} fechas (6.50€ / J)</span>
          </p>
        </div>
      </div>

      {/* 3. Paga la Coca (Líder) */}
      <div className="rounded-2xl bg-surface/90 border border-surface-border p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
            Paga la Coca (1º)
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Crown className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-display text-2xl font-bold text-slate-100 block mb-0.5 truncate">
            {stats.leader ? stats.leader.name : 'Nadie'}
          </span>
          <p className="text-xs text-amber-400 font-medium">
            {stats.leader ? `${stats.leader.amount.toFixed(2)}€ aportados al bote` : '0.00€'}
          </p>
        </div>
      </div>

      {/* 4. El Rata (Menos multado) */}
      <div className="rounded-2xl bg-surface/90 border border-surface-border p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
            El Rata (0€ Pagados)
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-display text-xl font-bold text-slate-100 block mb-0.5 truncate">
            {stats.ratas.length > 0
              ? stats.ratas.map(r => r.name).slice(0, 2).join(', ') + (stats.ratas.length > 2 ? ` (+${stats.ratas.length - 2})` : '')
              : 'Nadie'}
          </span>
          <p className="text-xs text-emerald-400 font-medium">
            {stats.ratas.length > 0 ? `${stats.ratas[0].amount.toFixed(2)}€ de deuda acumulada` : '0.00€'}
          </p>
        </div>
      </div>

    </div>
  );
};
