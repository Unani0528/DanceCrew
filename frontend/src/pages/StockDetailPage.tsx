import React, { useEffect, useState } from "react";
import { fetchStockDetail } from "../api";
import type { StockDetail } from "../api";
import HalfDonut from "../components/HalfDonut";
import SentimentImpactChart from "../components/SentimentImpactChart";

interface StockDetailPageProps {
  code?: string;
}

export default function StockDetailPage({ code }: StockDetailPageProps) {
  const [stockData, setStockData] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) {
      setStockData(null);
      return;
    }

    setLoading(true);
    fetchStockDetail(code)
      .then(setStockData)
      .finally(() => setLoading(false));
  }, [code]);

  if (!code) {
    return <div className="stock-page-empty"><p>좌측에서 종목을 선택하세요</p></div>;
  }

  if (loading || !stockData) {
    return <div className="stock-page-loading"><p>로딩 중...</p></div>;
  }

  return (
    <div className="stock-page">
      {/* 1. AI 어드바이저 한줄 의견 */}
      <div className="ai-advisor">
        <span className="ai-icon">🤖</span>
        <span className="ai-text">{stockData.aiAdvice}</span>
      </div>

      {/* 2. 실시간 여론점수 + 키워드 */}
      <div className="sentiment-keywords-section">
        <div className="sentiment-gauge">
          <HalfDonut value={stockData.sentimentScore} size={280} />
        </div>
        <div className="keywords-grid">
          <div className="keyword-box positive-box">
            <h4>긍정 키워드</h4>
            {stockData.keywords.positive.map((kw, i) => (
              <div key={i} className="keyword-item positive">{kw}</div>
            ))}
          </div>
          <div className="keyword-box negative-box">
            <h4>부정 키워드</h4>
            {stockData.keywords.negative.map((kw, i) => (
              <div key={i} className="keyword-item negative">{kw}</div>
            ))}
          </div>
          <div className="keyword-box core-box">
            <h4>핵심 키워드</h4>
            {stockData.keywords.keywords.map((kw, i) => (
              <div key={i} className="keyword-item core">{kw}</div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 공포탐욕지수 + AI 브리핑 */}
      <div className="fear-greed-briefing-section">
        <div className="fear-greed-chart">
          <h3>실시간 군중심리 분석 (공포·탐욕지수)</h3>
          <HalfDonut value={stockData.fearGreedIndex} size={300} />
          <p className="fear-greed-label">
            {stockData.fearGreedIndex < 25 ? "극심한 공포" :
             stockData.fearGreedIndex < 45 ? "공포" :
             stockData.fearGreedIndex < 55 ? "중립" :
             stockData.fearGreedIndex < 75 ? "탐욕" : "극심한 탐욕"}
          </p>
        </div>
        <div className="ai-briefing">
          <h3>AI 데일리 심리 브리핑</h3>
          <ul className="briefing-list">
            {stockData.aiDailyBriefing.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. 현재 시장 내러티브 */}
      <div className="narratives-section">
        <h3>현재 시장을 지배하는 내러티브 (핵심주제)</h3>
        <div className="narratives-grid">
          <div className="narrative-box positive-narrative">
            <h4>긍정 내러티브</h4>
            {stockData.narratives.positive.map((n, i) => (
              <div key={i} className="narrative-item">• {n}</div>
            ))}
          </div>
          <div className="narrative-box negative-narrative">
            <h4>부정 내러티브</h4>
            {stockData.narratives.negative.map((n, i) => (
              <div key={i} className="narrative-item">• {n}</div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. 커뮤니티 의견 영향도 */}
      <div className="impact-chart-section">
        <SentimentImpactChart data={stockData.sentimentImpact} />
      </div>
    </div>
  );
}
