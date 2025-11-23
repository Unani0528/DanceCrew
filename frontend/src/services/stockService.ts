import type { Stock, Company } from '../types';
import * as api from './api';

// 백엔드 연동 여부 플래그 (개발 중에는 false, 백엔드 준비되면 true)
const USE_BACKEND = false;

// Mock 데이터 생성 함수
function generateMockStock(company: Company): Stock {
  const score = 30 + Math.random() * 60;
  const isPositive = score >= 50; // 점수가 50 이상이면 긍정적
  const positiveRatio = isPositive ? 0.6 + Math.random() * 0.2 : 0.3 + Math.random() * 0.2;
  
  // 30일간의 감정-주가 데이터 생성
  const generateSentimentPriceData = () => {
    const days = 30;
    const result = [];
    const today = new Date();
    const basePrice = 50000 + Math.random() * 50000;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      
      // 점수에 따라 긍정/부정 비율 조정
      const positive = isPositive ? 50 + Math.random() * 30 : 20 + Math.random() * 30;
      const negative = 100 - positive;
      const priceChange = (Math.random() - 0.5) * basePrice * 0.1;
      const stockPrice = Math.round(basePrice + priceChange);
      
      result.push({
        date: dateStr,
        positive: Math.round(positive),
        negative: Math.round(negative),
        stockPrice: stockPrice,
      });
    }
    return result;
  };
  
  return {
    id: company.id,
    company,
    score,
    sentimentPriceData: generateSentimentPriceData(),
    aiSummary: {
      text: `${company.name}에 대한 투자자 심리가 ${score > 70 ? '매우 긍정적' : score > 50 ? '긍정적' : score > 40 ? '중립적' : '부정적'}입니다.`,
      timestamp: new Date().toISOString(),
    },
    realtimeSummary: {
      totalMentions: company.mentions,
      activeUsers: Math.floor(company.mentions * 0.3),
      positiveRatio: positiveRatio,
      avgSentiment: score,
      trendDirection: isPositive ? 'up' : 'down',
    },
    keyKeywords: isPositive ? [
      { word: '실적발표', count: 400 + Math.floor(Math.random() * 200), sentiment: 'positive' },
      { word: '신규투자', count: 350 + Math.floor(Math.random() * 150), sentiment: 'positive' },
      { word: '주가상승', count: 300 + Math.floor(Math.random() * 150), sentiment: 'positive' },
      { word: '경쟁심화', count: 100 + Math.floor(Math.random() * 100), sentiment: 'negative' },
      { word: '단기조정', count: 80 + Math.floor(Math.random() * 80), sentiment: 'negative' },
      { word: '시장변동', count: 120 + Math.floor(Math.random() * 100), sentiment: 'negative' },
      { word: '기술혁신', count: 380 + Math.floor(Math.random() * 150), sentiment: 'core' },
      { word: '글로벌전략', count: 320 + Math.floor(Math.random() * 120), sentiment: 'core' },
      { word: '시장점유율', count: 280 + Math.floor(Math.random() * 100), sentiment: 'core' },
    ] : [
      { word: '실적우려', count: 380 + Math.floor(Math.random() * 200), sentiment: 'negative' },
      { word: '경쟁심화', count: 340 + Math.floor(Math.random() * 150), sentiment: 'negative' },
      { word: '규제우려', count: 300 + Math.floor(Math.random() * 150), sentiment: 'negative' },
      { word: '저가매수', count: 150 + Math.floor(Math.random() * 100), sentiment: 'positive' },
      { word: '반등기대', count: 120 + Math.floor(Math.random() * 80), sentiment: 'positive' },
      { word: '투자유지', count: 100 + Math.floor(Math.random() * 80), sentiment: 'positive' },
      { word: '기술개발', count: 280 + Math.floor(Math.random() * 100), sentiment: 'core' },
      { word: '구조조정', count: 250 + Math.floor(Math.random() * 100), sentiment: 'core' },
      { word: '사업전환', count: 220 + Math.floor(Math.random() * 80), sentiment: 'core' },
    ],
    chartData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      sentiment: isPositive ? 50 + Math.random() * 30 : 30 + Math.random() * 30,
      volume: Math.floor(Math.random() * 1000),
    })),
    debates: isPositive ? [
      { id: '1', title: '급등 예상', participants: 400 + Math.floor(Math.random() * 200), sentiment: 'bullish' },
      { id: '2', title: '목표가 상향', participants: 300 + Math.floor(Math.random() * 150), sentiment: 'bullish' },
      { id: '3', title: '단기 조정 가능성', participants: 150 + Math.floor(Math.random() * 100), sentiment: 'bearish' },
    ] : [
      { id: '1', title: '하락 우려', participants: 380 + Math.floor(Math.random() * 200), sentiment: 'bearish' },
      { id: '2', title: '저점 논쟁', participants: 320 + Math.floor(Math.random() * 150), sentiment: 'bearish' },
      { id: '3', title: '반등 시점', participants: 180 + Math.floor(Math.random() * 100), sentiment: 'bullish' },
    ],
    peerComparison: [
      { name: '경쟁사 A', value: Math.random() * 100 },
      { name: '경쟁사 B', value: Math.random() * 100 },
    ],
    rawComments: isPositive ? [
      {
        id: 'comment-1',
        author: '투자왕',
        text: '실적 발표 이후 주가 상승세가 뚜렷하네요. 장기 보유 관점에서 매력적입니다.',
        timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 45,
      },
      {
        id: 'comment-2',
        author: '시장전문가',
        text: 'AI 반도체 부문 성장 가능성이 크다고 봅니다. 추가 매수 고려 중입니다.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 38,
      },
      {
        id: 'comment-3',
        author: '장기투자자',
        text: '펀더멘털이 견고해서 안심하고 보유할 수 있어요.',
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 32,
      },
      {
        id: 'comment-4',
        author: '냉정분석',
        text: '단기적으로는 조정이 올 수도 있으니 주의가 필요합니다.',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        sentiment: 'negative',
        likes: 18,
      },
      {
        id: 'comment-5',
        author: '기술분석러',
        text: '기술적 지표상 상승 추세가 유지되고 있습니다.',
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 28,
      },
    ] : [
      {
        id: 'comment-1',
        author: '신중투자자',
        text: '실적이 기대에 못 미치네요. 조금 더 지켜봐야 할 것 같습니다.',
        timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
        sentiment: 'negative',
        likes: 42,
      },
      {
        id: 'comment-2',
        author: '가치투자',
        text: '현재 가격은 저평가된 것 같아요. 장기적으로는 괜찮을 듯합니다.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 25,
      },
      {
        id: 'comment-3',
        author: '단타고수',
        text: '경쟁사 대비 밀리는 상황이라 단기 전망은 부정적입니다.',
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
        sentiment: 'negative',
        likes: 35,
      },
      {
        id: 'comment-4',
        author: '시장관찰자',
        text: '규제 이슈가 해소되면 반등 가능성은 있어보입니다.',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        sentiment: 'positive',
        likes: 19,
      },
      {
        id: 'comment-5',
        author: '분석러',
        text: '전반적으로 불확실성이 크네요. 비중 축소를 고려 중입니다.',
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        sentiment: 'negative',
        likes: 31,
      },
    ],
    fomoAlerts: [
      {
        id: 'fomo-1',
        type: 'surge',
        title: '급등 알림',
        message: '최근 1시간 동안 언급량 급증',
        timestamp: new Date().toISOString(),
        severity: 'high',
      },
    ],
    narratives: isPositive ? [
      { 
        id: 'n1', 
        theme: '신기술 개발 성공', 
        sentiment: 'positive', 
        strength: 0.85,
        examples: ['AI 기술 특허 출원', '차세대 반도체 개발', '글로벌 파트너십 체결']
      },
      { 
        id: 'n2', 
        theme: '실적 개선 기대', 
        sentiment: 'positive', 
        strength: 0.78,
        examples: ['분기 매출 증가', '영업이익 개선', '신규 수주 확대']
      },
      { 
        id: 'n3', 
        theme: '시장 경쟁 심화', 
        sentiment: 'negative', 
        strength: 0.45,
        examples: ['중국 업체 점유율 확대', '일부 가격 경쟁']
      },
    ] : [
      { 
        id: 'n1', 
        theme: '실적 부진 우려', 
        sentiment: 'negative', 
        strength: 0.82,
        examples: ['분기 매출 감소', '영업이익률 하락', '수주 감소']
      },
      { 
        id: 'n2', 
        theme: '시장 경쟁 심화', 
        sentiment: 'negative', 
        strength: 0.75,
        examples: ['중국 업체 점유율 확대', '가격 경쟁 격화', '마진율 하락 우려']
      },
      { 
        id: 'n3', 
        theme: '구조조정 기대', 
        sentiment: 'positive', 
        strength: 0.52,
        examples: ['비용 절감 노력', '사업 재편 추진', '장기 전략 수립']
      },
    ],
    opinionLeaders: isPositive ? [
      { 
        id: 'ol1', 
        username: '투자고수', 
        influence: 0.90, 
        sentiment: 'bullish',
        recentPost: `${company.name} 실적 발표 후 주가 상승 전망. AI 반도체 수요 증가로 장기 성장 기대됩니다.`
      },
      { 
        id: 'ol2', 
        username: '시장분석가', 
        influence: 0.75, 
        sentiment: 'bullish',
        recentPost: '펀더멘털이 견조하고 중장기 성장 동력이 확실합니다. 추가 매수 고려 중입니다.'
      },
      { 
        id: 'ol3', 
        username: '테크인사이더', 
        influence: 0.82, 
        sentiment: 'bullish',
        recentPost: '신규 팹 가동으로 생산능력 확대. 메모리 반도체 업황 회복 시그널입니다.'
      },
    ] : [
      { 
        id: 'ol1', 
        username: '신중투자자', 
        influence: 0.88, 
        sentiment: 'bearish',
        recentPost: `${company.name} 실적이 기대치를 하회했습니다. 단기적으로 조정이 불가피해 보입니다.`
      },
      { 
        id: 'ol2', 
        username: '시장분석가', 
        influence: 0.75, 
        sentiment: 'neutral',
        recentPost: '단기적으로는 어렵지만, 장기 투자자라면 현 가격은 매력적일 수 있습니다.'
      },
      { 
        id: 'ol3', 
        username: '업종전문가', 
        influence: 0.79, 
        sentiment: 'bearish',
        recentPost: '경쟁 심화와 마진 압박으로 당분간 실적 개선은 어려울 것으로 보입니다.'
      },
    ],
    sentimentComparison: {
      current: score,
      previous: score - 5 + Math.random() * 10,
      change: Math.random() * 10 - 5,
    },
    dailyBriefing: {
      summary: `${company.name}에 대한 오늘의 투자자 심리를 요약합니다.`,
      keyPoints: isPositive ? [
        '실적 발표 이후 긍정적 반응 지속',
        '기관 투자자 매수세 증가',
        '기술적 분석상 상승 추세 유지',
        '신기술 개발 성과 긍정적 평가',
        '장기 전망은 여전히 긍정적',
      ] : [
        '실적 부진으로 투자 심리 위축',
        '경쟁 심화로 마진 압박 우려',
        '단기 조정 국면 지속 가능성',
        '저가 매수 기회로 보는 시각도 존재',
        '구조조정 기대감은 긍정 요인',
      ],
      outlook: isPositive ? 'positive' : 'negative',
    },
  };
}

