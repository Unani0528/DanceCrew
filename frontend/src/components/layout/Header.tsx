interface HeaderProps {
  companyName: string;
}

export default function Header({ companyName }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {companyName} 투자심리 대시보드
        </h1>
      </div>
    </header>
  );
}
