import React from 'react';
import SentimentGauge from './SentimentGauge';
import KeyKeywords from './KeyKeywords';
import type { RealtimeSummary } from '../../types';

interface RealtimeSummaryPanelProps {
  summary: RealtimeSummary;
}

const RealtimeSummaryPanel: React.FC<RealtimeSummaryPanelProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <SentimentGauge score={summary.sentimentScore} />
        <KeyKeywords keywords={summary.keyKeywords} />
      </div>
    </div>
  );
};

export default RealtimeSummaryPanel;