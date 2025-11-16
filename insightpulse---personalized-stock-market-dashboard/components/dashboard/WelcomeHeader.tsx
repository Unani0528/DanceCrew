
import React from 'react';

const ChartPlantIcon = () => (
    <svg className="w-28 h-28 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a1 1 0 0 1 1 1v2.08a1 1 0 0 0 .61.92l.74.37a1 1 0 0 1 .64 1.28l-1.07 2.14a1 1 0 0 0 .3 1.37l1.83 1.22a1 1 0 0 1 .58 1.5l-1.57 2.72a1 1 0 0 0 .22 1.4l1.5 1a1 1 0 0 1 .45 1.6l-2.4 2.4" />
        <path d="M12 1a1 1 0 0 0-1 1v2.08a1 1 0 0 1-.61.92l-.74.37a1 1 0 0 0-.64 1.28l1.07 2.14a1 1 0 0 1-.3 1.37l-1.83 1.22a1 1 0 0 0-.58 1.5l1.57 2.72a1 1 0 0 1-.22 1.4l-1.5 1a1 1 0 0 0-.45 1.6l2.4 2.4" />
        <path d="M11 23h2" />
        <path d="M7 23h10v-2a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2z" />
    </svg>
);


const WelcomeHeader: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">안녕하세요, 김현수님!</h1>
                <p className="text-gray-500 mt-1">오늘의 시장 인사이트를 확인해보세요.</p>
            </div>
            <div>
                <ChartPlantIcon />
            </div>
        </div>
    );
};

export default WelcomeHeader;
