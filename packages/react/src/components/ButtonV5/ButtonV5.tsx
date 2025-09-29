import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { clsx } from 'clsx';
import { muiTheme } from '../../theme';

export interface ButtonV5Props
  extends Omit<MuiButtonProps, 'variant' | 'color' | 'size'> {
  /** Variant du bouton */
  variant?: 'contained' | 'outlined' | 'text';
  /** Couleur du bouton */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** Taille du bouton */
  size?: 'small' | 'medium' | 'large';
  /** État de chargement */
  loading?: boolean;
  /** Bouton désactivé */
  disabled?: boolean;
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Icône à gauche */
  startIcon?: React.ReactNode;
  /** Icône à droite */
  endIcon?: React.ReactNode;
  /** Classe CSS personnalisée */
  className?: string;
  /** Fonction appelée au clic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * ButtonV5 - Composant bouton basé sur MUI
 *
 * Nouvelle version du bouton utilisant Material-UI pour remplacer progressivement
 * les boutons Bootstrap. Intègre parfaitement avec le thème Edifice existant.
 *
 * @example
 * ```tsx
 * <ButtonV5 variant="contained" color="primary" size="medium">
 *   Cliquez ici
 * </ButtonV5>
 * ```
 */
export const ButtonV5 = forwardRef<HTMLButtonElement, ButtonV5Props>(
  (
    {
      variant = 'contained',
      color = 'primary',
      size = 'medium',
      loading = false,
      disabled = false,
      children,
      startIcon,
      endIcon,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Mapping des couleurs personnalisées vers les couleurs MUI
    const getMuiColor = (color: string) => {
      const colorMap: Record<string, string> = {
        primary: 'primary',
        secondary: 'secondary',
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
      };
      return colorMap[color] || 'primary';
    };

    // Mapping des variants pour assurer la compatibilité
    const getMuiVariant = (variant: string) => {
      const variantMap: Record<string, string> = {
        contained: 'contained',
        outlined: 'outlined',
        text: 'text',
      };
      return variantMap[variant] || 'contained';
    };

    // Mapping des tailles
    const getMuiSize = (size: string) => {
      const sizeMap: Record<string, string> = {
        small: 'small',
        medium: 'medium',
        large: 'large',
      };
      return sizeMap[size] || 'medium';
    };

    return (
      <ThemeProvider theme={muiTheme}>
        <MuiButton
          ref={ref}
          variant={getMuiVariant(variant) as any}
          color={getMuiColor(color) as any}
          size={getMuiSize(size) as any}
          disabled={disabled || loading}
          className={clsx('edifice-button-v5', className)}
          onClick={onClick}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : startIcon
          }
          endIcon={!loading ? endIcon : undefined}
          sx={{
            // Styles personnalisés pour correspondre au Button de base
            'textTransform': 'none',
            'fontWeight': 600,
            'borderRadius': '0.8rem',
            'border': '0.1rem solid transparent',
            'display': 'flex',
            'alignItems': 'center',
            'justifyContent': 'center',
            'gap': '0.8rem',
            'height':
              size === 'small'
                ? '3.2rem'
                : size === 'large'
                  ? '4.8rem'
                  : '4rem',
            'paddingLeft':
              size === 'small'
                ? '1.2rem'
                : size === 'large'
                  ? '2rem'
                  : '1.6rem',
            'paddingRight':
              size === 'small'
                ? '1.2rem'
                : size === 'large'
                  ? '2rem'
                  : '1.6rem',
            'paddingTop':
              size === 'small'
                ? '0.4rem'
                : size === 'large'
                  ? '1.2rem'
                  : '0.8rem',
            'paddingBottom':
              size === 'small'
                ? '0.4rem'
                : size === 'large'
                  ? '1.2rem'
                  : '0.8rem',
            'fontSize':
              size === 'small'
                ? '1.4rem'
                : size === 'large'
                  ? '1.6rem'
                  : '1.6rem',
            'lineHeight': '2.2rem',
            'transition': 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            '&:hover': {
              transform: 'translateY(-0.2rem)',
              boxShadow: '0 0.2rem 0 0 var(--mui-palette-primary-main)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
            ...props.sx,
          }}
          {...props}
        >
          {children}
        </MuiButton>
      </ThemeProvider>
    );
  },
);

ButtonV5.displayName = 'ButtonV5';

export default ButtonV5;
