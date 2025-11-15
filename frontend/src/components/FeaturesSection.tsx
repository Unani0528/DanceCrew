import React from 'react';
import { Brain, BarChart3, Sparkles } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI 감정 분석",
      description: "최첨단 자연어 처리 기술로 투자자 심리를 정확하게 분석합니다."
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "실시간 리포트",
      description: "시장 동향을 실시간으로 추적하여 즉각적인 인사이트를 제공합니다."
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "스마트 예측",
      description: "과거 데이터와 감정 분석을 결합한 정교한 시장 예측을 경험하세요."
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">강력한 기능</h2>
          <p className="text-xl text-gray-600">
            투자 성공을 위한 모든 도구가 여기 있습니다
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-blue-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;