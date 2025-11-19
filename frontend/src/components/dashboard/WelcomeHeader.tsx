interface WelcomeHeaderProps {
  companyName: string;
}

export default function WelcomeHeader({ companyName }: WelcomeHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">
        {companyName} 투자 심리 분석
      </h1>
      <p className="text-blue-100">
        실시간 투자자 여론과 시장 심리를 한눈에 파악하세요
      </p>
    </div>
  );
}
