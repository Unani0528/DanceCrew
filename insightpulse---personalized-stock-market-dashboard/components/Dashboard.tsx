
import React from 'react';
import { STOCKS } from '../constants';
import WelcomeHeader from './dashboard/WelcomeHeader';
import SummaryWidgets from './dashboard/SummaryWidgets';
import StockList from './dashboard/StockList';
import SentimentChart from './dashboard/SentimentChart';
import PremiumCard from './dashboard/PremiumCard';

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 ml-24 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeHeader />
        <SummaryWidgets />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <StockList stocks={STOCKS} />
          </div>
          <div className="space-y-8">
            <SentimentChart />
            <PremiumCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;