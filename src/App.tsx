import React, { useState } from 'react';
import { PauseCircle } from 'lucide-react';
import initialLeagueData from '../data/fantasy_data.json';
import { LeagueData, ParticipantStats } from './types/fantasy';
import { DataService } from './services/dataService';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { KpiCards } from './components/dashboard/KpiCards';
import { Podium } from './components/dashboard/Podium';
import { RankingTable } from './components/ranking/RankingTable';
import { PlayerModal } from './components/ranking/PlayerModal';
import { JourneyView } from './components/journeys/JourneyView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { JourneySnippetGenerator } from './components/admin/JourneySnippetGenerator';

export const App: React.FC = () => {
  const data: LeagueData = initialLeagueData as unknown as LeagueData;
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState<ParticipantStats | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute live stats
  const stats = DataService.calculateStats(data);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleShareWhatsApp = async () => {
    try {
      const text = DataService.generateWhatsAppSummary(data);
      await navigator.clipboard.writeText(text);
      showToast('📋 ¡Resumen para WhatsApp copiado al portapapeles!');
    } catch {
      prompt('Copia el resumen para WhatsApp:', DataService.generateWhatsAppSummary(data));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-amber-500/30 selection:text-amber-300">

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShareWhatsApp={handleShareWhatsApp}
        computedJourneys={stats.globalStats.computedJourneys}
        totalJourneys={stats.globalStats.totalJourneysCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">

        {/* Paused Journeys Alert Banner */}
        {stats.globalStats.pausedJourneys && stats.globalStats.pausedJourneys.length > 0 && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
                <PauseCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-amber-200 block">
                  Jornada {stats.globalStats.pausedJourneys.join(', ')} pausada por partido aplazado
                </strong>
                <p className="text-[11px] sm:text-xs text-amber-300/80 mt-0.5">
                  Las sanciones están temporalmente congeladas y no computan en el bote hasta que se disputen los partidos pendientes.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('journeys')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors shrink-0"
            >
              Ver detalle
            </button>
          </div>
        )}


        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <KpiCards stats={stats.globalStats} />
            <Podium ranking={stats.ranking} onSelectPlayer={setSelectedPlayer} />
            <RankingTable
              ranking={stats.ranking}
              totalPot={stats.globalStats.totalPot}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
        )}

        {activeTab === 'journeys' && (
          <div className="animate-fade-in space-y-6">
            <JourneyView data={data} stats={stats} />
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="animate-fade-in space-y-6">
            <RankingTable
              ranking={stats.ranking}
              totalPot={stats.globalStats.totalPot}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-fade-in space-y-6">
            <PaymentsView
              data={data}
              stats={stats}
              onShowToast={showToast}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <AnalyticsView stats={stats} />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <JourneySnippetGenerator
              data={data}
              onShowToast={showToast}
            />
          </div>
        )}

      </main>

      {/* Player Detail Modal */}
      <PlayerModal
        player={selectedPlayer}
        journeys={data.journeys || []}
        onClose={() => setSelectedPlayer(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-display font-bold text-xs shadow-2xl shadow-emerald-500/20 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <Footer onOpenAdmin={() => setActiveTab('admin')} />

    </div>
  );
};
