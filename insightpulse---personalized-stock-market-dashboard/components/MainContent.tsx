

import React, { useState, useEffect, useMemo } from 'react';
import Header from './layout/Header';
import Sidebar from './Sidebar';
import AiAdvisorPanel from './dashboard/AiAdvisorPanel';
import RealtimeSummaryPanel from './dashboard/RealtimeSummaryPanel';
import CorrelationChart from './dashboard/CorrelationChart';
import InsightPanels from './dashboard/InsightPanels';
import RawDataSample from './dashboard/RawDataSample';
import LoadingSkeleton from './common/LoadingSkeleton';
import ErrorMessage from './common/ErrorMessage';
// Import new components
import FomoAlert from './dashboard/FomoAlert';
import NarrativeExtractor from './dashboard/NarrativeExtractor';
import KeyOpinionLeaders from './dashboard/KeyOpinionLeaders';
import SentimentComparison from './dashboard/SentimentComparison';
import DailyBriefing from './dashboard/DailyBriefing';

import type { 
  Company, 
  RealtimeSummary, 
  ChartDataPoint, 
  DebateTopic, 
  PeerData, 
  RawComment, 
  KeyKeyword,
  FomoAlertData,
  Narrative,
  OpinionLeader,
  SentimentComparisonData,
  DailyBriefingData
} from '../types';

// MOCK DATA GENERATION
const MOCK_COMPANIES: Company[] = [
  { id: 'samsung', name: '삼성전자', ticker: '005930', mentions: 12400 },
  { id: 'sk_hynix', name: 'SK하이닉스', ticker: '000660', mentions: 9800 },
  { id: 'lg_es', name: 'LG에너지솔루션', ticker: '373220', mentions: 7600 },
  { id: 'hyundai', name: '현대차', ticker: '005380', mentions: 5400 },
  { id: 'naver', name: 'NAVER', ticker: '035420', mentions: 4800 },
];

