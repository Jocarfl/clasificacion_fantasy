import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CalculatedStats } from '../../types/fantasy';
import { Coins, AlertTriangle, ShieldCheck, Flame, PieChart, Sparkles } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface AnalyticsViewProps {
  stats: CalculatedStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  const { ranking, globalStats } = stats;
  const [filterPenalty, setFilterPenalty] = useState<'all' | 'p3' | 'p2' | 'p1' | 'p05'>('all');

  const filteredRanking = ranking.filter(p => p.totalPaid > 0);

  // Palette: amber, emerald, sky, rose, indigo, violet, orange, teal, slate
  const colorPalette = [
    '#f59e0b', '#10b981', '#38bdf8', '#f43f5e', 
    '#818cf8', '#a855f7', '#fb923c', '#2dd4bf', '#94a3b8'
  ];

  // 1. Donut Data for Pot Distribution
  const donutData = {
    labels: filteredRanking.map(p => p.name),
    datasets: [
      {
        data: filteredRanking.map(p => p.totalPaid),
        backgroundColor: colorPalette.slice(0, filteredRanking.length),
        borderColor: '#090d16',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const val = Number(context.raw) || 0;
            const pct = globalStats.totalPot > 0 ? ((val / globalStats.totalPot) * 100).toFixed(1) : '0';
            return ` ${context.label}: ${val.toFixed(2)}€ (${pct}%)`;
          }
        }
      }
    },
    cutout: '72%'
  };

  // Calculations for league records
  const max3Count = Math.max(...ranking.map(p => p.penaltyCounts.p3), 0);
  const kingOf3 = ranking.filter(p => p.penaltyCounts.p3 === max3Count && max3Count > 0);

  const cleanPlayers = ranking.filter(p => p.totalPaid === 0);

  const totalPenaltiesGiven = ranking.reduce(
    (acc, p) => acc + p.penaltyCounts.p3 + p.penaltyCounts.p2 + p.penaltyCounts.p1 + p.penaltyCounts.p05,
    0
  );

  const totalP3 = ranking.reduce((acc, p) => acc + p.penaltyCounts.p3, 0);
  const totalP2 = ranking.reduce((acc, p) => acc + p.penaltyCounts.p2, 0);
  const totalP1 = ranking.reduce((acc, p) => acc + p.penaltyCounts.p1, 0);
  const totalP05 = ranking.reduce((acc, p) => acc + p.penaltyCounts.p05, 0);

  // Sorting for Sanctions table based on selected filter
  const sortedBySanctions = [...ranking].sort((a, b) => {
    if (filterPenalty === 'p3') return b.penaltyCounts.p3 - a.penaltyCounts.p3 || b.totalPaid - a.totalPaid;
    if (filterPenalty === 'p2') return b.penaltyCounts.p2 - a.penaltyCounts.p2 || b.totalPaid - a.totalPaid;
    if (filterPenalty === 'p1') return b.penaltyCounts.p1 - a.penaltyCounts.p1 || b.totalPaid - a.totalPaid;
    if (filterPenalty === 'p05') return b.penaltyCounts.p05 - a.penaltyCounts.p05 || b.totalPaid - a.totalPaid;
    return b.totalPaid - a.totalPaid;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-400" />
          <span>Estadísticas y Análisis del Bote</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribución de pagos, contadores de sanciones y récords del grupo
        </p>
      </div>

      {/* Highlights / Curiosidades Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* 1. Rey del Farolillo Rojo (3€) */}
        <div className="rounded-2xl bg-gradient-to-br from-red-500/10 via-slate-900 to-slate-900 border border-red-500/25 p-4 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl flex-shrink-0 border border-red-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 block">
              Rey del 3€ (Último)
            </span>
            <strong className="font-display text-base font-bold text-slate-100 truncate block">
              {kingOf3.length > 0 ? kingOf3.map(p => p.name).join(', ') : 'Nadie'}
            </strong>
            <span className="text-xs text-slate-400">
              {max3Count > 0 ? `${max3Count} veces en el pozo (9º)` : '0 veces'}
            </span>
          </div>
        </div>

        {/* 2. El Muro (0€ Pagados) */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/25 p-4 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl flex-shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
              Invictos a 0.00€
            </span>
            <strong className="font-display text-base font-bold text-slate-100 truncate block">
              {cleanPlayers.length > 0 ? cleanPlayers.map(p => p.name).join(', ') : 'Ninguno'}
            </strong>
            <span className="text-xs text-slate-400">
              {cleanPlayers.length} participante(s) sin multas
            </span>
          </div>
        </div>

        {/* 3. Total Multas Aplicadas */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/25 p-4 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl flex-shrink-0 border border-amber-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
              Total Recaudación
            </span>
            <strong className="font-display text-base font-bold text-slate-100 truncate block">
              {globalStats.totalPot.toFixed(2)}€ Recaudados
            </strong>
            <span className="text-xs text-slate-400">
              {totalPenaltiesGiven} sanciones en {globalStats.computedJourneys} fechas
            </span>
          </div>
        </div>

      </div>

      {/* Section 1: Reparto del Bote Acumulado (Donut + Progress Cards) */}
      <div className="rounded-2xl bg-surface/90 border border-surface-border p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Reparto Detallado del Bote</span>
            </h3>
            <p className="text-xs text-slate-400">
              Contribución exacta de cada participante al fondo común
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold self-start sm:self-auto">
            {globalStats.totalPot.toFixed(2)}€ Bote Actual
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Donut Chart with Center Text */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="h-56 w-56 sm:h-64 sm:w-64 relative flex items-center justify-center">
              <Doughnut data={donutData} options={donutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total</span>
                <span className="font-display text-2xl font-extrabold text-white">{globalStats.totalPot.toFixed(2)}€</span>
                <span className="text-[10px] text-emerald-400 font-medium">{globalStats.progressPercent.toFixed(1)}% est.</span>
              </div>
            </div>
          </div>

          {/* Player Share Bars */}
          <div className="lg:col-span-7 space-y-2.5">
            {ranking.map((player, idx) => {
              const pct = globalStats.totalPot > 0 ? (player.totalPaid / globalStats.totalPot) * 100 : 0;
              const color = colorPalette[idx % colorPalette.length];

              return (
                <div
                  key={player.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: player.totalPaid > 0 ? color : '#334155' }} />
                      <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-display font-bold text-[10px] text-slate-300">
                        {player.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-200">{player.name}</span>
                      {player.rank === 1 && player.totalPaid > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-extrabold">LÍDER</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-slate-100">{player.totalPaid.toFixed(2)}€</span>
                      <span className="text-[11px] font-mono text-slate-400 w-12 text-right">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, pct)}%`,
                        backgroundColor: player.totalPaid > 0 ? color : 'transparent'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Section 2: Desglose de Sanciones por Jugador (Reemplazo de la gráfica confusa) */}
      <div className="rounded-2xl bg-surface/90 border border-surface-border p-5 sm:p-6 shadow-md space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span>Contador de Sanciones por Posición</span>
            </h3>
            <p className="text-xs text-slate-400">
              Frecuencia con la que cada participante ha caído en las posiciones sancionadas
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
            <button
              onClick={() => setFilterPenalty('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterPenalty === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterPenalty('p3')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                filterPenalty === 'p3' ? 'bg-red-500/30 text-red-300 font-bold' : 'text-slate-400 hover:text-red-400'
              }`}
            >
              9º (3€)
            </button>
            <button
              onClick={() => setFilterPenalty('p2')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                filterPenalty === 'p2' ? 'bg-orange-500/30 text-orange-300 font-bold' : 'text-slate-400 hover:text-orange-400'
              }`}
            >
              8º (2€)
            </button>
            <button
              onClick={() => setFilterPenalty('p1')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                filterPenalty === 'p1' ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              7º (1€)
            </button>
            <button
              onClick={() => setFilterPenalty('p05')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                filterPenalty === 'p05' ? 'bg-slate-600 text-slate-200 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              6º (.5€)
            </button>
          </div>
        </div>

        {/* Global Penalty Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">9º (3.00€)</span>
            <strong className="font-display text-xl font-bold text-red-400">{totalP3}</strong>
            <span className="text-[10px] text-slate-400 block">{(totalP3 * 3).toFixed(2)}€ aportados</span>
          </div>

          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">8º (2.00€)</span>
            <strong className="font-display text-xl font-bold text-orange-400">{totalP2}</strong>
            <span className="text-[10px] text-slate-400 block">{(totalP2 * 2).toFixed(2)}€ aportados</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">7º (1.00€)</span>
            <strong className="font-display text-xl font-bold text-amber-400">{totalP1}</strong>
            <span className="text-[10px] text-slate-400 block">{(totalP1 * 1).toFixed(2)}€ aportados</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">6º (0.50€)</span>
            <strong className="font-display text-xl font-bold text-slate-200">{totalP05}</strong>
            <span className="text-[10px] text-slate-400 block">{(totalP05 * 0.5).toFixed(2)}€ aportados</span>
          </div>
        </div>

        {/* Breakdown by Participant Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Participante</th>
                <th className="py-2.5 px-2 text-center text-red-400 font-bold">9º (3€)</th>
                <th className="py-2.5 px-2 text-center text-orange-400 font-bold">8º (2€)</th>
                <th className="py-2.5 px-2 text-center text-amber-400 font-bold">7º (1€)</th>
                <th className="py-2.5 px-2 text-center text-slate-300 font-bold">6º (.5€)</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-200">Total Multas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedBySanctions.map(player => {
                const totalFinesCount = player.penaltyCounts.p3 + player.penaltyCounts.p2 + player.penaltyCounts.p1 + player.penaltyCounts.p05;

                return (
                  <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-display font-bold text-[10px] text-slate-300">
                          {player.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold">{player.name}</span>
                      </div>
                    </td>
                    
                    {/* 3€ Count */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                        player.penaltyCounts.p3 > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-600'
                      }`}>
                        {player.penaltyCounts.p3}
                      </span>
                    </td>

                    {/* 2€ Count */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                        player.penaltyCounts.p2 > 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-600'
                      }`}>
                        {player.penaltyCounts.p2}
                      </span>
                    </td>

                    {/* 1€ Count */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                        player.penaltyCounts.p1 > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-600'
                      }`}>
                        {player.penaltyCounts.p1}
                      </span>
                    </td>

                    {/* 0.5€ Count */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-semibold ${
                        player.penaltyCounts.p05 > 0 ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'text-slate-600'
                      }`}>
                        {player.penaltyCounts.p05}
                      </span>
                    </td>

                    {/* Total Fines & Amount */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="font-bold text-amber-400 font-display mr-1.5">{player.totalPaid.toFixed(2)}€</span>
                      <span className="text-[11px] text-slate-500">({totalFinesCount} veces)</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

