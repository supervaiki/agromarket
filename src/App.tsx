import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MarketPrices = React.lazy(() => import('./pages/MarketPrices'));
const PriceComparison = React.lazy(() => import('./pages/PriceComparison'));
const TrendPrediction = React.lazy(() => import('./pages/TrendPrediction'));
const MarketAnalysis = React.lazy(() => import('./pages/MarketAnalysis'));

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Typography variant="body1" color="text.secondary">
      Chargement...
    </Typography>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Container maxWidth="xl">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/market-prices" element={<MarketPrices />} />
                  <Route path="/price-comparison" element={<PriceComparison />} />
                  <Route path="/trend-prediction" element={<TrendPrediction />} />
                  <Route path="/market-analysis" element={<MarketAnalysis />} />
                </Routes>
              </Suspense>
            </Container>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ErrorBoundary>
  );
}

export default App;