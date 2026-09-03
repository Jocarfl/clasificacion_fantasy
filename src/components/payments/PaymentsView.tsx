import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Share2, Clock, Wallet } from 'lucide-react';
import { LeagueData, CalculatedStats } from '../../types/fantasy';
import { DataService } from '../../services/dataService';

interface PaymentsViewProps {
  data: LeagueData;
  stats: CalculatedStats;
  onShowToast: (msg: string) => void;
  onTogglePayment: (blockId: string, playerId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ data, stats, onShowToast, onTogglePayment }) => {
  const { settlements, globalStats } = stats;

  // Select first in-progress/completed settlement by default
  const defaultBlockId = settlements.find(s => s.isInProgress || s.isCompleted)?.id || settlements[0]?.id || 'tramo-1';
  const [selectedBlockId, setSelectedBlockId] = useState<string>(defaultBlockId);

  const activeSettlement = settlements.find(s => s.id === selectedBlockId) || settlements[0];

  const handleCopyWhatsApp = async () => {
    if (!activeSettlement) return;
    const text = DataService.generatePaymentWhatsAppSummary(data, activeSettlement.id);
    try {
      await navigator.clipboard.writeText(text);
      onShowToast('✓ Resumen del tramo para WhatsApp copiado al portapapeles');
    } catch {
      prompt('Copia el texto para WhatsApp:', text);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>Liquidación de Pagos (Cada 4 Jornadas)</span>
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Control y seguimiento de transferencias al fondo común en bloques de 4 fechas
          </p>
        </div>
      </div>

      {/* 3 Main Account Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* 1. Total Bote */}
        <div className="rounded-2xl bg-surface-card border border-surface-border p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl flex-shrink-0 border border-amber-500/40">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-300 block">
              Bote Total Acumulado
            </span>
            <strong className="font-display text-2xl font-black text-white block">
              {globalStats.totalPot.toFixed(2)}€
            </strong>
            <span className="text-xs text-slate-300 font-medium">
              {globalStats.computedJourneys} jornadas disputadas
            </span>
          </div>
        </div>

        {/* 2. Ingresado en Cuenta */}
        <div className="rounded-2xl bg-surface-card border-2 border-emerald-500/40 p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 text-emerald-300 flex items-center justify-center text-xl flex-shrink-0 border border-emerald-500/50">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 block">
              Ingresado en Cuenta
            </span>
            <strong className="font-display text-2xl font-black text-emerald-300 block">
              {globalStats.totalCollectedInBank.toFixed(2)}€
            </strong>
            <span className="text-xs text-slate-300 font-medium">
              {globalStats.totalPot > 0
                ? `${((globalStats.totalCollectedInBank / globalStats.totalPot) * 100).toFixed(0)}% cobrado`
                : '0% cobrado'}
            </span>
          </div>
        </div>

        {/* 3. Pendiente de Transferencia */}
        <div className="rounded-2xl bg-surface-card border-2 border-amber-500/40 p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/25 text-amber-300 flex items-center justify-center text-xl flex-shrink-0 border border-amber-500/50">
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block">
              Pendiente de Transferir
            </span>
            <strong className="font-display text-2xl font-black text-amber-300 block">
              {globalStats.totalPendingCollection.toFixed(2)}€
            </strong>
            <span className="text-xs text-slate-300 font-medium">
              Por ingresar en cuenta
            </span>
          </div>
        </div>

      </div>

      {/* Tramo Selection Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Seleccionar Tramo de Liquidación
          </h3>
          <span className="text-xs text-amber-300 font-bold">10 tramos en la temporada</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {settlements.map((s, idx) => {
            const isSelected = s.id === selectedBlockId;
            const isFullyPaid = s.totalBlockDebt > 0 && s.totalBlockPending === 0;
            const hasPending = s.totalBlockPending > 0;

            return (
              <button
                key={s.id}
                onClick={() => setSelectedBlockId(s.id)}
                className={`flex-shrink-0 flex flex-col p-3 rounded-2xl border-2 transition-all min-w-[135px] text-left ${
                  isSelected
                    ? 'bg-slate-850 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-900 border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    Tramo {idx + 1}
                  </span>
                  {isFullyPaid ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" title="Cobrado al 100%" />
                  ) : hasPending ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" title="Pendiente de pago" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" title="Pendiente de disputar" />
                  )}
                </div>

                <span className="text-[11px] text-slate-300 font-medium">
                  J{s.startJourney} - J{s.endJourney}
                </span>

                <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-white">{s.totalBlockDebt.toFixed(2)}€</span>
                  {isFullyPaid ? (
                    <span className="text-emerald-400 text-[10px]">✓ Cobrado</span>
                  ) : hasPending ? (
                    <span className="text-red-400 text-[10px]">-{s.totalBlockPending.toFixed(2)}€</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">En juego</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Settlement Spotlight Card */}
      {activeSettlement && (
        <div className="rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 shadow-xl space-y-5">
          
          {/* Header of Active Tramo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-4 gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                {activeSettlement.isCompleted
                  ? 'Tramo Finalizado (Listo para Cobro)'
                  : activeSettlement.isInProgress
                  ? 'Tramo en Curso'
                  : 'Tramo Futuro'}
              </span>
              <h3 className="font-display text-2xl font-black text-white">
                {activeSettlement.label}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Total acumulado en este bloque: <strong className="text-amber-300">{activeSettlement.totalBlockDebt.toFixed(2)}€</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-700 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Recaudado</span>
                <strong className="font-display text-sm sm:text-base font-black text-emerald-400">
                  {activeSettlement.totalBlockCollected.toFixed(2)}€
                </strong>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-700 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Pendiente</span>
                <strong className="font-display text-sm sm:text-base font-black text-red-400">
                  {activeSettlement.totalBlockPending.toFixed(2)}€
                </strong>
              </div>
            </div>
          </div>

          {/* Participant Payment Status List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Estado de Transferencias de los Participantes
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSettlement.players.map(p => {
                const isFree = p.debtInBlock === 0;
                const isPaid = p.paid && !isFree;
                const isPending = !p.paid && !isFree;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                      isPaid
                        ? 'bg-emerald-500/[0.06] border-emerald-500/40'
                        : isPending
                        ? 'bg-red-500/[0.08] border-red-500/50 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center font-display font-black text-xs text-white">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-white block">{p.name}</strong>
                        <span className="text-[11px] text-slate-300">
                          {isFree ? (
                            <span className="text-emerald-400 font-bold">0.00€ en este tramo</span>
                          ) : (
                            <span>Total tramo: <strong>{p.debtInBlock.toFixed(2)}€</strong></span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      {isFree ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Libre (0€)
                        </span>
                      ) : isPaid ? (
                        <button
                          type="button"
                          onClick={() => {
                            onTogglePayment(activeSettlement.id, p.id);
                            onShowToast(`Marcado como pendiente para ${p.name}`);
                          }}
                          title="Haz clic para marcar como pendiente de pago"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400 text-xs font-black shadow-sm transition-all active:scale-95 group/btn"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>PAGADO ✓</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onTogglePayment(activeSettlement.id, p.id);
                            onShowToast(`✓ ¡Marcado como pagado para ${p.name}!`);
                          }}
                          title="Haz clic para marcar como pagado"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/30 hover:bg-red-500/45 text-red-200 border border-red-400 text-xs font-black shadow-sm transition-all active:scale-95 group/btn"
                        >
                          <AlertCircle className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform" />
                          <span>DEBE {p.debtInBlock.toFixed(2)}€</span>
                          <span className="text-[10px] opacity-75 font-normal ml-0.5">(Marcar pagado)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action: Copy WhatsApp Summary */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
              <div>
                <strong className="text-sm font-bold text-white block">
                  ¿Listo para pedir al grupo?
                </strong>
                <span className="text-xs text-slate-300">
                  Copia la lista con los checks actualizados (❌ debe / ✅ pagado) y la nota de Bizum a Josep.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyWhatsApp}
                title="Copiar lista de pagos para pegar en WhatsApp"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex-shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Copiar Mensaje para WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Info Footer */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-3 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              💡 Pulsa sobre <strong>DEBE / PAGADO</strong> en cualquier tarjeta para alternar el estado antes de copiar el texto para el grupo.
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
