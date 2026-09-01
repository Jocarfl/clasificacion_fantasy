import React, { useState } from 'react';
import { Table, Calendar, Grid, CheckCircle2, Clock } from 'lucide-react';
import { LeagueData, CalculatedStats } from '../../types/fantasy';

interface JourneyViewProps {
  data: LeagueData;
  stats: CalculatedStats;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ data, stats }) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [selectedJourneyNum, setSelectedJourneyNum] = useState<number>(() => {
    return stats.globalStats.lastUpdatedJourney || 1;
  });

  const totalJourneys = data.totalJourneys || 38;
  const participants = data.participants || [];
  const selectedJourney = data.journeys?.find(j => j.journey === selectedJourneyNum);

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
            {viewMode === 'matrix' ? (
              <Table className="w-5 h-5 text-amber-400" />
            ) : (
              <Calendar className="w-5 h-5 text-amber-400" />
            )}
            <span>{viewMode === 'matrix' ? 'Total 38 Jornadas' : 'Detalle de Jornada a Jornada'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'matrix'
              ? 'Visión global de todas las multas acumuladas por participante a lo largo de la temporada'
              : 'Consulta los resultados y sanciones asignadas en cada fecha disputada'}
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-surface-border self-start sm:self-auto">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'matrix'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Total 38J</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'cards'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Por Jornada</span>
          </button>
        </div>
      </div>

      {viewMode === 'matrix' ? (
        /* 1. Full 38-Journey Matrix View */
        <div className="space-y-4">
          {/* Legend & Swipe Tip */}
          <div className="rounded-2xl bg-surface/80 border border-surface-border p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1">Leyenda:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                3.00€ (9º)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                2.00€ (8º)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                1.00€ (7º)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/80 text-slate-300 border border-slate-600 font-medium">
                0.50€ (6º)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                0.00€ (Libre)
              </span>
            </div>
            <div className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
              <span>👉 Desliza horizontalmente para ver las 38 fechas</span>
            </div>
          </div>

          {/* 38J Matrix Table */}
          <div className="rounded-2xl bg-surface/90 border border-surface-border shadow-xl overflow-hidden">
            <div className="overflow-x-auto relative">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-900 text-slate-300 text-[11px]">
                    <th className="py-3 px-3.5 text-left sticky left-0 bg-slate-900 z-20 font-bold shadow-[3px_0_6px_rgba(0,0,0,0.4)] min-w-[130px] sm:min-w-[150px] border-r border-slate-800">
                      Participante
                    </th>
                    <th className="py-3 px-3 text-right font-bold text-amber-400 min-w-[70px] sm:min-w-[80px] border-r border-slate-800/80 bg-slate-900/90">
                      Total
                    </th>
                    {Array.from({ length: totalJourneys }, (_, i) => {
                      const jNum = i + 1;
                      const isPlayed = data.journeys?.some(j => j.journey === jNum && j.completed);
                      return (
                        <th
                          key={i}
                          className={`py-3 px-1.5 text-center min-w-[38px] sm:min-w-[42px] font-mono font-semibold ${isPlayed ? 'text-slate-200 bg-slate-900/70' : 'text-slate-600 bg-slate-950/40'
                            }`}
                        >
                          <span className={isPlayed ? 'text-amber-400 font-bold' : ''}>J{jNum}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {participants.map(p => {
                    const pStats = stats.ranking.find(r => r.id === p.id);
                    const isLeader = pStats?.rank === 1 && (pStats?.totalPaid || 0) > 0;
                    const isRata = pStats?.honorificTitle === 'El Rata';

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Sticky Name */}
                        <td className="py-2.5 px-3.5 sticky left-0 bg-slate-900 z-10 font-medium text-slate-100 whitespace-nowrap shadow-[3px_0_6px_rgba(0,0,0,0.4)] min-w-[130px] sm:min-w-[150px] border-r border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{p.avatar}</span>
                            <span className="font-semibold text-slate-200">{p.name}</span>
                            {isLeader && <span className="text-[10px] text-amber-400 font-bold">👑</span>}
                            {isRata && <span className="text-[10px] text-emerald-400 font-bold">🛡️</span>}
                          </div>
                        </td>

                        {/* Total Column */}
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400 font-display whitespace-nowrap min-w-[70px] sm:min-w-[80px] border-r border-slate-800/80 bg-slate-900/50">
                          {pStats ? `${pStats.totalPaid.toFixed(2)}€` : '0.00€'}
                        </td>

                        {/* 38 Journey Cells */}
                        {Array.from({ length: totalJourneys }, (_, i) => {
                          const jNum = i + 1;
                          const jRec = data.journeys?.find(j => j.journey === jNum);
                          const amt = jRec?.completed ? Number(jRec.penalties?.[p.id] || 0) : null;

                          let cellBadge = (
                            <span className="text-slate-700 select-none text-[11px]">-</span>
                          );

                          if (amt !== null) {
                            if (amt === 0) {
                              cellBadge = (
                                <span className="inline-block w-5 h-5 leading-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                  0
                                </span>
                              );
                            } else if (amt === 3.0) {
                              cellBadge = (
                                <span className="inline-block px-1.5 py-0.5 rounded-md bg-red-500/25 text-red-400 border border-red-500/40 text-[11px] font-bold shadow-sm">
                                  3€
                                </span>
                              );
                            } else if (amt === 2.0) {
                              cellBadge = (
                                <span className="inline-block px-1.5 py-0.5 rounded-md bg-orange-500/25 text-orange-400 border border-orange-500/40 text-[11px] font-bold shadow-sm">
                                  2€
                                </span>
                              );
                            } else if (amt === 1.0) {
                              cellBadge = (
                                <span className="inline-block px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-400 border border-amber-500/40 text-[11px] font-bold shadow-sm">
                                  1€
                                </span>
                              );
                            } else if (amt === 0.5) {
                              cellBadge = (
                                <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-700 text-slate-200 border border-slate-600 text-[10px] font-semibold">
                                  .5€
                                </span>
                              );
                            }
                          }

                          return (
                            <td key={i} className="py-2 px-1 text-center font-mono align-middle">
                              {cellBadge}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Detail by Date / Journey View */
        <div className="space-y-6">
          {/* Horizontal Journey Pills Slider */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: totalJourneys }, (_, i) => {
              const jNum = i + 1;
              const isPlayed = data.journeys?.some(j => j.journey === jNum && j.completed);
              const isSelected = selectedJourneyNum === jNum;

              return (
                <button
                  key={jNum}
                  onClick={() => setSelectedJourneyNum(jNum)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-105'
                    : isPlayed
                      ? 'bg-slate-800/90 text-slate-200 border border-slate-700 hover:border-slate-500'
                      : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-400'
                    }`}
                >
                  <span>J{jNum}</span>
                  {isPlayed ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Journey Spotlight Card */}
          <div className="rounded-2xl bg-surface/90 border border-surface-border p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {selectedJourney?.completed ? 'Jornada Finalizada' : 'Jornada Pendiente'}
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-100">
                  Jornada {selectedJourneyNum}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Bote de la Fecha</span>
                <span className="font-display text-xl font-bold text-amber-400">
                  {selectedJourney?.completed ? '6.50€' : '0.00€'}
                </span>
              </div>
            </div>

            {selectedJourney?.completed ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Penalties List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Sancionados en esta Jornada
                  </h4>
                  {participants.map(p => {
                    const amt = selectedJourney.penalties?.[p.id] || 0;
                    if (amt === 0) return null;

                    let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
                    let posLabel = '6º Clasificado';
                    if (amt === 3.0) {
                      badgeStyle = 'bg-red-500/15 text-red-400 border-red-500/30';
                      posLabel = '9º (Último)';
                    } else if (amt === 2.0) {
                      badgeStyle = 'bg-orange-500/15 text-orange-400 border-orange-500/30';
                      posLabel = '8º (Penúltimo)';
                    } else if (amt === 1.0) {
                      badgeStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                      posLabel = '7º Clasificado';
                    }

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{p.avatar}</span>
                          <div>
                            <strong className="text-sm text-slate-100 block">{p.name}</strong>
                            <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full border mt-0.5 ${badgeStyle}`}>
                              {posLabel}
                            </span>
                          </div>
                        </div>
                        <span className="font-display font-bold text-base text-slate-100">
                          {amt.toFixed(2)}€
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Safe Participants */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                    Libres de Multa (0.00€)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {participants.map(p => {
                      const amt = selectedJourney.penalties?.[p.id] || 0;
                      if (amt > 0) return null;
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300"
                        >
                          <span>{p.avatar}</span>
                          <span className="font-medium truncate">{p.name}</span>
                          <span className="ml-auto text-emerald-400 text-[10px] font-bold">0€</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Esta jornada aún no ha sido disputada</p>
                <p className="text-xs text-slate-600 mt-1">Los datos se actualizarán cuando finalicen los partidos</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
