import { createTheme, ThemeOptions } from '@mui/material/styles';

// Configuration du thème MUI basée sur votre thème existant
const muiThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#ff8d2e', // orange (primary)
      light: '#ffedd5',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2a9cc8', // blue (secondary)
      light: '#e0f2fe',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    success: {
      main: '#7dbf85', // success
      light: '#dcfce7',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e13a3a', // danger
      light: '#fee2e2',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59700', // warning
      light: '#fef3c7',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    info: {
      main: '#4bafd5', // info
      light: '#e0f2fe',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
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
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          'borderRadius': 8,
          'textTransform': 'none',
          'fontWeight': 500,
          'padding': '8px 16px',
          'minHeight': 40,
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          },
        },
        outlined: {
          'borderWidth': '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: '2px solid #ff8d2e',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
};

// Créer le thème MUI
export const muiTheme = createTheme(muiThemeOptions);

export default muiTheme;
