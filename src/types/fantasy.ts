export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export interface PenaltyRule {
  position: number;
  label: string;
  amount: number;
  badge: string;
}

export interface Rules {
  penalties: PenaltyRule[];
  safePositionsLabel: string;
  journeyPot: number;
  estimatedFinalPot: number;
}

export interface JourneyRecord {
  journey: number;
  date?: string;
  completed: boolean;
  penalties: Record<string, number>;
}

export interface LeagueData {
  title: string;
  season: string;
  totalJourneys: number;
  rules: Rules;
  participants: Participant[];
  journeys: JourneyRecord[];
}

export interface PenaltyCounts {
  p3: number;
  p2: number;
  p1: number;
  p05: number;
}

export interface ParticipantStats {
  id: string;
  name: string;
  avatar: string;
  totalPaid: number;
  percentageOfPot: number;
  rank: number;
  honorificTitle: string;
  badge: string;
  penaltyCounts: PenaltyCounts;
  history: number[];
  cumulativeHistory: number[];
}

export interface LeaderSummary {
  name: string;
  amount: number;
  avatar: string;
}

export interface GlobalStats {
  totalPot: number;
  estimatedFinalPot: number;
  computedJourneys: number;
  remainingJourneys: number;
  totalJourneysCount: number;
  averagePerJourney: number;
  progressPercent: number;
  leader: LeaderSummary | null;
  ratas: LeaderSummary[];
  lastUpdatedJourney: number;
}

export interface CalculatedStats {
  ranking: ParticipantStats[];
  globalStats: GlobalStats;
  journeyData: JourneyRecord[];
}