const generateMockData = (company: Company) => {
  const basePrice = Math.random() * 200000 + 50000;
  return {
    aiSummary: {
      summary: `${company.name}의 주가는 현재 긍정적 여론과 함께 안정적인 흐름을 보이고 있습니다. 특히 신규 사업 발표에 대한 기대감이 투자 심리를 자극하고 있습니다.`,
      confidence: 85,
    },
    realtimeSummary: {
      sentimentScore: Math.floor(Math.random() * 40 + 60),
      keyKeywords: [
        { keyword: '반도체', sentiment: 'positive' },
        { keyword: 'AI', sentiment: 'positive' },
        { keyword: '실적', sentiment: 'positive' },
        { keyword: '경쟁', sentiment: 'negative' },
        { keyword: '금리', sentiment: 'negative' },
      ] as KeyKeyword[],
    },
    chartData: {
      '1D': Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, price: basePrice + (Math.random() - 0.5) * 5000, positive: Math.random() * 100, negative: Math.random() * 50 })),
      '5D': Array.from({ length: 5 }, (_, i) => ({ time: `Day ${i+1}`, price: basePrice + (Math.random() - 0.5) * 15000, positive: Math.random() * 500, negative: Math.random() * 250 })),
      '1M': Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i+1}`, price: basePrice + (Math.random() - 0.5) * 30000, positive: Math.random() * 1000, negative: Math.random() * 500 })),
    },
    debateTopics: [
        { positive: 'HBM 시장 지배력 강화에 대한 기대감', negative: '글로벌 경쟁 심화 및 D램 가격 변동성' },
        { positive: 'AI 가속기 수요 증가로 인한 수혜', negative: '미-중 무역 갈등으로 인한 불확실성' },
    ],
    peerData: [
        { name: company.name, sentimentScore: Math.floor(Math.random() * 30 + 65) },
        { name: '경쟁사 A', sentimentScore: Math.floor(Math.random() * 40 + 50) },
        { name: '경쟁사 B', sentimentScore: Math.floor(Math.random() * 40 + 40) },
        { name: '업종 평균', sentimentScore: 68 },
    ],
    rawComments: Array.from({ length: 20 }, (_, i) => ({
      id: i,
      sentiment: (Math.random() > 0.4 ? 'positive' : 'negative') as 'positive' | 'negative',
      text: `코멘트 샘플 ${i}: ${company.name}의 미래는 밝아 보입니다. 모두가 ${Math.random() > 0.5 ? 'AI' : '반도체'}에 대해 이야기하고 있어요.`,
      reasonKeywords: ['AI', '반도체'],
    })),
    // NEW MOCK DATA
    fomoAlert: {
      level: ['stable', 'interest', 'overheated'][Math.floor(Math.random() * 3)] as 'stable' | 'interest' | 'overheated',
      discussionVolumeChange: Math.floor(Math.random() * 400),
    },
    narratives: [
      { id: 'n1', title: 'HBM 기술 선점 기대감', summary: '차세대 HBM 제품의 높은 수율과 주요 고객사 확보 가능성에 대한 긍정적 여론이 시장을 주도하고 있습니다.' },
      { id: 'n2', title: '파운드리 경쟁 심화 우려', summary: '경쟁사의 공격적인 투자와 기술 발전으로 인해 파운드리 부문의 시장 점유율 하락 가능성이 제기되고 있습니다.' },
    ],
    // FIX: Explicitly cast to OpinionLeader[] to resolve TypeScript error where 'stance' was inferred as string instead of 'positive' | 'negative'.
    opinionLeaders: [
      { id: 1, rank: 1, nickname: '가치투자101', stance: 'positive', influenceScore: 92 },
      { id: 2, rank: 2, nickname: '반도체전문가', stance: 'positive', influenceScore: 85 },
      { id: 3, rank: 3, nickname: '주린이탈출', stance: 'negative', influenceScore: 78 },
    ] as OpinionLeader[],
    sentimentComparison: {
      analystSentiment: '매수 우위',
      analystScore: 80,
      retailSentiment: '과열/FOMO',
      retailScore: 90,
      gapDescription: '현재 기관 투자 의견과 개인 투자 심리 간에 높은 괴리가 관찰됩니다.'
    },
    dailyBriefing: {
      summary: `어제 ${company.name}는 장 초반 '실적 우려' 내러티브로 부정적 심리가 우세했으나, 오후 들어 '자사주 매입' 관련 긍정적 여론이 형성되며 최종 심리 점수는 소폭 상승 마감했습니다. 금일은 해당 이슈의 지속 여부를 주목해야 합니다.`
    }
  };
};

type MockData = ReturnType<typeof generateMockData>;

const Dashboard: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MockData | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<ChartDataPoint | null>(null);
  const [activeFilter, setFilter] = useState<string | null>(null);

  const fetchData = (company: Company) => {
    setLoading(true);
    setError(null);
    setFilter(null);
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.95) { // Simulate random error
        setError('데이터를 불러오는 데 실패했습니다. 네트워크 연결을 확인해주세요.');
        setData(null);
      } else {
        setData(generateMockData(company));
      }
      setLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    fetchData(selectedCompany);
  }, [selectedCompany]);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  const filteredComments = useMemo(() => {
    if (!data) return [];
    if (!activeFilter) return data.rawComments;
    
    const keywords = activeFilter.split(' ').filter(word => word.length > 1);
    return data.rawComments.filter(comment => 
        keywords.some(kw => comment.text.toLowerCase().includes(kw.toLowerCase()))
    );
  }, [data, activeFilter]);


  return (
    <div className="flex w-full min-h-screen">
      <Sidebar 
        hotStocks={MOCK_COMPANIES}
        selectedCompany={selectedCompany}
        onSelectCompany={handleSelectCompany}
      />
      <main className="flex-1">
        <Header />
        <div className="p-6 space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <ErrorMessage message={error} onRetry={() => fetchData(selectedCompany)} />
            </div>
          ) : data ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedCompany.name} ({selectedCompany.ticker})</h2>
                    <p className="text-sm text-gray-500">최신 시장 여론 및 데이터 분석</p>
                </div>
              </div>
              <AiAdvisorPanel summary={data.aiSummary.summary} confidence={data.aiSummary.confidence} />
              <RealtimeSummaryPanel summary={data.realtimeSummary} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FomoAlert data={data.fomoAlert} />
                </div>
                <DailyBriefing data={data.dailyBriefing} />
              </div>
              
              <NarrativeExtractor narratives={data.narratives} />
              
              <CorrelationChart companyName={selectedCompany.name} chartData={data.chartData} setHoveredDataPoint={setHoveredDataPoint} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <SentimentComparison data={data.sentimentComparison} />
                 <KeyOpinionLeaders leaders={data.opinionLeaders} />
              </div>

              <InsightPanels debateTopics={data.debateTopics} peerData={data.peerData} activeFilter={activeFilter} setFilter={setFilter} />
              <RawDataSample rawComments={filteredComments} hoveredDataPoint={hoveredDataPoint} activeFilter={activeFilter} />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;