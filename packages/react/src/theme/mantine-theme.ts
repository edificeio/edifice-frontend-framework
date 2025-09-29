import { createTheme, MantineColorsTuple } from '@mantine/core';

// Définition des couleurs personnalisées basées sur votre thème existant
const primaryColor: MantineColorsTuple = [
  '#fff7ed',
  '#ffedd5',
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#ff8d2e', // orange (primary) - couleur principale
  '#ea580c',
  '#c2410c',
  '#9a3412',
  '#7c2d12',
];

const secondaryColor: MantineColorsTuple = [
  '#f0f9ff',
  '#e0f2fe',
  '#bae6fd',
  '#7dd3fc',
  '#38bdf8',
  '#2a9cc8', // blue (secondary)
  '#0284c7',
  '#0369a1',
  '#075985',
  '#0c4a6e',
];

const successColor: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#7dbf85', // success
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d',
];

const dangerColor: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#e13a3a', // danger
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
];

const warningColor: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#f59700', // warning
  '#d97706',
  '#b45309',
  '#92400e',
  '#78350f',
];

const infoColor: MantineColorsTuple = [
  '#f0f9ff',
  '#e0f2fe',
  '#bae6fd',
  '#7dd3fc',
  '#38bdf8',
  '#4bafd5', // info
  '#0284c7',
  '#0369a1',
  '#075985',
  '#0c4a6e',
];

// Configuration du thème Mantine
export const mantineTheme = createTheme({
  /** Couleurs personnalisées */
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    success: successColor,
    danger: dangerColor,
    warning: warningColor,
    info: infoColor,
  },

  /** Couleur principale par défaut */
  primaryColor: 'primary',

  /** Configuration des polices */
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',

  /** Tailles de police */
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },

  /** Espacement */
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  /** Rayons de bordure */
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  /** Ombres */
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  /** Configuration des composants */
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
      styles: (theme: any) => ({
        root: {
          'fontWeight': 500,
          'transition': 'all 0.2s ease',
          'border': 'none',
          'boxShadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        filled: {
          'background': `linear-gradient(135deg, ${theme.colors.primary[6]}, ${theme.colors.primary[7]})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.colors.primary[7]}, ${theme.colors.primary[8]})`,
          },
        },
        outline: {
          'border': `2px solid ${theme.colors.primary[6]}`,
          'color': theme.colors.primary[6],
          'background': 'transparent',
          '&:hover': {
            background: theme.colors.primary[0],
            borderColor: theme.colors.primary[7],
          },
        },
        light: {
          'background': theme.colors.primary[0],
          'color': theme.colors.primary[6],
          '&:hover': {
            background: theme.colors.primary[1],
          },
        },
        subtle: {
          'background': 'transparent',
          'color': theme.colors.primary[6],
          '&:hover': {
            background: theme.colors.primary[0],
          },
        },
        gradient: {
          'background': `linear-gradient(135deg, ${theme.colors.primary[5]}, ${theme.colors.primary[7]})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.colors.primary[6]}, ${theme.colors.primary[8]})`,
          },
        },
      }),
    },
    TextInput: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Select: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'lg',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
  },

  /** Configuration des breakpoints */
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },

  /** Configuration des transitions */
  other: {
    transitions: {
      duration: 200,
      timingFunction: 'ease',
    },
  },

  /** Configuration des focus */
  focusRing: 'auto',
});

export default mantineTheme;
