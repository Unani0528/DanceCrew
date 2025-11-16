// API 타입 정의
export type StockSummary = {
  code: string;
  name: string;
  rank: number;
};

export type KeywordData = {
  positive: string[]; // 긍정 키워드 3개
  negative: string[]; // 부정 키워드 3개
  keywords: string[];  // 핵심 키워드 3개
};

export type NarrativeData = {
  positive: string[];  // 긍정 내러티브 2개
  negative: string[];  // 부정 내러티브 2개
};

export type TimeSeriesData = {
  date: string;
  value: number;
};

export type SentimentImpactData = {
  date: string;
  positive: number;  // 긍정 영향도
  negative: number;  // 부정 영향도
  stockPrice: number; // 주가
};

export type AnalysisData = {
  date: string;
  no: number;
  [key: string]: string | number;
};

export type SectorData = {
  name: string;
  value: number;
};

export type DiscussionPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
};

export type StockDetail = {
  code: string;
  name: string;
  aiAdvice: string; // AI 어드바이저 한줄 의견
  sentimentScore: number; // 실시간 여론점수 0-100
  keywords: KeywordData;
  fearGreedIndex: number; // 공포탐욕지수 0-100 (외부 API)
  aiDailyBriefing: string[]; // AI 데일리 브리핑 5줄
  narratives: NarrativeData; // 현재 시장 내러티브
  sentimentImpact: SentimentImpactData[]; // 커뮤니티 의견 영향도 데이터
  timeseries: {
    day: TimeSeriesData[];
    week: TimeSeriesData[];
    month: TimeSeriesData[];
    year: TimeSeriesData[];
  };
  analysisTable: AnalysisData[];
  sectorComparison: SectorData[];
  discussions: DiscussionPost[];
};

// API 호출 함수 (백엔드 연동 시 여기만 수정)
const USE_MOCK_DATA = true; // 백엔드 연동 시 false로 변경

async function fetchAPI<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API 호출 실패: ${url}`);
  return res.json();
}

// Top 10 종목 가져오기
export async function fetchTop10Stocks(): Promise<StockSummary[]> {
  if (USE_MOCK_DATA) {
    // Mock 데이터
    return [
      { code: "005930", name: "삼성전자", rank: 1 },
      { code: "000660", name: "SK하이닉스", rank: 2 },
      { code: "035420", name: "NAVER", rank: 3 },
      { code: "005380", name: "현대차", rank: 4 },
      { code: "051910", name: "LG화학", rank: 5 },
      { code: "006400", name: "삼성SDI", rank: 6 },
      { code: "035720", name: "카카오", rank: 7 },
      { code: "028260", name: "삼성물산", rank: 8 },
      { code: "068270", name: "셀트리온", rank: 9 },
      { code: "105560", name: "KB금융", rank: 10 },
    ];
  }
  
  // 실제 백엔드 API 호출
  return fetchAPI<StockSummary[]>("/api/stocks/top10");
}

// 종목 상세 정보 가져오기
export async function fetchStockDetail(code: string): Promise<StockDetail> {
  if (USE_MOCK_DATA) {
    // Mock 데이터 생성
    const generateTimeSeries = (count: number): TimeSeriesData[] => {
      return Array.from({ length: count }, (_, i) => ({
        date: `2025-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
        value: 50000 + Math.sin(i / 5) * 5000 + Math.random() * 2000,
      }));
    };

    const generateSentimentImpact = (count: number): SentimentImpactData[] => {
      return Array.from({ length: count }, (_, i) => ({
        date: `2025-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
        positive: Math.random() * 50000 + 20000,
        negative: Math.random() * 30000 + 10000,
        stockPrice: 50000 + Math.sin(i / 5) * 5000 + Math.random() * 2000,
      }));
    };

    return {
      code,
      name: `종목 ${code}`,
      aiAdvice: "현재 긍정적 시장 분위기 속에서 매수 타이밍을 노려볼 만한 구간입니다.",
      sentimentScore: Math.floor(Math.random() * 100),
      keywords: {
        positive: ["실적개선", "매출증가", "신규프로젝트"],
        negative: ["규제강화", "경쟁심화", "비용증가"],
        keywords: ["반도체", "AI기술", "글로벌확장"],
      },
      fearGreedIndex: Math.floor(Math.random() * 100),
      aiDailyBriefing: [
        "오늘 시장은 전반적으로 긍정적인 흐름을 보이고 있습니다.",
        "주요 기관 투자자들의 매수세가 강하게 유입되고 있습니다.",
        "기술적 지표상 상승 추세가 지속될 가능성이 높습니다.",
        "단기 조정 가능성에 대비한 리스크 관리가 필요합니다.",
        "중장기적으로는 펀더멘털 개선이 기대되는 상황입니다."
      ],
      narratives: {
        positive: ["AI 기술 혁신 가속화", "글로벌 수요 증가"],
        negative: ["금리 인상 우려", "공급망 불안정"]
      },
      sentimentImpact: generateSentimentImpact(30),
      timeseries: {
        day: generateTimeSeries(30),
        week: generateTimeSeries(24),
        month: generateTimeSeries(12),
        year: generateTimeSeries(5),
      },
      analysisTable: [
        { date: "2025-11-16", no: 1, column1: "데이터1", column2: "데이터2" },
        { date: "2025-11-15", no: 2, column1: "데이터3", column2: "데이터4" },
        { date: "2025-11-14", no: 3, column1: "데이터5", column2: "데이터6" },
      ],
      sectorComparison: [
        { name: "종목1", value: 85 },
        { name: "종목2", value: 65 },
        { name: "종목3", value: 75 },
        { name: "종목4", value: 90 },
      ],
      discussions: [
        { id: "1", title: "이 종목 전망이 어떤가요?", author: "투자자A", date: "2025-11-16", views: 1234 },
        { id: "2", title: "실적 발표 후 주가 전망", author: "투자자B", date: "2025-11-15", views: 987 },
        { id: "3", title: "장기 투자 관점에서 분석", author: "투자자C", date: "2025-11-14", views: 756 },
      ],
    };
  }

  // 실제 백엔드 API 호출
  return fetchAPI<StockDetail>(`/api/stocks/${code}`);
}
