import React from 'react';

interface Stat {
  value: string;
  label: string;
}

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    { value: "1M+", label: "분석된 댓글" },
    { value: "500+", label: "추적 종목" },
    { value: "99.2%", label: "정확도" },
    { value: "24/7", label: "실시간 모니터링" }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;