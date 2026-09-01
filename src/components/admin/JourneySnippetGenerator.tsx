import React, { useState } from 'react';
import { Copy, Check, AlertCircle, Sparkles, MessageCircle, CreditCard, CheckCircle2 } from 'lucide-react';
import { LeagueData, SettlementBlock } from '../../types/fantasy';
import { DataService } from '../../services/dataService';

interface JourneySnippetGeneratorProps {
  data: LeagueData;
  onShowToast: (msg: string) => void;
}

export const JourneySnippetGenerator: React.FC<JourneySnippetGeneratorProps> = ({
  data,
  onShowToast
}) => {
  const [adminTab, setAdminTab] = useState<'journey' | 'payments'>('journey');
  const participants = data.participants || [];
  const totalJourneys = data.totalJourneys || 38;

  // Find next pending journey
  const nextJourneyNum = (() => {
    const played = data.journeys?.filter(j => j.completed).map(j => j.journey) || [];
    for (let i = 1; i <= totalJourneys; i++) {
      if (!played.includes(i)) return i;
    }
    return totalJourneys;
  })();

  const [journeyNum, setJourneyNum] = useState<number>(nextJourneyNum);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [pos9, setPos9] = useState<string>('');
  const [pos8, setPos8] = useState<string>('');
  const [pos7, setPos7] = useState<string>('');
  const [pos6, setPos6] = useState<string>('');

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Payments State
  const calculated = DataService.calculateStats(data);
  const [activeSettlementId, setActiveSettlementId] = useState<string>(
    calculated.settlements.find(s => s.isInProgress || s.isCompleted)?.id || calculated.settlements[0]?.id || 'tramo-1'
  );

  // Local settlements clone for editing
  const [localSettlements, setLocalSettlements] = useState<SettlementBlock[]>(() => {
    if (data.settlements && data.settlements.length > 0) {
      return JSON.parse(JSON.stringify(data.settlements));
    }
    return calculated.settlements.map(s => ({
      id: s.id,
      label: s.label,
      startJourney: s.startJourney,
      endJourney: s.endJourney,
      paidStatus: {}
    }));
  });

  const togglePlayerPayment = (blockId: string, playerId: string) => {
    setLocalSettlements(prev => {
      return prev.map(block => {
        if (block.id === blockId) {
          const current = block.paidStatus?.[playerId] ?? false;
          return {
            ...block,
            paidStatus: {
              ...block.paidStatus,
              [playerId]: !current
            }
          };
        }
        return block;
      });
    });
  };

  const handleCopyPaymentsJson = async () => {
    const jsonStr = JSON.stringify(localSettlements, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      onShowToast('✓ Bloque "settlements" copiado. Pégalo en data/fantasy_data.json');
    } catch {
      prompt('Copia los settlements:', jsonStr);
    }
  };

  // Validation
  const selected = [pos9, pos8, pos7, pos6].filter(Boolean);
  const hasDuplicates = selected.some((item, idx) => selected.indexOf(item) !== idx);
  const isComplete = selected.length === 4 && !hasDuplicates;

  // Build penalties map
  const buildPenalties = () => {
    const penalties: Record<string, number> = {};
    participants.forEach(p => {
      if (p.id === pos9) penalties[p.id] = 3.0;
      else if (p.id === pos8) penalties[p.id] = 2.0;
      else if (p.id === pos7) penalties[p.id] = 1.0;
      else if (p.id === pos6) penalties[p.id] = 0.5;
      else penalties[p.id] = 0.0;
    });
    return penalties;
  };

  const getSnippet = () => {
    return DataService.generateJourneyJsonSnippet(journeyNum, buildPenalties(), date);
  };

  const handleCopyJson = async () => {
    if (!isComplete) return;
    try {
      await navigator.clipboard.writeText(getSnippet());
      setCopiedJson(true);
      onShowToast('✓ Snippet JSON copiado. ¡Listo para pegar en data/fantasy_data.json!');
      setTimeout(() => setCopiedJson(false), 2500);
    } catch {
      prompt('Copia el JSON:', getSnippet());
    }
  };

  const handleCopyWhatsApp = async () => {
    if (!isComplete) return;
    const clone: LeagueData = JSON.parse(JSON.stringify(data));
    const idx = clone.journeys.findIndex(j => j.journey === journeyNum);
    const newRecord = { journey: journeyNum, date, completed: true, penalties: buildPenalties() };
    if (idx >= 0) clone.journeys[idx] = newRecord;
    else clone.journeys.push(newRecord);

    const text = DataService.generateWhatsAppSummary(clone, journeyNum);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWhatsApp(true);
      onShowToast('✓ Resumen para WhatsApp copiado al portapapeles');
      setTimeout(() => setCopiedWhatsApp(false), 2500);
    } catch {
      prompt('Copia para WhatsApp:', text);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Panel de Administración</span>
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Registra nuevas fechas o gestiona las transferencias de cobro por cada 4 jornadas
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface-card p-1.5 rounded-xl border border-surface-border self-start sm:self-auto">
          <button
            onClick={() => setAdminTab('journey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'journey'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nueva Jornada</span>
          </button>
          <button
            onClick={() => setAdminTab('payments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'payments'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Control de Cobros</span>
          </button>
        </div>
      </div>

      {adminTab === 'payments' ? (
        /* ================== PAYMENTS MANAGEMENT TAB ================== */
        <div className="rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-700 pb-4">
            <h3 className="font-display text-lg font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Marcar Pagos por Tramo (Cada 4 Jornadas)</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Haz clic en cada participante para marcar si ya ha transferido su deuda de ese bloque a la cuenta común.
            </p>
          </div>

          {/* Tramo Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {localSettlements.map((s, idx) => {
              const isSelected = s.id === activeSettlementId;
              const calcBlock = calculated.settlements.find(c => c.id === s.id);
              const debt = calcBlock?.totalBlockDebt || 0;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSettlementId(s.id)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                >
                  <span>Tramo {idx + 1} (J{s.startJourney}-J{s.endJourney})</span>
                  {debt > 0 && (
                    <span className={`block text-[10px] ${isSelected ? 'text-slate-900' : 'text-amber-400'}`}>
                      {debt.toFixed(2)}€
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Player List for Selected Tramo */}
          {(() => {
            const currentBlock = localSettlements.find(s => s.id === activeSettlementId) || localSettlements[0];
            const currentCalculated = calculated.settlements.find(s => s.id === activeSettlementId);

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Participantes en {currentBlock.label}
                  </h4>
                  <span className="text-xs text-slate-300">
                    Haz clic en el interruptor para cambiar el estado
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {participants.map(p => {
                    const debt = currentCalculated?.players.find(cp => cp.id === p.id)?.debtInBlock || 0;
                    const isPaid = debt === 0 ? true : (currentBlock.paidStatus?.[p.id] ?? false);
                    const isFree = debt === 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => !isFree && togglePlayerPayment(currentBlock.id, p.id)}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${isFree
                            ? 'bg-slate-900/40 border-slate-700/60 opacity-70 cursor-default'
                            : isPaid
                              ? 'bg-emerald-500/[0.08] border-emerald-500/50 cursor-pointer hover:bg-emerald-500/[0.12]'
                              : 'bg-red-500/[0.08] border-red-500/50 cursor-pointer hover:bg-red-500/[0.12]'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center font-display font-black text-xs text-white">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong className="text-sm font-bold text-white block">{p.name}</strong>
                            <span className="text-xs text-slate-300">
                              {isFree ? '0.00€ (Sin sanción)' : `Deuda del tramo: ${debt.toFixed(2)}€`}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Toggle Pill */}
                        <div>
                          {isFree ? (
                            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                              Libre (0€)
                            </span>
                          ) : isPaid ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400 text-xs font-black">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PAGADO ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/30 text-red-200 border border-red-400 text-xs font-black">
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" /> PENDIENTE
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions for Payments */}
                <div className="pt-4 border-t border-slate-700 flex items-center justify-end">
                  <button
                    onClick={handleCopyPaymentsJson}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    title="Copiar bloque de liquidaciones para pegar en data/fantasy_data.json"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar JSON Pagos</span>
                  </button>
                </div>

              </div>
            );
          })()}

        </div>
      ) : (
        /* ================== NEW JOURNEY GENERATOR TAB ================== */
        <div className="rounded-2xl bg-surface-card border border-surface-border p-6 shadow-xl space-y-6">

          {/* Journey & Date selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Número de Jornada
              </label>
              <select
                value={journeyNum}
                onChange={(e) => setJourneyNum(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-surface-border text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
              >
                {Array.from({ length: totalJourneys }, (_, i) => {
                  const j = i + 1;
                  const isPlayed = data.journeys?.some(item => item.journey === j && item.completed);
                  return (
                    <option key={j} value={j}>
                      Jornada {j} {isPlayed ? '(Ya registrada)' : '(Pendiente)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-surface-border text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* 4 Penalty Selectors */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Asignar Sanciones (Total: 6.50€)
            </h4>

            {/* 9th */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-red-500/20 gap-4">
              <div className="flex items-center gap-2.5 min-w-36">
                <span className="w-6 h-6 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">
                  9º
                </span>
                <div>
                  <strong className="text-xs text-slate-200 block">Último</strong>
                  <span className="text-[11px] text-red-400">3.00€</span>
                </div>
              </div>
              <select
                value={pos9}
                onChange={(e) => setPos9(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-surface-border text-xs text-slate-100 focus:outline-none focus:border-red-400"
              >
                <option value="">-- Seleccionar jugador --</option>
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* 8th */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-orange-500/20 gap-4">
              <div className="flex items-center gap-2.5 min-w-36">
                <span className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                  8º
                </span>
                <div>
                  <strong className="text-xs text-slate-200 block">Penúltimo</strong>
                  <span className="text-[11px] text-orange-400">2.00€</span>
                </div>
              </div>
              <select
                value={pos8}
                onChange={(e) => setPos8(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-surface-border text-xs text-slate-100 focus:outline-none focus:border-orange-400"
              >
                <option value="">-- Seleccionar jugador --</option>
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* 7th */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 gap-4">
              <div className="flex items-center gap-2.5 min-w-36">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                  7º
                </span>
                <div>
                  <strong className="text-xs text-slate-200 block">Antepenúltimo</strong>
                  <span className="text-[11px] text-amber-400">1.00€</span>
                </div>
              </div>
              <select
                value={pos7}
                onChange={(e) => setPos7(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-surface-border text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- Seleccionar jugador --</option>
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* 6th */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700 gap-4">
              <div className="flex items-center gap-2.5 min-w-36">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                  6º
                </span>
                <div>
                  <strong className="text-xs text-slate-200 block">Sexto</strong>
                  <span className="text-[11px] text-slate-400">0.50€</span>
                </div>
              </div>
              <select
                value={pos6}
                onChange={(e) => setPos6(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-surface-border text-xs text-slate-100 focus:outline-none focus:border-slate-400"
              >
                <option value="">-- Seleccionar jugador --</option>
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation indicator */}
          {!isComplete ? (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {hasDuplicates
                  ? 'No puedes seleccionar al mismo jugador en varias posiciones.'
                  : `Faltan seleccionar ${4 - selected.length} puestos para completar la jornada.`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Jornada lista: 3.00€ + 2.00€ + 1.00€ + 0.50€ = 6.50€ exactos.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyJson}
              disabled={!isComplete}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs transition-all hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 active:scale-98"
            >
              {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Copiar Snippet JSON (para Git)</span>
            </button>

            <button
              onClick={handleCopyWhatsApp}
              disabled={!isComplete}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-all hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
            >
              {copiedWhatsApp ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
              <span>Copiar Texto WhatsApp</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