// 통합 데이터 가져오기 함수
export async function getStockData(company: Company): Promise<Stock> {
  if (!USE_BACKEND) {
    // Mock 데이터 사용
    return Promise.resolve(generateMockStock(company));
  }

  try {
    // 백엔드 API 병렬 호출
    const [
      sentiment,
      sentimentTrend,
      stockPrice,
      aiSummary,
      keywords,
      narratives,
      fomoAlerts,
      opinionLeaders,
      comments,
      briefing,
      hourlySentiment,
    ] = await Promise.all([
      api.fetchRealtimeSentiment(company.ticker),
      api.fetchSentimentTrend(company.ticker, 30),
      api.fetchStockPrice(company.ticker, 30),
      api.fetchAISummary(company.ticker),
      api.fetchKeywords(company.ticker),
      api.fetchNarratives(company.ticker),
      api.fetchFomoAlerts(company.ticker),
      api.fetchOpinionLeaders(company.ticker),
      api.fetchRealtimeComments(company.ticker, 5),
      api.fetchDailyBriefing(company.ticker),
      api.fetchHourlySentiment(company.ticker),
    ]);

    // 백엔드 응답을 Stock 타입으로 변환
    return {
      id: company.id,
      company,
      score: sentiment.score,
      sentimentPriceData: mergeSentimentAndPrice(sentimentTrend, stockPrice),
      aiSummary,
      realtimeSummary: sentiment.summary,
      keyKeywords: keywords,
      chartData: hourlySentiment,
      debates: [], // TODO: 백엔드에서 제공 시 추가
      peerComparison: [], // TODO: 백엔드에서 제공 시 추가
      rawComments: comments,
      fomoAlerts: fomoAlerts,
      narratives: narratives,
      opinionLeaders: opinionLeaders,
      sentimentComparison: {
        current: sentiment.score,
        previous: sentiment.previousScore,
        change: sentiment.change,
      },
      dailyBriefing: briefing,
    };
  } catch (error) {
    console.error('백엔드 API 호출 실패, Mock 데이터 사용:', error);
    return generateMockStock(company);
  }
}

// 감정 데이터와 주가 데이터 병합
function mergeSentimentAndPrice(sentimentTrend: any[], stockPrice: any[]) {
  return sentimentTrend.map((item, index) => ({
    date: item.date,
    positive: item.positive,
    negative: item.negative,
    stockPrice: stockPrice[index]?.close || 0,
  }));
}
