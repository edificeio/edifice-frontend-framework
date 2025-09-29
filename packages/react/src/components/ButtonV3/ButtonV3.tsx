import React from 'react';
import { Button as AntButton } from 'antd';
import { clsx } from 'clsx';

export interface ButtonV3Props {
  /**
   * Taille du bouton
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variante du bouton
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'ghost'
    | 'dashed'
    | 'link'
    | 'text';
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
 * Composant ButtonV3 basé sur Ant Design
 *
 * Ce composant remplace progressivement les boutons Bootstrap
 * en utilisant Ant Design avec le thème personnalisé d'Edifice.
 *
 * @example
 * ```tsx
 * <ButtonV3 variant="primary" size="large">
 *   Cliquer ici
 * </ButtonV3>
 * ```
 */
export const ButtonV3: React.FC<ButtonV3Props> = ({
  size = 'medium',
  variant = 'primary',
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  loading,
  shape,
  htmlType,
  onClick,
  style,
  ...props
}) => {
  // Mapping des tailles
  const antdSize = size === 'medium' ? 'middle' : size;

  // Mapping des variantes vers les types Ant Design
  const getAntdType = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'success':
        return 'primary';
      case 'warning':
        return 'primary';
      case 'danger':
        return 'primary';
      case 'info':
        return 'primary';
      case 'ghost':
        return 'default';
      case 'dashed':
        return 'dashed';
      case 'link':
        return 'link';
      case 'text':
        return 'text';
      default:
        return 'primary';
    }
  };

  // Mapping des couleurs pour les variantes spéciales
  const getButtonColor = (variant: string) => {
    switch (variant) {
      case 'success':
        return '#7dbf85';
      case 'warning':
        return '#f59700';
      case 'danger':
        return '#e13a3a';
      case 'info':
        return '#4bafd5';
      case 'secondary':
        return '#2a9cc8';
      default:
        return undefined;
    }
  };

  const buttonColor = getButtonColor(variant);
  const antdType = getAntdType(variant);

  return (
    <AntButton
      type={antdType as any}
      size={antdSize as any}
      className={clsx(
        'edifice-button-v3',
        `edifice-button-v3--${variant}`,
        `edifice-button-v3--${size}`,
        className,
      )}
      style={{
        ...(buttonColor && {
          backgroundColor: variant === 'ghost' ? 'transparent' : buttonColor,
          borderColor: buttonColor,
          color: variant === 'ghost' ? buttonColor : '#ffffff',
        }),
        ...style,
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

export default ButtonV3;
