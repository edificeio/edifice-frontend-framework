import { Button as AntButton } from 'antd';
import { ButtonColorType, ButtonVariantType } from 'antd/es/button';
import { clsx } from 'clsx';
import React from 'react';
import { ButtonColors, ButtonSizes, ButtonVariants } from '../Button/Button';

export interface ButtonAntProps {
  /**
   * Taille du bouton
   */
  size?: ButtonSizes;
  /**
   * `primary`, `secondary`, `tertiary` or `danger`
   */
  color?: ButtonColors;
  /**
   * `filled`, `outline` or `ghost`
   */
  variant?: ButtonVariants;
  /**
   * Icône à afficher avant le texte
   */
  startIcon?: React.ReactNode;
  /**
   * Icône à afficher après le texte
   */
  endIcon?: React.ReactNode;
  /**
   * Classe CSS personnalisée
   */
  className?: string;
  /**
   * Contenu du bouton
   */
  children?: React.ReactNode;
  /**
   * État désactivé
   */
  disabled?: boolean;
  /**
   * État de chargement
   */
  loading?: boolean;
  /**
   * Forme du bouton
   */
  shape?: 'default' | 'circle' | 'round';
  /**
   * Type HTML du bouton
   */
  htmlType?: 'button' | 'submit' | 'reset';
  /**
   * Gestionnaire de clic
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Styles personnalisés
   */
  style?: React.CSSProperties;
  /**
   * Autres props Ant Design
   */
  [key: string]: any;
}

/**
 * Composant ButtonAnt basé sur Ant Design
 *
 * Ce composant remplace progressivement les boutons Bootstrap
 * en utilisant Ant Design avec le thème personnalisé d'Edifice.
 *
 * @example
 * ```tsx
 * <ButtonAnt color="primary" variant="filled" size="large">
 *   Cliquer ici
 * </ButtonAnt>
 * ```
 */
export const ButtonAnt: React.FC<ButtonAntProps> = ({
  size = 'medium',
  variant = 'filled',
  color = 'primary',
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  loading,
  shape,
  htmlType = 'button',
  onClick,
  style,
  ...props
}) => {
  // Mapping des tailles
  const antdSize = size === 'medium' ? 'middle' : size;

  // Mapping des variantes vers les types Ant Design
  const getAntdType = (variant: ButtonVariants): ButtonVariantType => {
    switch (variant) {
      case 'filled':
        return 'solid';
      case 'outline':
        return 'outlined';
      case 'ghost':
        return 'text';
      default:
        return 'solid';
    }
  };

  // Mapping des couleurs pour les variantes spéciales
  const getButtonColor = (color: string) => {
    switch (color) {
      case 'secondary':
        return 'blue';
      case 'tertiary':
        return 'default';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const buttonColor: ButtonColorType = getButtonColor(color);
  const antdType = getAntdType(variant);

  return (
    <AntButton
      type="default"
      size={antdSize as any}
      variant={antdType}
      color={buttonColor}
      className={clsx(
        'edifice-button-v3',
        `edifice-button-v3--${variant}`,
        `edifice-button-v3--${size}`,
        className,
      )}
      style={{
        // Styles personnalisés pour correspondre au Button de base
        fontWeight: 600,
        borderRadius: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        height:
          size === 'small' ? '3.2rem' : size === 'large' ? '4.8rem' : '4rem',
        paddingLeft:
          size === 'small' ? '1.2rem' : size === 'large' ? '2rem' : '1.6rem',
        paddingRight:
          size === 'small' ? '1.2rem' : size === 'large' ? '2rem' : '1.6rem',
        paddingTop:
          size === 'small' ? '0.4rem' : size === 'large' ? '1.2rem' : '0.8rem',
        paddingBottom:
          size === 'small' ? '0.4rem' : size === 'large' ? '1.2rem' : '0.8rem',
        fontSize:
          size === 'small' ? '1.4rem' : size === 'large' ? '1.6rem' : '1.6rem',
        lineHeight: '2.2rem',
        transition: 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-0.2rem)';
          e.currentTarget.style.boxShadow = `0 0.2rem 0 0 ${buttonColor || '#1890ff'}`;
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-0.2rem)';
          e.currentTarget.style.boxShadow = `0 0.2rem 0 0 ${buttonColor || '#1890ff'}`;
        }
        props.onMouseUp?.(e);
      }}
      icon={startIcon}
      disabled={disabled}
      loading={loading}
      shape={shape}
      htmlType={htmlType}
      onClick={onClick}
      {...props}
    >
      {children}
      {endIcon && (
        <span className="edifice-button-v3__end-icon">{endIcon}</span>
      )}
    </AntButton>
  );
};

export default ButtonAnt;
