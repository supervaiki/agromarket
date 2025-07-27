import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  MobileStepper,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { getAds } from '../api/api';

const ModernAdSlider = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsData = await getAds();
        setAds(adsData);
      } catch (error) {
        console.error('Erreur lors du chargement des publicités', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [ads.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  if (loading) {
    return (
      <Card sx={{ position: 'relative', mb: 4 }}>
        <Skeleton variant="rectangular" height={280} />
      </Card>
    );
  }

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <Card 
      sx={{ 
        position: 'relative', 
        mb: 4,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={280}
          image={currentAd.image_url || currentAd.image}
          alt={currentAd.title}
          sx={{
            objectFit: 'cover',
            transition: 'all 0.7s ease-in-out',
          }}
        />
        
        {/* Overlay with content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            color: 'white',
            p: 3,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {currentAd.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.95,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {currentAd.description}
          </Typography>
        </Box>

        {/* Navigation buttons */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      {/* Stepper */}
      <MobileStepper
        steps={ads.length}
        position="static"
        activeStep={currentIndex}
        sx={{
          backgroundColor: 'transparent',
          justifyContent: 'center',
          py: 1,
          '& .MuiMobileStepper-dot': {
            mx: 0.5,
          },
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        nextButton={<div />}
        backButton={<div />}
      />
    </Card>
  );
};

export default ModernAdSlider;
