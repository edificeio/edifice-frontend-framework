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
            // Styles personnalisés pour s'intégrer avec le design system
            'textTransform': 'none',
            'fontWeight': 500,
            'borderRadius': 2,
            'minHeight': size === 'small' ? 32 : size === 'large' ? 48 : 40,
            'px': size === 'small' ? 2 : size === 'large' ? 3 : 2.5,
            'py': size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1,
            'fontSize':
              size === 'small'
                ? '1rem'
                : size === 'large'
                  ? '1.25rem'
                  : '1.125rem',
            '&:hover': {
              boxShadow: variant === 'contained' ? 2 : 0,
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
