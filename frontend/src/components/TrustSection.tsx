import React from 'react';
import { Users, Shield, Zap } from 'lucide-react';

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const TrustSection: React.FC = () => {
  const trustItems: TrustItem[] = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "10,000+",
      desc: "활성 사용자"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "은행급",
      desc: "보안 시스템"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "실시간",
      desc: "데이터 업데이트"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {trustItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {item.title}
                </div>
                <div className="text-blue-100">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              지금 시작하세요
            </h2>
            <p className="text-xl text-blue-100">
              종목을 검색하고 실시간 감정 분석 리포트를 확인해보세요
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;