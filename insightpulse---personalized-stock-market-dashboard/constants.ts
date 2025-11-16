
import React from 'react';
import type { Stock, PortfolioChartPoint } from './types';

// Simple SVG logos for demonstration purposes
// FIX: Rewrote SVG components using React.createElement to make them valid within a .ts file,
// resolving a critical rendering error caused by using JSX syntax outside of a .tsx file.
function SamsungLogo({ className }: { className?: string }): React.ReactElement {
  return React.createElement('svg', { className, viewBox: "0 0 256 256", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement('path', { d: "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z", fill: "#1428A0" }),
    React.createElement('path', { d: "M194.4 116.51a87.88 87.88 0 0 1-21.36 38.55l-82.25-47.49a87.88 87.88 0 0 1 21.36-38.55Z", fill: "#1428A0" }),
    React.createElement('path', { d: "m112.16 61.45-21.36 38.55 82.25 47.49 21.36-38.55-82.25-47.49Z", fill: "#1428A0" })
  );
}

function KakaoLogo({ className }: { className?: string }): React.ReactElement {
  return React.createElement('svg', { className, viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement('path', { d: "M24 4C12.95 4 4 11.42 4 20.17c0 5.43 3.44 10.19 8.58 13.16l-1.3 5.49a.53.53 0 0 0 .8.55L19 33.72a22.88 22.88 0 0 0 5 .65C35.05 34.37 44 26.95 44 18.17S35.05 4 24 4Z", fill: "#FFDE03" })
  );
}

function NaverLogo({ className }: { className?: string }): React.ReactElement {
  return React.createElement('svg', { className, viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement('path', { d: "M24 4c-7 0-13 3-13 10v20h11L35 4H24z", fill: "#03C75A" }),
    React.createElement('path', { d: "M11 34V14c0-7 6-10 13-10h11L22 34H11z", fill: "#FFF", fillOpacity: ".5" })
  );
}

function HyundaiLogo({ className }: { className?: string }): React.ReactElement {
 return React.createElement('svg', { className, viewBox: "0 0 512 512", xmlns: "http://www.w3.org/2000/svg" },
  React.createElement('path', { d: "M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208s208-93.1 208-208S370.9 48 256 48zm-33.1 304.7c-5.9 4.3-13.8 4.3-19.8 0l-40.9-29.6c-17.7-12.8-19.8-38-4.3-53.1l90.3-87.1c3.5-3.3 8.8-3.3 12.3 0l90.3 87.1c15.5 15.1 13.4 40.3-4.3 53.1l-40.9 29.6c-6 4.3-13.9 4.3-19.8 0l-28-20.3l-28 20.3z", fill: "#002c5f" })
 );
}

export const STOCKS: Stock[] = [
  {
    id: 'samsung',
    logo: SamsungLogo,
    name: '삼성전자',
    ticker: '005930',
    price: 82300,
    change: 1200,
    changePercent: 1.48,
    changeType: 'increase',
    sparklineData: [{name: '1', value: 4}, {name: '2', value: 6}, {name: '3', value: 5}, {name: '4', value: 8}, {name: '5', value: 7}, {name: '6', value: 9}, {name: '7', value: 10}],
  },
  {
    id: 'kakao',
    logo: KakaoLogo,
    name: '카카오',
    ticker: '035720',
    price: 43250,
    change: -550,
    changePercent: -1.26,
    changeType: 'decrease',
    sparklineData: [{name: '1', value: 10}, {name: '2', value: 8}, {name: '3', value: 9}, {name: '4', value: 6}, {name: '5', value: 5}, {name: '6', value: 4}, {name: '7', value: 3}],
  },
  {
    id: 'naver',
    logo: NaverLogo,
    name: 'NAVER',
    ticker: '035420',
    price: 171800,
    change: 800,
    changePercent: 0.47,
    changeType: 'increase',
    sparklineData: [{name: '1', value: 3}, {name: '2', value: 4}, {name: '3', value: 6}, {name: '4', value: 5}, {name: '5', value: 7}, {name: '6', value: 8}, {name: '7', value: 7}],
  },
  {
    id: 'hyundai',
    logo: HyundaiLogo,
    name: '현대차',
    ticker: '005380',
    price: 278500,
    change: -3000,
    changePercent: -1.07,
    changeType: 'decrease',
    sparklineData: [{name: '1', value: 8}, {name: '2', value: 9}, {name: '3', value: 7}, {name: '4', value: 5}, {name: '5', value: 6}, {name: '6', value: 4}, {name: '7', value: 5}],
  },
];

export const PORTFOLIO_CHART_DATA: PortfolioChartPoint[] = [
  { day: '월', score: 65 },
  { day: '화', score: 68 },
  { day: '수', score: 75 },
  { day: '목', score: 72 },
  { day: '금', score: 78 },
  { day: '토', score: 80 },
  { day: '일', score: 77 },
];

export const PORTFOLIO_CHART_DATA_MONTHLY: PortfolioChartPoint[] = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}일`,
    score: 60 + Math.floor(Math.random() * 25) + Math.floor(i / 5), // gentle upward trend
}));
