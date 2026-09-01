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
    <div className="rounded-2xl bg-surface/90 border border-surface-border p-4 sm:p-6 shadow-md">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-100">
            Clasificación General del Bote
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
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
            className="w-full sm:w-60 pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-surface-border text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Mobile Card-List View (< sm) */}
      <div className="block sm:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
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
                className={`p-3 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer ${
                  isLeader
                    ? 'bg-amber-500/[0.08] border-amber-500/30 shadow-sm'
                    : isRata
                    ? 'bg-emerald-500/[0.04] border-emerald-500/25'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-display font-bold ${
                        isLeader
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : player.rank === 2
                          ? 'bg-slate-700 text-slate-200'
                          : player.rank === 3
                          ? 'bg-amber-900/60 text-amber-200 border border-amber-800/60'
                          : isRata
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {player.rank}º
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center font-display font-bold text-xs text-slate-300">
                      {player.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-sm text-slate-100 block font-semibold">{player.name}</strong>
                      {isLeader ? (
                        <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> PAGA LA COCA
                        </span>
                      ) : isRata ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> EL RATA (0€)
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-base text-slate-100 block">
                      {player.totalPaid.toFixed(2)}€
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {percent.toFixed(1)}% bote
                    </span>
                  </div>
                </div>

                {/* Micro Penalty Badges on Mobile */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-[10px]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">3€:{player.penaltyCounts.p3}</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400">2€:{player.penaltyCounts.p2}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">1€:{player.penaltyCounts.p1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">.5€:{player.penaltyCounts.p05}</span>
                  </div>
                  <span className="text-amber-400/80 font-semibold flex items-center gap-0.5 text-[10px]">
                    Ver historial <ChevronRight className="w-3 h-3" />
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
            <tr className="border-b border-surface-border text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3 w-14 text-center">Pos</th>
              <th className="py-3 px-3">Participante</th>
              <th className="py-3 px-3 text-right">Total Deuda</th>
              <th className="py-3 px-3 text-center">% Bote</th>
              <th className="py-3 px-3 text-center">Sanciones (3€ · 2€ · 1€ · 0.5€)</th>
              <th className="py-3 px-3 text-center">Título</th>
              <th className="py-3 px-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
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
                        ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                        : isRata
                        ? 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05]'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-display font-bold ${
                          isLeader
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : player.rank === 2
                            ? 'bg-slate-700 text-slate-200'
                            : player.rank === 3
                            ? 'bg-amber-900/60 text-amber-200 border border-amber-800/60'
                            : isRata
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {player.rank}º
                      </span>
                    </td>

                    {/* Participant Avatar & Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center font-display font-bold text-xs text-slate-300 group-hover:border-amber-500/40 group-hover:text-amber-300 transition-colors">
                          {player.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors block">
                            {player.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-display font-bold text-base text-slate-100">
                        {player.totalPaid.toFixed(2)}€
                      </span>
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center gap-1 w-20">
                        <span className="text-xs font-medium text-slate-300">
                          {percent.toFixed(1)}%
                        </span>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Penalty breakdown */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20" title="Multas de 3.00€">
                          3€: {player.penaltyCounts.p3}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20" title="Multas de 2.00€">
                          2€: {player.penaltyCounts.p2}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Multas de 1.00€">
                          1€: {player.penaltyCounts.p1}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700" title="Multas de 0.50€">
                          0.5€: {player.penaltyCounts.p05}
                        </span>
                      </div>
                    </td>

                    {/* Honorific Title */}
                    <td className="py-3.5 px-3 text-center">
                      {isLeader ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-400">
                          <Crown className="w-3 h-3" /> PAGA LA COCA
                        </span>
                      ) : isRata ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                          <Shield className="w-3 h-3" /> EL RATA
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">En juego</span>
                      )}
                    </td>

                    {/* Chevron */}
                    <td className="py-3.5 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors inline" />
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

