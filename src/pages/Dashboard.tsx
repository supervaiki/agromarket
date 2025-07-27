import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Container,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  Store,
  Analytics,
  Warning,
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModernAdSlider from '../components/AdSlider';
import { getMarketPrices, getProducts, getDashboardStats, getMarketInsights } from '../api/api.js';

// Modern StatCard Component
const ModernStatCard = ({ title, value, icon, change, changeLabel, color = 'primary' }) => {
  const isPositive = change > 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: '1rem', color: 'success.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: '1rem', color: 'error.main' }} />
                )}
                <Typography 
                  variant="body2" 
                  color={isPositive ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 500 }}
                >
                  {Math.abs(change)}% {changeLabel}
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Modern PriceCard Component
const ModernPriceCard = ({ product, price, currency, change, unit, market, date }) => {
  const isPositive = change > 0;
  
  return (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {product}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Marché: {market}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(date).toLocaleDateString('fr-FR')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {price?.toLocaleString()} {currency}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              par {unit}
            </Typography>
            <Chip 
              icon={isPositive ? <TrendingUp /> : <TrendingDown />}
              label={`${isPositive ? '+' : ''}${change}%`}
              color={isPositive ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Modern OptimalMarket Component
const OptimalMarketCard = ({ product, market, price, currency, unit }) => (
  <Card 
    sx={{ 
      mb: 2,
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
      border: '1px solid rgba(76, 175, 80, 0.2)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.15)',
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {product}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Marché optimal: {market}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
            {price?.toLocaleString()} {currency}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            par {unit}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [marketPrices, setMarketPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const pricesData = await getMarketPrices();
        const productsData = await getProducts();
        const statsData = await getDashboardStats();
        const insightsData = await getMarketInsights();

        setMarketPrices(pricesData);
        setProducts(productsData);
        setDashboardStats(statsData);
        setMarketInsights(insightsData);

        const optimalMarkets = pricesData.reduce((acc, price) => {
          const existing = acc.find((item) => item.product === price.product.name);
          if (!existing || price.price < existing.price) {
            acc = acc.filter((item) => item.product !== price.product.name);
            acc.push({
              product: price.product.name,
              market: price.market.name,
              price: price.price,
              unit: price.unit,
              currency: price.currency,
            });
          }
          return acc;
        }, []);

        setRecommendations(optimalMarkets);

        insightsData.forEach((insight) => {
          if (!displayedNotifications.has(insight.id)) {
            toast.info(
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="warning" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2">
                    {insight.content}
                  </Typography>
                </Box>
              </Box>,
              {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
            setDisplayedNotifications((prev) => new Set(prev).add(insight.id));
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [displayedNotifications]);

  const featuredProducts = ['mil', 'oignon', 'arachide', 'riz'];
  const featuredPrices = featuredProducts.map((productId) => {
    const product = products.find((p) => p.id === productId);
    const prices = marketPrices.filter((p) => p.product.id === productId);

    if (prices.length === 0 || !product) return null;

    const latestPrice = prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      product: product.name,
      price: latestPrice.price,
      currency: latestPrice.currency,
      change: latestPrice.change,
      unit: latestPrice.unit,
      market: latestPrice.market.name,
      date: latestPrice.date,
    };
  }).filter(Boolean);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 2 }} />
          <Skeleton variant="text" height={40} width={300} sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} lg={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Ad Slider */}
        <ModernAdSlider />
        
        {/* Welcome Banner */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
            }
          }}
        >
          Bienvenue sur le tableau de bord de gestion des prix ! Ici, vous pouvez consulter les produits clés,
          les marchés optimaux pour acheter ou vendre, et un aperçu général du marché.
        </Alert>

        {/* Page Title */}
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 4,
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tableau de bord
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <ModernStatCard
                title={stat.title}
                value={stat.value}
                icon={
                  index === 0 ? <BarChart sx={{ color: 'primary.main' }} /> :
                  index === 1 ? <Store sx={{ color: 'secondary.main' }} /> :
                  index === 2 ? <Analytics sx={{ color: 'success.main' }} /> :
                  <TrendingUp sx={{ color: 'warning.main' }} />
                }
                change={stat.change}
                changeLabel={stat.changeLabel}
                color={index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'warning'}
              />
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Featured Products */}
          <Grid item xs={12} lg={6}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Prix des produits clés
            </Typography>
            <Box>
              {featuredPrices.map((item, index) => (
                <ModernPriceCard
                  key={index}
                  product={item.product}
                  price={item.price}
                  currency={item.currency}
                  change={item.change}
                  unit={item.unit}
                  market={item.market}
                  date={item.date}
                />
              ))}
            </Box>
          </Grid>

          {/* Optimal Markets */}
          <Grid item xs={12} lg={6}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Marchés Optimaux
            </Typography>
            <Box>
              {recommendations.map((item, index) => (
                <OptimalMarketCard
                  key={index}
                  product={item.product}
                  market={item.market}
                  price={item.price}
                  currency={item.currency}
                  unit={item.unit}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <ToastContainer />
      </Box>
    </Container>
  );
};

export default Dashboard;