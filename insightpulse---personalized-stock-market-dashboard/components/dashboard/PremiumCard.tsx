
import React from 'react';

const LightbulbBrainIcon = () => (
    <svg className="w-16 h-16 text-yellow-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6" />
        <path d="M10 18s1-4 2-4 2 4 2 4" />
        <path d="M10 12a2 2 0 1 1 4 0" />
        <path d="M12 12v-1" />
        <path d="M12 8V7" />
        <path d="M9 12a3 3 0 0 0-3 3v2" />
        <path d="M15 12a3 3 0 0 1 3 3v2" />
        <path d="M12 22a7.5 7.5 0 0 0 7.5-7.5c0-4.14-3.36-7.5-7.5-7.5S4.5 10.36 4.5 14.5A7.5 7.5 0 0 0 12 22z" />
        <path d="M12 2v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
    </svg>
);


const PremiumCard: React.FC = () => {
    return (
        <div className="bg-indigo-600 rounded-xl shadow-sm p-8 text-white text-center">
            <LightbulbBrainIcon />
            <h3 className="text-lg font-bold mt-4">더 깊은 인사이트를 원하시나요?</h3>
            <p className="text-indigo-200 text-sm mt-2">AI 기반 주가 예측 알림 등 프리미엄 기능을 잠금 해제하세요.</p>
            <button className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-lg mt-6 hover:bg-gray-100 transition-colors w-full">
                프리미엄 플랜 알아보기
            </button>
        </div>
    );
};

export default PremiumCard;
