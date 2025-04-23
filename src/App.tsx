import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketPrices from './pages/MarketPrices';
import PriceComparison from './pages/PriceComparison';
import TrendPrediction from './pages/TrendPrediction';
import MarketAnalysis from './pages/MarketAnalysis';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/price-comparison" element={<PriceComparison />} />
              <Route path="/trend-prediction" element={<TrendPrediction />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;