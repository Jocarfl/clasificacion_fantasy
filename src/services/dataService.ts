import { LeagueData, CalculatedStats, ParticipantStats, GlobalStats, JourneyRecord } from '../types/fantasy';

export class DataService {
  /**
   * Computes complete stats, debt totals, ranking and badges for the league.
   */
  static calculateStats(data: LeagueData): CalculatedStats {
    const participants = data.participants || [];
    const journeys = (data.journeys || []).filter(j => j.completed);
    const totalJourneysCount = data.totalJourneys || 38;
    const fixedJourneyPot = data.rules?.journeyPot || 6.50;
    const estimatedFinalPot = data.rules?.estimatedFinalPot || (totalJourneysCount * fixedJourneyPot);

    const participantMap = new Map<string, ParticipantStats>();
    participants.forEach(p => {
      participantMap.set(p.id, {
        id: p.id,
        name: p.name,
        avatar: p.avatar || '⚽',
        totalPaid: 0,
        percentageOfPot: 0,
        rank: 0,
        honorificTitle: '',
        badge: '',
        penaltyCounts: { p3: 0, p2: 0, p1: 0, p05: 0 },
        history: [],
        cumulativeHistory: []
      });
    });

    // Sort journeys chronologically
    journeys.sort((a, b) => a.journey - b.journey);

    journeys.forEach(j => {
      participants.forEach(p => {
        const stats = participantMap.get(p.id)!;
        const amount = Number(j.penalties?.[p.id] || 0);
        stats.history.push(amount);
        stats.totalPaid += amount;
        stats.cumulativeHistory.push(stats.totalPaid);

        if (Math.abs(amount - 3.00) < 0.01) stats.penaltyCounts.p3++;
        else if (Math.abs(amount - 2.00) < 0.01) stats.penaltyCounts.p2++;
        else if (Math.abs(amount - 1.00) < 0.01) stats.penaltyCounts.p1++;
        else if (Math.abs(amount - 0.50) < 0.01) stats.penaltyCounts.p05++;
      });
    });

    const totalPot = Array.from(participantMap.values()).reduce((sum, p) => sum + p.totalPaid, 0);

    const ranking = Array.from(participantMap.values()).map(p => {
      p.percentageOfPot = totalPot > 0 ? (p.totalPaid / totalPot) * 100 : 0;
      return p;
    });

    ranking.sort((a, b) => {
      if (b.totalPaid !== a.totalPaid) return b.totalPaid - a.totalPaid;
      if (b.penaltyCounts.p3 !== a.penaltyCounts.p3) return b.penaltyCounts.p3 - a.penaltyCounts.p3;
      return a.name.localeCompare(b.name);
    });

    const maxPaid = ranking.length > 0 ? ranking[0].totalPaid : 0;
    const minPaid = ranking.length > 0 ? ranking[ranking.length - 1].totalPaid : 0;

    ranking.forEach((p, idx) => {
      p.rank = idx + 1;
      if (idx === 0 && p.totalPaid > 0) {
        p.honorificTitle = 'Paga la coca';
        p.badge = '🥇 1º';
      } else if (idx === 1) {
        p.badge = '🥈 2º';
      } else if (idx === 2) {
        p.badge = '🥉 3º';
      } else if (idx === ranking.length - 1 || p.totalPaid === minPaid) {
        if (p.totalPaid === 0 || idx === ranking.length - 1) {
          p.honorificTitle = 'El Rata';
          p.badge = `🛡️ ${p.rank}º`;
        } else {
          p.badge = `${p.rank}º`;
        }
      } else {
        p.badge = `${p.rank}º`;
      }
    });

    const computedJourneys = journeys.length;
    const remainingJourneys = Math.max(0, totalJourneysCount - computedJourneys);
    const averagePerJourney = computedJourneys > 0 ? totalPot / computedJourneys : fixedJourneyPot;
    const progressPercent = estimatedFinalPot > 0 ? Math.min(100, (totalPot / estimatedFinalPot) * 100) : 0;

    const leader = ranking.find(p => p.totalPaid === maxPaid && p.totalPaid > 0);
    const ratas = ranking.filter(p => p.totalPaid === minPaid);

    const globalStats: GlobalStats = {
      totalPot,
      estimatedFinalPot,
      computedJourneys,
      remainingJourneys,
      totalJourneysCount,
      averagePerJourney,
      progressPercent,
      leader: leader ? { name: leader.name, amount: leader.totalPaid, avatar: leader.avatar } : null,
      ratas: ratas.map(r => ({ name: r.name, amount: r.totalPaid, avatar: r.avatar })),
      lastUpdatedJourney: computedJourneys > 0 ? journeys[journeys.length - 1].journey : 0
    };

    return { ranking, globalStats, journeyData: journeys };
  }

  /**
   * Generates a clean WhatsApp summary.
   */
  static generateWhatsAppSummary(data: LeagueData, targetJourney: number | null = null): string {
    const { ranking, globalStats, journeyData } = this.calculateStats(data);
    const jNum = targetJourney || globalStats.lastUpdatedJourney;
    const specificJourney = journeyData.find(j => j.journey === jNum);

    let text = `🏆 *LIGA FANTASY 2026-2027*\n`;
    text += `💰 *CONTROL DE MULTAS Y BOTE*\n`;
    text += `─────────────────────────\n\n`;

    if (specificJourney) {
      text += `📅 *MULTAS JORNADA ${jNum}*\n`;
      const penaltiesList: { name: string; amount: number; label: string }[] = [];
      Object.entries(specificJourney.penalties).forEach(([id, amt]) => {
        if (amt > 0) {
          const participant = data.participants.find(p => p.id === id);
          let label = '⚪ 6º (0.50€)';
          if (amt === 3.0) label = '🔴 9º (3.00€)';
          else if (amt === 2.0) label = '🟠 8º (2.00€)';
          else if (amt === 1.0) label = '🟡 7º (1.00€)';
          penaltiesList.push({ name: participant?.name || id, amount: amt, label });
        }
      });
      penaltiesList.sort((a, b) => b.amount - a.amount);

      penaltiesList.forEach(p => {
        text += `${p.label} ➔ *${p.name}*\n`;
      });
      text += `\n`;
    }

    text += `👑 *TOP CLASIFICACIÓN BOTE (J${globalStats.computedJourneys}/${globalStats.totalJourneysCount})*\n`;
    ranking.forEach(p => {
      let icon = `${p.rank}º`;
      if (p.rank === 1 && p.totalPaid > 0) icon = '🥇 1º (Paga la coca)';
      else if (p.rank === 2) icon = '🥈 2º';
      else if (p.rank === 3) icon = '🥉 3º';
      else if (p.honorificTitle === 'El Rata') icon = `🛡️ ${p.rank}º (El Rata)`;

      text += `${icon} *${p.name}*: ${p.totalPaid.toFixed(2)}€ _(${p.percentageOfPot.toFixed(1)}%)_\n`;
    });

    text += `\n📊 *BOTE ACUMULADO:* ${globalStats.totalPot.toFixed(2)}€ / ${globalStats.estimatedFinalPot.toFixed(0)}€ (${globalStats.progressPercent.toFixed(1)}%)\n`;

    return text;
  }

  /**
   * Generates a clean formatted JSON snippet for a journey ready to paste in GitHub.
   */
  static generateJourneyJsonSnippet(journeyNum: number, penalties: Record<string, number>, dateStr: string): string {
    const record: JourneyRecord = {
      journey: journeyNum,
      date: dateStr || new Date().toISOString().split('T')[0],
      completed: true,
      penalties
    };
    return JSON.stringify(record, null, 2);
  }
}
