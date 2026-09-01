import {
  LeagueData,
  CalculatedStats,
  ParticipantStats,
  GlobalStats,
  JourneyRecord,
  SettlementBlock,
  CalculatedSettlement,
  SettlementPlayerDetail
} from '../types/fantasy';

export class DataService {
  /**
   * Computes complete stats, debt totals, ranking, badges, and 4-journey settlement payments.
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
        cumulativeHistory: [],
        totalSettledPaid: 0,
        totalSettledPending: 0,
        isUpToDate: true
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

    // 4-Journey Settlement Blocks Calculation
    const settlementBlocks: SettlementBlock[] = data.settlements && data.settlements.length > 0
      ? data.settlements
      : Array.from({ length: Math.ceil(totalJourneysCount / 4) }, (_, idx) => {
          const start = idx * 4 + 1;
          const end = Math.min(totalJourneysCount, (idx + 1) * 4);
          return {
            id: `tramo-${idx + 1}`,
            label: `Tramo ${idx + 1} (J${start} - J${end})`,
            startJourney: start,
            endJourney: end,
            paidStatus: {}
          };
        });

    let totalCollectedInBank = 0;
    let totalPendingCollection = 0;

    const calculatedSettlements: CalculatedSettlement[] = settlementBlocks.map(block => {
      const blockJourneys = journeys.filter(
        j => j.journey >= block.startJourney && j.journey <= block.endJourney
      );
      const expectedJourneysCount = block.endJourney - block.startJourney + 1;
      const isCompleted = blockJourneys.length === expectedJourneysCount;
      const isInProgress = blockJourneys.length > 0 && !isCompleted;

      let totalBlockDebt = 0;
      let totalBlockCollected = 0;

      const playerDetails: SettlementPlayerDetail[] = participants.map(p => {
        let debtInBlock = 0;
        blockJourneys.forEach(j => {
          debtInBlock += Number(j.penalties?.[p.id] || 0);
        });

        const paid = debtInBlock === 0 ? true : (block.paidStatus?.[p.id] ?? false);

        totalBlockDebt += debtInBlock;
        if (paid) {
          totalBlockCollected += debtInBlock;
          participantMap.get(p.id)!.totalSettledPaid += debtInBlock;
        } else {
          // If block has activity, count as pending
          if (debtInBlock > 0) {
            participantMap.get(p.id)!.totalSettledPending += debtInBlock;
            participantMap.get(p.id)!.isUpToDate = false;
          }
        }

        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          debtInBlock,
          paid
        };
      });

      playerDetails.sort((a, b) => b.debtInBlock - a.debtInBlock || a.name.localeCompare(b.name));

      const totalBlockPending = Math.max(0, totalBlockDebt - totalBlockCollected);
      totalCollectedInBank += totalBlockCollected;
      totalPendingCollection += totalBlockPending;

      return {
        id: block.id,
        label: block.label || `Tramo (J${block.startJourney} - J${block.endJourney})`,
        startJourney: block.startJourney,
        endJourney: block.endJourney,
        isCompleted,
        isInProgress,
        totalBlockDebt,
        totalBlockCollected,
        totalBlockPending,
        players: playerDetails
      };
    });

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
      totalCollectedInBank,
      totalPendingCollection,
      leader: leader ? { name: leader.name, amount: leader.totalPaid, avatar: leader.avatar } : null,
      ratas: ratas.map(r => ({ name: r.name, amount: r.totalPaid, avatar: r.avatar })),
      lastUpdatedJourney: computedJourneys > 0 ? journeys[journeys.length - 1].journey : 0
    };

    return {
      ranking,
      globalStats,
      journeyData: journeys,
      settlements: calculatedSettlements
    };
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
    text += `💳 *INGRESADO EN CUENTA:* ${globalStats.totalCollectedInBank.toFixed(2)}€ | *PENDIENTE:* ${globalStats.totalPendingCollection.toFixed(2)}€\n`;

    return text;
  }

  /**
   * Generates a payment reminder summary for WhatsApp for a specific 4-journey settlement block.
   */
  static generatePaymentWhatsAppSummary(data: LeagueData, blockId?: string): string {
    const { settlements } = this.calculateStats(data);
    const targetBlock = blockId
      ? settlements.find(s => s.id === blockId)
      : settlements.find(s => s.isInProgress || s.isCompleted) || settlements[0];

    if (!targetBlock) return '';

    let text = `💳 *LIQUIDACIÓN BOTE - ${targetBlock.label.toUpperCase()}*\n`;
    text += `─────────────────────────\n`;
    text += `Total a transferir en este tramo:\n\n`;

    const pending = targetBlock.players.filter(p => !p.paid && p.debtInBlock > 0);
    const paid = targetBlock.players.filter(p => p.paid && p.debtInBlock > 0);
    const free = targetBlock.players.filter(p => p.debtInBlock === 0);

    if (pending.length > 0) {
      text += `🔴 *PENDIENTES DE TRANSFERIR:*\n`;
      pending.forEach(p => {
        text += `• *${p.name}*: *${p.debtInBlock.toFixed(2)}€*\n`;
      });
      text += `\n`;
    }

    if (paid.length > 0) {
      text += `🟢 *PAGADOS / AL DÍA:*\n`;
      paid.forEach(p => {
        text += `• ~${p.name}~: ${p.debtInBlock.toFixed(2)}€ (Recibido ✓)\n`;
      });
      text += `\n`;
    }

    if (free.length > 0) {
      text += `🛡️ *LIBRES DE MULTA (0.00€):*\n`;
      text += free.map(p => p.name).join(', ') + `\n\n`;
    }

    text += `📊 *Recaudado en cuenta:* ${targetBlock.totalBlockCollected.toFixed(2)}€ / ${targetBlock.totalBlockDebt.toFixed(2)}€\n`;

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
