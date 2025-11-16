
import React from 'react';
import type { FomoAlertData } from '../../types';

const FomoAlert: React.FC<{ data: FomoAlertData }> = ({ data }) => {
  const { level, discussionVolumeChange } = data;

  const getMeterColor = () => {
    if (level === 'stable') return 'bg-blue-500';
    if (level === 'interest') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMeterRotation = () => {
    if (level === 'stable') return 'rotate-[-45deg]';
    if (level === 'interest') return 'rotate-[0deg]';
    return 'rotate-[45deg]';
  };
  
  const getStatusText = () => {
      if (level === 'stable') return "현재 토론량은 평소 수준입니다.";
      if (level === 'interest') return `지난 1시간 동안 토론량이 평소 대비 ${discussionVolumeChange}% 증가했습니다. 관심이 높아지고 있습니다.`;
      return (
        <span>
            ⚠️ <strong>경보:</strong> 지난 1시간 동안 토론량이 평소 대비 <strong>{discussionVolumeChange}%</strong> 급증했습니다. FOMO 현상에 유의하세요.
        </span>
      );
  }

  const getTextColor = () => {
    if (level === 'stable') return 'text-gray-700';
    if (level === 'interest') return 'text-yellow-800';
    return 'text-red-800';
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-full flex flex-col">
      <h4 className="text-lg font-bold text-gray-900 mb-4">실시간 군중심리 분석</h4>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-48 h-24 overflow-hidden relative mb-2">
          <div className="w-full h-full border-8 border-gray-200 rounded-t-full border-b-0 absolute top-0"></div>
          <div className={`w-full h-full border-8 border-transparent rounded-t-full border-b-0 absolute top-0 ${getMeterColor()}`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)' }}></div>
          <div className={`absolute bottom-0 left-1/2 w-1 h-20 bg-gray-800 transition-transform duration-500 ease-in-out origin-bottom ${getMeterRotation()}`}>
            <div className="w-4 h-4 bg-gray-800 rounded-full absolute -top-2 -left-[6px]"></div>
          </div>
        </div>
        <div className="flex justify-between w-52 text-xs font-semibold text-gray-500 px-2">
            <span>안정</span>
            <span>관심</span>
            <span>과열</span>
        </div>
      </div>
       <p className={`text-center font-medium mt-4 p-3 rounded-lg ${getTextColor()} ${level === 'overheated' ? 'bg-red-50' : level === 'interest' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
          {getStatusText()}
        </p>
    </div>
  );
};

export default FomoAlert;
