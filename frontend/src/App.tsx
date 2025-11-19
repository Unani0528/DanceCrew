import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InsightPulse from './InsightPulse'
import DashboardPage from './pages/DashboardPage'
import StockDetailPage from './pages/StockDetailPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InsightPulse />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
      </Routes>
    </Router>
  )
}

