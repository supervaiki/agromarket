import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MarketPrices = React.lazy(() => import('./pages/MarketPrices'));
const PriceComparison = React.lazy(() => import('./pages/PriceComparison'));
const TrendPrediction = React.lazy(() => import('./pages/TrendPrediction'));
const MarketAnalysis = React.lazy(() => import('./pages/MarketAnalysis'));
const Login = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AgentDashboard = React.lazy(() => import('./pages/AgentDashboard'));

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

// App layout wrapper component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, py: isAuthenticated ? 3 : 0 }}>
        {isAuthenticated ? (
          <Container maxWidth="xl">
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
      {isAuthenticated && <Footer />}
    </Box>
  );
};

// Route redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'agent') {
    return <Navigate to="/agent" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />
                
                {/* Role-based redirects */}
                <Route path="/" element={<RoleBasedRedirect />} />
                
                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Agent routes */}
                <Route
                  path="/agent"
                  element={
                    <ProtectedRoute roles={['agent']}>
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Shared protected routes */}
                <Route
                  path="/market-prices"
                  element={
                    <ProtectedRoute>
                      <MarketPrices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/price-comparison"
                  element={
                    <ProtectedRoute>
                      <PriceComparison />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trend-prediction"
                  element={
                    <ProtectedRoute>
                      <TrendPrediction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/market-analysis"
                  element={
                    <ProtectedRoute>
                      <MarketAnalysis />
                    </ProtectedRoute>
                  }
                />
                
                {/* Legacy dashboard route - redirect based on role */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;