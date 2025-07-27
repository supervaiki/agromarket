import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  IconButton, 
  Tooltip, 
  Chip,
  useTheme 
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSignature, setShowSignature] = useState(false);
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 3,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} AgroMarket Tchad. Tous droits réservés.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Conditions d'utilisation
            </Link>
            <Link
              href="#"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Politique de confidentialité
            </Link>
            <Link
              href="#"
              color="text.secondary"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Developer Signature */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {showSignature && (
          <Chip
            label="djongnabe gueyake beni"
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(4px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          />
        )}
        <Tooltip title="Signature du développeur">
          <IconButton
            size="small"
            onClick={() => setShowSignature(!showSignature)}
            sx={{
              color: 'text.disabled',
              '&:hover': {
                color: 'text.secondary',
              },
            }}
          >
            <InfoIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Footer;