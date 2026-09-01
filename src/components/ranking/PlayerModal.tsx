import React from 'react';
import { X } from 'lucide-react';
import { ParticipantStats, JourneyRecord } from '../../types/fantasy';

interface PlayerModalProps {
  player: ParticipantStats | null;
  journeys: JourneyRecord[];
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, journeys, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-surface-card border-t sm:border-2 border-slate-700 p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-600 rounded-full mx-auto mb-3" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-slate-800 border-2 border-amber-400/60 flex items-center justify-center font-display font-black text-xl sm:text-2xl text-amber-200 shadow-lg shadow-amber-500/10">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {player.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-black text-amber-300 border border-amber-400/50">
                {player.rank}º Posición
              </span>
              {player.isUpToDate ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-xs font-black text-emerald-300 border border-emerald-400/50">
                  ✓ Al día
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-red-500/25 text-xs font-black text-red-300 border border-red-500/50">
                  Debe {player.totalSettledPending.toFixed(2)}€
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {player.honorificTitle ? `${player.honorificTitle} • ` : ''}
              {player.percentageOfPot.toFixed(1)}% de la deuda total del grupo
            </p>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="rounded-xl bg-slate-900 border-2 border-amber-400/40 p-2.5 text-center shadow-sm">
            <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider block mb-0.5">
              Total Deuda
            </span>
            <strong className="font-display text-lg font-black text-white">
              {player.totalPaid.toFixed(2)}€
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-center shadow-sm">
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block mb-0.5">
              % del Bote
            </span>
            <strong className="font-display text-lg font-black text-amber-300">
              {player.percentageOfPot.toFixed(1)}%
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900 border border-red-500/40 p-2.5 text-center shadow-sm">
            <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider block mb-0.5">
              Multas 9º (3€)
            </span>
            <strong className="font-display text-lg font-black text-red-300">
              {player.penaltyCounts.p3}
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900 border border-orange-500/40 p-2.5 text-center shadow-sm">
            <span className="text-[10px] text-orange-300 uppercase font-bold tracking-wider block mb-0.5">
              Multas 8º (2€)
            </span>
            <strong className="font-display text-lg font-black text-orange-300">
              {player.penaltyCounts.p2}
            </strong>
          </div>
        </div>

        {/* Journey History */}
        <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Historial Jornada a Jornada
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto pr-1 flex-1 max-h-48 sm:max-h-56">
            {journeys.map(j => {
              const amount = Number(j.penalties?.[player.id] || 0);
              let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
              if (amount === 3.0) badgeColor = 'bg-red-500/30 text-red-300 border-red-500/60 font-black shadow-sm';
              else if (amount === 2.0) badgeColor = 'bg-orange-500/30 text-orange-300 border-orange-500/60 font-black shadow-sm';
              else if (amount === 1.0) badgeColor = 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-black shadow-sm';
              else if (amount === 0.5) badgeColor = 'bg-slate-700 text-slate-100 border-slate-500 font-bold';

              return (
                <div
                  key={j.journey}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs ${badgeColor}`}
                >
                  <span className="text-[10px] text-slate-300 font-medium">J{j.journey}</span>
                  <span className="font-display font-black">{amount > 0 ? `${amount.toFixed(2)}€` : '0€'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-5 pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors border border-slate-600"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};

