import { createTheme } from '@mui/material/styles';

// Modern color palette inspired by agricultural themes but contemporary
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Deep green - more sophisticated than the current bright green
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6F00', // Warm orange for accents
      light: '#FFB74D',
      dark: '#E65100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: {
      main: '#388E3C',
      light: '#81C784',
      dark: '#2E7D32',
    },
    warning: {
      main: '#F57C00',
      light: '#FFB74D',
      dark: '#E65100',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.04), 0px 1px 3px 0px rgba(0,0,0,0.08)',
    '0px 3px 1px -2px rgba(0,0,0,0.06), 0px 2px 2px 0px rgba(0,0,0,0.06), 0px 1px 5px 0px rgba(0,0,0,0.10)',
    '0px 3px 3px -2px rgba(0,0,0,0.08), 0px 3px 4px 0px rgba(0,0,0,0.08), 0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.10), 0px 4px 5px 0px rgba(0,0,0,0.10), 0px 1px 10px 0px rgba(0,0,0,0.14)',
    '0px 3px 5px -1px rgba(0,0,0,0.12), 0px 5px 8px 0px rgba(0,0,0,0.12), 0px 1px 14px 0px rgba(0,0,0,0.16)',
    '0px 3px 5px -1px rgba(0,0,0,0.14), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.18)',
    '0px 4px 5px -2px rgba(0,0,0,0.16), 0px 7px 10px 1px rgba(0,0,0,0.16), 0px 2px 16px 1px rgba(0,0,0,0.20)',
    '0px 5px 5px -3px rgba(0,0,0,0.18), 0px 8px 10px 1px rgba(0,0,0,0.18), 0px 3px 14px 2px rgba(0,0,0,0.22)',
    '0px 5px 6px -3px rgba(0,0,0,0.20), 0px 9px 12px 1px rgba(0,0,0,0.20), 0px 3px 16px 2px rgba(0,0,0,0.24)',
    '0px 6px 6px -3px rgba(0,0,0,0.22), 0px 10px 14px 1px rgba(0,0,0,0.22), 0px 4px 18px 3px rgba(0,0,0,0.26)',
    '0px 6px 7px -4px rgba(0,0,0,0.24), 0px 11px 15px 1px rgba(0,0,0,0.24), 0px 4px 20px 3px rgba(0,0,0,0.28)',
    '0px 7px 8px -4px rgba(0,0,0,0.26), 0px 12px 17px 2px rgba(0,0,0,0.26), 0px 5px 22px 4px rgba(0,0,0,0.30)',
    '0px 7px 8px -4px rgba(0,0,0,0.28), 0px 13px 19px 2px rgba(0,0,0,0.28), 0px 5px 24px 4px rgba(0,0,0,0.32)',
    '0px 7px 9px -4px rgba(0,0,0,0.30), 0px 14px 21px 2px rgba(0,0,0,0.30), 0px 5px 26px 4px rgba(0,0,0,0.34)',
    '0px 8px 9px -5px rgba(0,0,0,0.32), 0px 15px 22px 2px rgba(0,0,0,0.32), 0px 6px 28px 5px rgba(0,0,0,0.36)',
    '0px 8px 10px -5px rgba(0,0,0,0.34), 0px 16px 24px 2px rgba(0,0,0,0.34), 0px 6px 30px 5px rgba(0,0,0,0.38)',
    '0px 8px 11px -5px rgba(0,0,0,0.36), 0px 17px 26px 2px rgba(0,0,0,0.36), 0px 6px 32px 5px rgba(0,0,0,0.40)',
    '0px 9px 11px -5px rgba(0,0,0,0.38), 0px 18px 28px 2px rgba(0,0,0,0.38), 0px 7px 34px 6px rgba(0,0,0,0.42)',
    '0px 9px 12px -6px rgba(0,0,0,0.40), 0px 19px 29px 2px rgba(0,0,0,0.40), 0px 7px 36px 6px rgba(0,0,0,0.44)',
    '0px 10px 13px -6px rgba(0,0,0,0.42), 0px 20px 31px 3px rgba(0,0,0,0.42), 0px 8px 38px 7px rgba(0,0,0,0.46)',
    '0px 10px 13px -6px rgba(0,0,0,0.44), 0px 21px 33px 3px rgba(0,0,0,0.44), 0px 8px 40px 7px rgba(0,0,0,0.48)',
    '0px 10px 14px -6px rgba(0,0,0,0.46), 0px 22px 35px 3px rgba(0,0,0,0.46), 0px 8px 42px 7px rgba(0,0,0,0.50)',
    '0px 11px 14px -7px rgba(0,0,0,0.48), 0px 23px 36px 3px rgba(0,0,0,0.48), 0px 9px 44px 8px rgba(0,0,0,0.52)',
    '0px 11px 15px -7px rgba(0,0,0,0.50), 0px 24px 38px 3px rgba(0,0,0,0.50), 0px 9px 46px 8px rgba(0,0,0,0.54)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

export default theme;