// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API 호출 헬퍼 함수
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API 에러 (${endpoint}):`, error);
    throw error;
  }
}

// 종목 목록 API
export async function fetchTopStocks(limit: number = 10) {
  return fetchAPI(`/api/stocks/top?limit=${limit}`);
}

// 특정 종목 상세 정보 API
export async function fetchStockDetail(ticker: string) {
  return fetchAPI(`/api/stocks/${ticker}`);
}

// 실시간 여론 점수 API
export async function fetchRealtimeSentiment(ticker: string) {
  return fetchAPI(`/api/sentiment/realtime/${ticker}`);
}

// 감정 추이 데이터 API (30일)
export async function fetchSentimentTrend(ticker: string, days: number = 30) {
  return fetchAPI(`/api/sentiment/trend/${ticker}?days=${days}`);
}

// 주가 데이터 API
export async function fetchStockPrice(ticker: string, days: number = 30) {
  return fetchAPI(`/api/stock-price/${ticker}?days=${days}`);
}

// AI 요약 API
export async function fetchAISummary(ticker: string) {
  return fetchAPI(`/api/ai/summary/${ticker}`);
}

// 핵심 키워드 API
export async function fetchKeywords(ticker: string) {
  return fetchAPI(`/api/keywords/${ticker}`);
}

// 내러티브 API
export async function fetchNarratives(ticker: string) {
  return fetchAPI(`/api/narratives/${ticker}`);
}

// FOMO 알림 API
export async function fetchFomoAlerts(ticker: string) {
  return fetchAPI(`/api/alerts/fomo/${ticker}`);
}

// 오피니언 리더 API
export async function fetchOpinionLeaders(ticker: string) {
  return fetchAPI(`/api/opinion-leaders/${ticker}`);
}

// 실시간 댓글 API
export async function fetchRealtimeComments(ticker: string, limit: number = 5) {
  return fetchAPI(`/api/comments/realtime/${ticker}?limit=${limit}`);
}

// 데일리 브리핑 API
export async function fetchDailyBriefing(ticker: string) {
  return fetchAPI(`/api/briefing/daily/${ticker}`);
}

// 24시간 감정 추이 API
export async function fetchHourlySentiment(ticker: string) {
  return fetchAPI(`/api/sentiment/hourly/${ticker}`);
}

// CNN Fear & Greed Index (외부 API)
export async function fetchFearGreedIndex() {
  try {
    const response = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata');
    const result = await response.json();
    
    if (result && result.fear_and_greed) {
      return {
        value: result.fear_and_greed.score,
        valueText: result.fear_and_greed.rating,
        timestamp: result.fear_and_greed.timestamp,
      };
    }
  } catch (error) {
    console.error('Fear & Greed Index 로딩 실패:', error);
    // Fallback to mock data
    return {
      value: 50,
      valueText: 'Neutral',
      timestamp: new Date().toISOString(),
    };
  }
}
