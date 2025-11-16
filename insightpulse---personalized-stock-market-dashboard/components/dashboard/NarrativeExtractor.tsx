
import React from 'react';
import type { Narrative } from '../../types';

const NarrativeIcon = () => (
    <svg className="w-8 h-8 text-gray-400 flex-shrink-0 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const NarrativeExtractor: React.FC<{ narratives: Narrative[] }> = ({ narratives }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h4 className="text-lg font-bold text-gray-900 mb-4">현재 시장을 지배하는 내러티브</h4>
      <ul className="space-y-4">
        {narratives.map((narrative) => (
          <li key={narrative.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
            <NarrativeIcon />
            <div>
              <h5 className="font-bold text-gray-800">{narrative.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{narrative.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NarrativeExtractor;
