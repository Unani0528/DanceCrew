import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainContent from './components/MainContent'
import Mainpage from './InsightPulse.tsx'

export default function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Mainpage />} />
              {/* :symbol 은 URL 파라미터 */}
              <Route path="/stock/:symbol" element={<MainContent />} />
        </Routes>
      </Router>
  );
}

