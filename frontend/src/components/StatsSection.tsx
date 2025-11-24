import React, { useEffect, useState } from 'react';

interface Stat {
  value: string;
  label: string;
}

const StatsSection: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState<string>("로딩 중...");
  const [loading, setLoading] = useState<boolean>(true); // 추가: loading 상태

  // 업데이트 날짜 가져오기
  const fetchLastUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/comments/last-update/');
      if (response.ok) {
        const data = await response.json();
        setLastUpdate(data.last_update);
      }
    } catch (error) {
      console.error('업데이트 날짜 조회 실패:', error);
      setLastUpdate("조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로드
    fetchLastUpdate();

    // 30초마다 자동 업데이트
    const interval = setInterval(fetchLastUpdate, 30000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  // stats 배열을 함수 아래로 이동하여 lastUpdate 상태 사용 가능
  const stats: Stat[] = [
    { value: "1M+", label: "분석된 댓글" },
    { value: "500+", label: "추적 종목" },
    { value: "90.2%", label: "정확도" },
    { value: lastUpdate, label: "마지막 업데이트 일자" } // 수정: lastUpdate 사용
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
