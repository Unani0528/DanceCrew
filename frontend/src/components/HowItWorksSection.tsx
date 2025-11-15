import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  desc: string;
}

const HowItWorksSection: React.FC = () => {
  const steps: Step[] = [
    {
      step: "01",
      title: "데이터 수집",
      desc: "주요 커뮤니티와 SNS의 투자자 댓글을 실시간으로 수집합니다"
    },
    {
      step: "02",
      title: "감정 분석",
      desc: "AI가 각 댓글의 감정을 분석하여 시장 심리를 파악합니다"
    },
    {
      step: "03",
      title: "리포트 생성",
      desc: "분석 결과를 바탕으로 실행 가능한 인사이트를 제공합니다"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">작동 방식</h2>
          <p className="text-xl text-gray-600">
            간단한 3단계로 시장 인사이트를 얻으세요
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-bold text-blue-100 mb-4">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
              {index < 2 && (
                <ChevronRight className="hidden md:block absolute top-8 -right-8 w-8 h-8 text-blue-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;