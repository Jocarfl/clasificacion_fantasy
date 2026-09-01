import React, { useState } from 'react';
import { Search, ChevronRight, Crown, Shield } from 'lucide-react';
import { ParticipantStats } from '../../types/fantasy';

interface RankingTableProps {
  ranking: ParticipantStats[];
  totalPot: number;
  onSelectPlayer: (player: ParticipantStats) => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({
  ranking,
  totalPot,
  onSelectPlayer
}) => {
  const [search, setSearch] = useState('');

  const filtered = ranking.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="rounded-2xl bg-surface-card border border-surface-border p-4 sm:p-6 shadow-xl">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-black text-white">
            Clasificación General del Bote
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Ordenado de mayor a menor aportación acumulada
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar participante..."
            className="w-full sm:w-60 pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
          />
        </div>
      </div>

      {/* Mobile Card-List View (< sm) */}
      <div className="block sm:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No se encontraron resultados para "{search}"
          </div>
        ) : (
          filtered.map(player => {
            const percent = totalPot > 0 ? (player.totalPaid / totalPot) * 100 : 0;
            const isLeader = player.rank === 1 && player.totalPaid > 0;
            const isRata = player.honorificTitle === 'El Rata';

            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className={`p-3.5 rounded-2xl border-2 transition-all active:scale-[0.98] cursor-pointer ${
                  isLeader
                    ? 'bg-gradient-to-r from-amber-500/15 to-slate-900 border-amber-400/60 shadow-md shadow-amber-500/10'
                    : isRata
                    ? 'bg-gradient-to-r from-emerald-500/10 to-slate-900 border-emerald-400/50 shadow-sm'
                    : 'bg-slate-900 border-slate-700/80 hover:bg-slate-850 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-display font-black ${
                        isLeader
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : player.rank === 2
                          ? 'bg-slate-200 text-slate-900 shadow-sm'
                          : player.rank === 3
                          ? 'bg-amber-700 text-amber-100 border border-amber-500'
                          : isRata
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {player.rank}º
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-display font-black text-xs text-white">
                      {player.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-sm text-white block font-bold">{player.name}</strong>
                      {isLeader ? (
                        <span className="text-[10px] text-amber-300 font-black flex items-center gap-0.5">
                          <Crown className="w-3 h-3 text-amber-300" /> PAGA LA COCA
                        </span>
                      ) : isRata ? (
                        <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5">
                          <Shield className="w-3 h-3 text-emerald-300" /> EL RATA (0€)
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-base text-white block">
                      {player.totalPaid.toFixed(2)}€
                    </span>
                    <span className="text-[11px] text-amber-300/90 font-mono font-bold">
                      {percent.toFixed(1)}% bote
                    </span>
                  </div>
                </div>

                {/* Micro Penalty Badges on Mobile */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/80 text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-red-500/25 text-red-300 border border-red-500/40">3€:{player.penaltyCounts.p3}</span>
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/25 text-orange-300 border border-orange-500/40">2€:{player.penaltyCounts.p2}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40">1€:{player.penaltyCounts.p1}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">.5€:{player.penaltyCounts.p05}</span>
                  </div>
                  <span className="text-amber-300 font-bold flex items-center gap-0.5 text-[11px]">
                    Ver <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (>= sm) */}
      <div className="hidden sm:block overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-900/80 text-xs font-black uppercase tracking-wider text-slate-200">
              <th className="py-3.5 px-3 w-14 text-center">Pos</th>
              <th className="py-3.5 px-3">Participante</th>
              <th className="py-3.5 px-3 text-right">Total Deuda</th>
              <th className="py-3.5 px-3 text-center">% Bote</th>
              <th className="py-3.5 px-3 text-center">Sanciones (3€ · 2€ · 1€ · 0.5€)</th>
              <th className="py-3.5 px-3 text-center">Título</th>
              <th className="py-3.5 px-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                  No se encontraron resultados para "{search}"
                </td>
              </tr>
            ) : (
              filtered.map((player) => {
                const percent = totalPot > 0 ? (player.totalPaid / totalPot) * 100 : 0;
                const isLeader = player.rank === 1 && player.totalPaid > 0;
                const isRata = player.honorificTitle === 'El Rata';

                return (
                  <tr
                    key={player.id}
                    onClick={() => onSelectPlayer(player)}
                    className={`group cursor-pointer transition-colors ${
                      isLeader
                        ? 'bg-amber-500/10 hover:bg-amber-500/20'
                        : isRata
                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-display font-black ${
                          isLeader
                            ? 'bg-amber-400 text-slate-950 shadow-md'
                            : player.rank === 2
                            ? 'bg-slate-200 text-slate-900'
                            : player.rank === 3
                            ? 'bg-amber-700 text-amber-100 border border-amber-500'
                            : isRata
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {player.rank}º
                      </span>
                    </td>

                    {/* Participant Avatar & Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-display font-black text-xs text-white group-hover:border-amber-400 group-hover:text-amber-300 transition-colors">
                          {player.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-amber-300 transition-colors block">
                            {player.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-display font-black text-base text-white">
                        {player.totalPaid.toFixed(2)}€
                      </span>
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center gap-1 w-20">
                        <span className="text-xs font-bold text-amber-300">
                          {percent.toFixed(1)}%
                        </span>
                        <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Penalty breakdown */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-red-500/25 text-red-300 border border-red-500/40" title="Multas de 3.00€">
                          3€: {player.penaltyCounts.p3}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/25 text-orange-300 border border-orange-500/40" title="Multas de 2.00€">
                          2€: {player.penaltyCounts.p2}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40" title="Multas de 1.00€">
                          1€: {player.penaltyCounts.p1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700" title="Multas de 0.50€">
                          0.5€: {player.penaltyCounts.p05}
                        </span>
                      </div>
                    </td>

                    {/* Payment Status (4J) */}
                    <td className="py-3.5 px-3 text-center">
                      {player.isUpToDate ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-black text-emerald-300">
                          ✓ Al día
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/25 border border-red-500/50 text-xs font-black text-red-300">
                          Debe {player.totalSettledPending.toFixed(2)}€
                        </span>
                      )}
                    </td>

                    {/* Honorific Title */}
                    <td className="py-3.5 px-3 text-center">
                      {isLeader ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/60 text-xs font-black text-amber-300">
                          <Crown className="w-3.5 h-3.5 text-amber-300" /> PAGA LA COCA
                        </span>
                      ) : isRata ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-xs font-black text-emerald-300">
                          <Shield className="w-3.5 h-3.5 text-emerald-300" /> EL RATA
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">En juego</span>
                      )}
                    </td>

                    {/* Chevron */}
                    <td className="py-3.5 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors inline" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

