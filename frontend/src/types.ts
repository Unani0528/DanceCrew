// Stock types
export interface Stock {
  id: string;
  company: Company;
  score: number;
  aiSummary: AiSummary;
  realtimeSummary: RealtimeSummary;
  keyKeywords: KeyKeyword[];
  chartData: ChartDataPoint[];
  sentimentPriceData?: Array<{
    date: string;
    positive: number;
    negative: number;
    stockPrice: number;
  }>;
  debates: DebateTopic[];
  peerComparison: PeerData[];
  rawComments: RawComment[];
  fomoAlerts: FomoAlertData[];
  narratives: Narrative[];
  opinionLeaders: OpinionLeader[];
  sentimentComparison: SentimentComparisonData;
  dailyBriefing: DailyBriefingData;
}

// Company and keyword types
export interface Company {
  id: string;
  name: string;
  ticker: string;
  mentions: number;
}

export interface KeyKeyword {
  word: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'core';
}

// Realtime summary
export interface RealtimeSummary {
  totalMentions: number;
  activeUsers: number;
  positiveRatio: number;
  avgSentiment: number;
  trendDirection: 'up' | 'down';
}

// Chart data
export interface ChartDataPoint {
  time: string;
  sentiment: number;
  volume: number;
}

// Debate topics (narratives)
export interface DebateTopic {
  id: string;
  title: string;
  participants: number;
  sentiment: 'bullish' | 'bearish';
}

// Peer comparison
export interface PeerData {
  name: string;
  sentiment: number;
  mentions: number;
}

// Raw comments
export interface RawComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  votes: number;
}

// FOMO Alert
export interface FomoAlertData {
  id: string;
  type: 'spike' | 'drop' | 'alert';
  message: string;
  intensity: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Narrative
export interface Narrative {
  id: string;
  theme: string;
  sentiment: 'positive' | 'negative';
  strength: number;
  examples: string[];
}

// Opinion Leader
export interface OpinionLeader {
  id: string;
  username: string;
  influence: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  recentPost: string;
}

// Sentiment Comparison
export interface SentimentComparisonData {
  currentScore: number;
  previousScore: number;
  weekAgo: number;
  monthAgo: number;
}

// Daily Briefing
export interface DailyBriefingData {
  summary: string;
  keyPoints: string[];
  outlook: 'positive' | 'negative' | 'neutral';
}

// AI Summary
export interface AiSummary {
  text: string;
  timestamp: string;
}
