
import React from 'react';

const SummaryWidgets: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-gray-500 font-medium">나의 관심 종목</h3>
                <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-800">5</span>
                    <span className="text-sm text-gray-500">종목</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                    <span className="text-green-500">3개 상승</span> / <span className="text-red-500">2개 하락</span>
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-gray-500 font-medium">포트폴리오 종합 심리</h3>
                 <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-800">72</span>
                    <span className="text-sm text-green-500 font-semibold">(희망)</span>
                </div>
                <p className="text-4xl mt-1">😊</p>
            </div>
        </div>
    );
};

export default SummaryWidgets;
