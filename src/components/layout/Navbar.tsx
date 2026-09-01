import React from 'react';
import { Trophy, LayoutDashboard, ListOrdered, CalendarDays, BarChart3, PlusCircle, Share2 } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'ranking' | 'journeys' | 'analytics' | 'admin';

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
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'ranking', label: 'Clasificación', icon: ListOrdered },
    { id: 'journeys', label: 'Jornadas', icon: CalendarDays },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'admin', label: 'Añadir Jornada', icon: PlusCircle, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-muted/80 border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Season */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-slate-100 tracking-tight">
                  Fantasy Multas
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                  2026-27
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Jornada {computedJourneys} de {totalJourneys} computadas
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface p-1 rounded-xl border border-surface-border">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-semibold transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Copiar WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
