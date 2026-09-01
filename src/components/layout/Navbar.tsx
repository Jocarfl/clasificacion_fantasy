import React from 'react';
import { Trophy, LayoutDashboard, ListOrdered, BarChart3, PlusCircle, Share2, Grid3X3 } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'journeys' | 'ranking' | 'analytics' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onShareWhatsApp: () => void;
  computedJourneys: number;
  totalJourneys: number;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onShareWhatsApp,
  computedJourneys,
  totalJourneys
}) => {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Resumen', shortLabel: 'Inicio', icon: LayoutDashboard },
    { id: 'journeys', label: 'Jornadas', shortLabel: 'Jornadas', icon: Grid3X3 },
    { id: 'ranking', label: 'Clasificación', shortLabel: 'Tabla', icon: ListOrdered },
    { id: 'analytics', label: 'Estadísticas', shortLabel: 'Métricas', icon: BarChart3 },
    { id: 'admin', label: 'Añadir', shortLabel: 'Añadir', icon: PlusCircle, highlight: true }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-surface-muted/90 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo & Season */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg text-slate-100 tracking-tight">
                    Fantasy Multas
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-amber-400 border border-amber-500/20">
                    2026-27
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{computedJourneys}</span> de {totalJourneys} jornadas disputadas
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-surface p-1 rounded-xl border border-surface-border">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive
                      ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                      : tab.highlight
                        ? 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action Button: WhatsApp */}
            <div className="flex items-center gap-2">
              <button
                onClick={onShareWhatsApp}
                title="Copiar resumen para WhatsApp"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/25 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative ${isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : tab.highlight
                    ? 'text-slate-400 hover:text-amber-300'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : ''}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">
                  {tab.shortLabel || tab.label}
                </span>
                {isActive && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
