
import React from 'react';
import type { OpinionLeader } from '../../types';

const UserAvatarIcon = () => (
    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const KeyOpinionLeaders: React.FC<{ leaders: OpinionLeader[] }> = ({ leaders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h4 className="text-lg font-bold text-gray-900 mb-4">핵심 여론 주도자 Top 3</h4>
      <ul className="space-y-4">
        {leaders.map((leader) => (
          <li key={leader.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg font-bold text-gray-500 w-5">{leader.rank}.</span>
            <UserAvatarIcon />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{leader.nickname}</span>
                 <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    leader.stance === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {leader.stance === 'positive' ? '긍정적' : '부정적'}
                </span>
              </div>
              <div className="mt-1">
                <div className="text-xs text-gray-500 mb-1">영향력 점수: {leader.influenceScore}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                   <div className={`h-1.5 rounded-full ${
                    leader.stance === 'positive' ? 'bg-green-500' : 'bg-red-500'
                  }`} style={{ width: `${leader.influenceScore}%` }}></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyOpinionLeaders;
