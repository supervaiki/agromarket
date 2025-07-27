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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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
    if (ads.length === 0 || !isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [ads.length, isAutoPlaying]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handleBack();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === ' ') {
      event.preventDefault();
      setIsAutoPlaying(!isAutoPlaying);
    }
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
      role="region"
      aria-label="Carousel de publicités"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={280}
          image={currentAd.image_url || currentAd.image}
          alt={`${currentAd.title} - ${currentAd.description}`}
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
            component="h2"
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
          aria-label={`Publicité précédente (${currentIndex > 0 ? currentIndex : ads.length} sur ${ads.length})`}
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
            '&:focus': {
              outline: '2px solid white',
              outlineOffset: 2,
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          aria-label={`Publicité suivante (${currentIndex + 2 > ads.length ? 1 : currentIndex + 2} sur ${ads.length})`}
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
            '&:focus': {
              outline: '2px solid white',
              outlineOffset: 2,
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
        aria-label={`Publicité ${currentIndex + 1} sur ${ads.length}`}
      />
      
      {/* Screen reader announcement */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        Publicité {currentIndex + 1} sur {ads.length}: {currentAd.title}
      </Box>
    </Card>
  );
};

export default ModernAdSlider;
