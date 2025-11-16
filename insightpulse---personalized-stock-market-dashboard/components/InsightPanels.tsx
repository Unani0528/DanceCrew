import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { DebateTopic, PeerData } from '../types';

interface InsightPanelsProps {
  debateTopics: DebateTopic[];
  peerData: PeerData[];
}

const InsightPanels: React.FC<InsightPanelsProps> = ({ debateTopics, peerData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel A: Core Debate Topics */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-bold mb-4 text-slate-100">현재 시장의 핵심 논쟁</h4>
        <ul className="space-y-4">
          {debateTopics.map((topic, index) => (
            <li key={index} className="space-y-3">
              <div className="flex items-start p-3 bg-green-500/10 border-l-4 border-green-500 rounded-r-md">
                <span className="text-lg mr-3 text-green-400">👍</span>
                <p className="text-sm text-slate-300">{topic.positive}</p>
              </div>
              <div className="flex items-start p-3 bg-red-500/10 border-l-4 border-red-500 rounded-r-md">
                <span className="text-lg mr-3 text-red-400">👎</span>
                <p className="text-sm text-slate-300">{topic.negative}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel B: Peer Group Comparison */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-bold mb-4 text-slate-100">업종 내 여론 비교</h4>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={peerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#cbd5e1' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="sentimentScore" name="여론 점수" barSize={20}>
                {peerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sentimentScore > 70 ? '#4ade80' : entry.sentimentScore > 60 ? '#facc15' : '#f87171'} />
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
