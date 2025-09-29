import React from 'react';
import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { clsx } from 'clsx';

export interface ButtonV4Props
  extends Omit<MantineButtonProps, 'variant' | 'color'> {
  /** Variant du bouton */
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient' | 'default';
  /** Couleur du bouton */
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'gray';
  /** Taille du bouton */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** État de chargement */
  loading?: boolean;
  /** Bouton désactivé */
  disabled?: boolean;
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Classe CSS personnalisée */
  className?: string;
  /** Fonction appelée au clic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * ButtonV4 - Composant bouton basé sur Mantine
 *
 * Remplace progressivement les boutons Bootstrap avec une approche moderne
 * utilisant Mantine tout en conservant la compatibilité avec l'API existante.
 *
 * @example
 * ```tsx
 * <ButtonV4 variant="filled" color="primary" size="md">
 *   Cliquez ici
 * </ButtonV4>
 * ```
 */
export const ButtonV4: React.FC<ButtonV4Props> = ({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  onClick,
  ...props
}) => {
  // Mapping des couleurs personnalisées vers les couleurs Mantine
  const getMantineColor = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      danger: 'danger',
      warning: 'warning',
      info: 'info',
      gray: 'gray',
    };
    return colorMap[color] || 'primary';
  };

  // Mapping des variants pour assurer la compatibilité
  const getMantineVariant = (variant: string) => {
    const variantMap: Record<string, string> = {
      filled: 'filled',
      outline: 'outline',
      light: 'light',
      subtle: 'subtle',
      gradient: 'gradient',
      default: 'default',
    };
    return variantMap[variant] || 'filled';
  };

  return (
    <MantineButton
      variant={getMantineVariant(variant)}
      color={getMantineColor(color)}
      size={size}
      loading={loading}
      disabled={disabled}
      className={clsx('edifice-button-v4', className)}
      onClick={onClick}
      style={{
        // Styles personnalisés pour correspondre au Button de base
        'fontFamily': 'inherit',
        'fontWeight': 600,
        'textDecoration': 'none',
        'border': '0.1rem solid transparent',
        'cursor': disabled || loading ? 'not-allowed' : 'pointer',
        'display': 'inline-flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'position': 'relative',
        'userSelect': 'none',
        'whiteSpace': 'nowrap',
        'overflow': 'hidden',
        'textOverflow': 'ellipsis',
        'boxSizing': 'border-box',
        'transition': 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'borderRadius': '0.8rem',
        'gap': '0.8rem',
        '&:hover': {
          transform: 'translateY(-0.2rem)',
          boxShadow: '0 0.2rem 0 0 var(--mantine-color-primary-6)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 'none',
        },
        'height':
          size === 'xs'
            ? '2.4rem'
            : size === 'sm'
              ? '3.2rem'
              : size === 'lg'
                ? '4.8rem'
                : size === 'xl'
                  ? '5.6rem'
                  : '4rem',
        'paddingLeft':
          size === 'xs'
            ? '0.8rem'
            : size === 'sm'
              ? '1.2rem'
              : size === 'lg'
                ? '2rem'
                : size === 'xl'
                  ? '2.4rem'
                  : '1.6rem',
        'paddingRight':
          size === 'xs'
            ? '0.8rem'
            : size === 'sm'
              ? '1.2rem'
              : size === 'lg'
                ? '2rem'
                : size === 'xl'
                  ? '2.4rem'
                  : '1.6rem',
        'paddingTop':
          size === 'xs'
            ? '0.2rem'
            : size === 'sm'
              ? '0.4rem'
              : size === 'lg'
                ? '1.2rem'
                : size === 'xl'
                  ? '1.6rem'
                  : '0.8rem',
        'paddingBottom':
          size === 'xs'
            ? '0.2rem'
            : size === 'sm'
              ? '0.4rem'
              : size === 'lg'
                ? '1.2rem'
                : size === 'xl'
                  ? '1.6rem'
                  : '0.8rem',
        'fontSize':
          size === 'xs'
            ? '1.2rem'
            : size === 'sm'
              ? '1.4rem'
              : size === 'lg'
                ? '1.6rem'
                : size === 'xl'
                  ? '1.8rem'
                  : '1.6rem',
        'lineHeight': '2.2rem',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default ButtonV4;
