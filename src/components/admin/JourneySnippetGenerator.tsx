import React, { useState } from 'react';
import { Copy, Download, Check, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { LeagueData } from '../../types/fantasy';
import { DataService } from '../../services/dataService';

interface JourneySnippetGeneratorProps {
  data: LeagueData;
  onApplyLocalPreview: (updatedData: LeagueData) => void;
  onShowToast: (msg: string) => void;
}

export const JourneySnippetGenerator: React.FC<JourneySnippetGeneratorProps> = ({
  data,
  onApplyLocalPreview,
  onShowToast
}) => {
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
    // Generate temporary clone to get WhatsApp text for this new journey
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

  const handleDownloadFullJson = () => {
    if (!isComplete) return;
    const clone: LeagueData = JSON.parse(JSON.stringify(data));
    const idx = clone.journeys.findIndex(j => j.journey === journeyNum);
    const newRecord = { journey: journeyNum, date, completed: true, penalties: buildPenalties() };
    if (idx >= 0) clone.journeys[idx] = newRecord;
    else clone.journeys.push(newRecord);
    clone.journeys.sort((a, b) => a.journey - b.journey);

    const blob = new Blob([JSON.stringify(clone, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fantasy_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('📥 Archivo fantasy_data.json descargado');
  };

  const handleApplyPreview = () => {
    if (!isComplete) return;
    const clone: LeagueData = JSON.parse(JSON.stringify(data));
    const idx = clone.journeys.findIndex(j => j.journey === journeyNum);
    const newRecord = { journey: journeyNum, date, completed: true, penalties: buildPenalties() };
    if (idx >= 0) clone.journeys[idx] = newRecord;
    else clone.journeys.push(newRecord);
    clone.journeys.sort((a, b) => a.journey - b.journey);

    onApplyLocalPreview(clone);
    onShowToast(`✓ Previsualizando Jornada ${journeyNum} en la web`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Generador Rápido de Jornada</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Selecciona los 4 sancionados y obtén el bloque JSON listo para tu commit en GitHub y el resumen para WhatsApp
        </p>
      </div>

      <div className="rounded-2xl bg-surface/90 border border-surface-border p-6 shadow-md space-y-6">
        
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
                <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
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
                <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
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
                <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
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
                <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
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

        {/* Secondary utilities */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-border text-xs text-slate-400">
          <button
            onClick={handleApplyPreview}
            disabled={!isComplete}
            className="hover:text-amber-300 transition-colors underline underline-offset-4 disabled:opacity-40"
          >
            👁️ Previsualizar en la web ahora
          </button>

          <button
            onClick={handleDownloadFullJson}
            disabled={!isComplete}
            className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar archivo fantasy_data.json completo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
