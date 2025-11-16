import React from 'react';
import type { RawComment } from '../types';

interface RawDataSampleProps {
  rawComments: RawComment[];
}

const PositiveIcon = () => <span className="text-green-400 text-lg mr-3">👍</span>;
const NegativeIcon = () => <span className="text-red-400 text-lg mr-3">👎</span>;

const RawDataSample: React.FC<RawDataSampleProps> = ({ rawComments }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <h4 className="text-lg font-bold mb-4 text-slate-100">실시간 토론 샘플</h4>
      <div className="max-h-60 overflow-y-auto pr-4 space-y-4">
        {rawComments.map((comment, index) => (
          <div key={index} className="flex items-start bg-slate-800 p-3 rounded-md">
            {comment.sentiment === 'positive' ? <PositiveIcon /> : <NegativeIcon />}
            <p className="text-sm text-slate-300">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RawDataSample;
