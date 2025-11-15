// React의 상태 관리 훅 useState를 임포트한다.
import { useState } from 'react'

// InsightPulse 컴포넌트를 임포트
import InsightPulse from './InsightPulse'

import './App.css'

// App 컴포넌트 함수 정의 시작
function App() {
  // React JSX 반환부 - InsightPulse 컴포넌트를 렌더링
  return <InsightPulse />
}

// App 컴포넌트를 외부에 기본 내보내기(export)한다.
export default App
