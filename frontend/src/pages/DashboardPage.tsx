import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Stock, Company } from '../types';
import { MOCK_COMPANIES } from '../constants';
import { getStockData } from '../services/stockService';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import AiAdvisorPanel from '../components/dashboard/AiAdvisorPanel';
import RealtimeSummaryPanel from '../components/dashboard/RealtimeSummaryPanel';
import CorrelationChart from '../components/CorrelationChart';
import InsightPanels from '../components/InsightPanels';
import RawDataSample from '../components/RawDataSample';
import FomoAlert from '../components/dashboard/FomoAlert';
import NarrativeExtractor from '../components/dashboard/NarrativeExtractor';
import KeyOpinionLeaders from '../components/dashboard/KeyOpinionLeaders';
import DailyBriefing from '../components/dashboard/DailyBriefing';
import SentimentPriceChart from '../components/dashboard/SentimentPriceChart';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 데이터 로드
    loadStockData(MOCK_COMPANIES[0]);
  }, []);

  const loadStockData = async (company: Company) => {
    setLoading(true);
    try {
      const stockData = await getStockData(company);
      setSelectedStock(stockData);
    } catch (error) {
      console.error('종목 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company: Company) => {
    navigate(`/stock/${company.ticker}`);
  };

  if (loading || !selectedStock) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onSelectCompany={handleCompanySelect} selectedId={selectedStock.id} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        <Header companyName={selectedStock.company.name} />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeHeader companyName={selectedStock.company.name} />
          
          <AiAdvisorPanel summary={selectedStock.aiSummary} />
          
          <RealtimeSummaryPanel 
            summary={selectedStock.realtimeSummary}
            score={selectedStock.score}
            keywords={selectedStock.keyKeywords}
          />
          
          <CorrelationChart data={selectedStock.chartData} />
          
          {selectedStock.sentimentPriceData && (
            <SentimentPriceChart 
              data={selectedStock.sentimentPriceData} 
              stockCode={selectedStock.company.ticker}
            />
          )}
          
          <InsightPanels debates={selectedStock.debates} peers={selectedStock.peerComparison} />
          
          <RawDataSample comments={selectedStock.rawComments} />
          
          <FomoAlert alerts={selectedStock.fomoAlerts} />
          
          <NarrativeExtractor narratives={selectedStock.narratives} />
          
          <KeyOpinionLeaders leaders={selectedStock.opinionLeaders} />
          
          <DailyBriefing briefing={selectedStock.dailyBriefing} />
        </main>
      </div>
    </div>
  );
}
