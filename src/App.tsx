import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MarketPrices from './pages/MarketPrices';
import PriceComparison from './pages/PriceComparison';
import TrendPrediction from './pages/TrendPrediction';
import MarketAnalysis from './pages/MarketAnalysis';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Container maxWidth="xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/price-comparison" element={<PriceComparison />} />
              <Route path="/trend-prediction" element={<TrendPrediction />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;