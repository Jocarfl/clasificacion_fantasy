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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-surface border-t sm:border border-surface-border p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
            {player.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                {player.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-amber-400 border border-amber-500/20">
                {player.rank}º Posición
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {player.honorificTitle ? `${player.honorificTitle} • ` : ''}
              {player.percentageOfPot.toFixed(1)}% de la deuda total del grupo
            </p>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="rounded-xl bg-slate-900/80 border border-surface-border p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
              Total Deuda
            </span>
            <strong className="font-display text-lg font-bold text-amber-400">
              {player.totalPaid.toFixed(2)}€
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-surface-border p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
              % del Bote
            </span>
            <strong className="font-display text-lg font-bold text-slate-200">
              {player.percentageOfPot.toFixed(1)}%
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-surface-border p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
              Multas 9º (3€)
            </span>
            <strong className="font-display text-lg font-bold text-red-400">
              {player.penaltyCounts.p3}
            </strong>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-surface-border p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
              Multas 8º (2€)
            </span>
            <strong className="font-display text-lg font-bold text-orange-400">
              {player.penaltyCounts.p2}
            </strong>
          </div>
        </div>

        {/* Journey History */}
        <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Historial Jornada a Jornada
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto pr-1 flex-1 max-h-48 sm:max-h-56">
            {journeys.map(j => {
              const amount = Number(j.penalties?.[player.id] || 0);
              let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              if (amount === 3.0) badgeColor = 'bg-red-500/20 text-red-400 border-red-500/40 font-bold';
              else if (amount === 2.0) badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-bold';
              else if (amount === 1.0) badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
              else if (amount === 0.5) badgeColor = 'bg-slate-700 text-slate-300 border-slate-600';

              return (
                <div
                  key={j.journey}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs ${badgeColor}`}
                >
                  <span className="text-[10px] text-slate-400">J{j.journey}</span>
                  <span className="font-display font-semibold">{amount > 0 ? `${amount.toFixed(2)}€` : '0€'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-5 pt-3 border-t border-surface-border flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};

