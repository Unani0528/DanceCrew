
import React from 'react';

export interface Stock {
  id: string;
  logo: React.FC<{ className?: string }>;
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  changeType: 'increase' | 'decrease';
  sparklineData: { name: string; value: number }[];
}

export interface PortfolioChartPoint {
  day: string;
  score: number;
}

// Types for the analytics dashboard components to prevent build errors
export interface Company {
  id: string;
  name: string;
  ticker: string;
  mentions: number;
}

export interface KeyKeyword {
    keyword: string;
    sentiment: 'positive' | 'negative';
}

export interface RealtimeSummary {
    sentimentScore: number;
    keyKeywords: KeyKeyword[];
}

export interface ChartDataPoint {
    time: string;
    price: number;
    positive: number;
    negative: number;
}

export interface DebateTopic {
    positive: string;
    negative: string;
}

export interface PeerData {
    name: string;
    sentimentScore: number;
}

export interface RawComment {
    id: number;
    sentiment: 'positive' | 'negative';
    text: string;
    reasonKeywords: string[];
}

// NEW TYPES FOR INNOVATIVE FEATURES
export interface FomoAlertData {
  level: 'stable' | 'interest' | 'overheated';
  discussionVolumeChange: number;
}

export interface Narrative {
  id: string;
  title: string;
  summary: string;
}

export interface OpinionLeader {
  id: number;
  rank: number;
  nickname: string;
  stance: 'positive' | 'negative';
  influenceScore: number; // 0-100
}

export interface SentimentComparisonData {
  analystSentiment: string;
  analystScore: number; // For visualization
  retailSentiment: string;
  retailScore: number; // For visualization
  gapDescription: string;
}

export interface DailyBriefingData {
  summary: string;
}
