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
        // Styles inline pour s'assurer que les styles sont appliqués
        fontFamily: 'inherit',
        fontWeight: 500,
        textDecoration: 'none',
        border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default ButtonV4;
