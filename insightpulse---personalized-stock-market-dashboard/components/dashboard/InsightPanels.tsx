import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { DebateTopic, PeerData } from '../../types';

interface InsightPanelsProps {
  debateTopics: DebateTopic[];
  peerData: PeerData[];
  activeFilter: string | null;
  setFilter: (topic: string | null) => void;
}

const InsightPanels: React.FC<InsightPanelsProps> = ({ debateTopics, peerData, activeFilter, setFilter }) => {
  
  const handleTopicClick = (topic: string) => {
    setFilter(activeFilter === topic ? null : topic);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel A: Core Debate Topics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h4 className="text-lg font-bold mb-4 text-gray-900">현재 시장의 핵심 논쟁 (클릭하여 필터링)</h4>
        <ul className="space-y-4">
          {debateTopics.map((topic, index) => (
            <li key={index} className="space-y-3">
              <div 
                onClick={() => handleTopicClick(topic.positive)}
                className={`flex items-start p-3 bg-green-50 border-l-4 border-green-400 rounded-r-md cursor-pointer transition-all ${activeFilter === topic.positive ? 'ring-2 ring-blue-400' : 'hover:bg-green-100'}`}
                role="button"
                tabIndex={0}
              >
                <span className="text-lg mr-3 text-green-500">👍</span>
                <p className="text-sm text-gray-700">{topic.positive}</p>
              </div>
              <div 
                onClick={() => handleTopicClick(topic.negative)}
                className={`flex items-start p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md cursor-pointer transition-all ${activeFilter === topic.negative ? 'ring-2 ring-blue-400' : 'hover:bg-red-100'}`}
                role="button"
                tabIndex={0}
              >
                <span className="text-lg mr-3 text-red-500">👎</span>
                <p className="text-sm text-gray-700">{topic.negative}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel B: Peer Group Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h4 className="text-lg font-bold mb-4 text-gray-900">업종 내 여론 비교</h4>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={peerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#4b5563', fontSize: 14 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(229, 231, 235, 0.5)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Bar dataKey="sentimentScore" name="여론 점수" barSize={20}>
                {peerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sentimentScore > 70 ? '#4ade80' : entry.sentimentScore > 50 ? '#facc15' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InsightPanels;