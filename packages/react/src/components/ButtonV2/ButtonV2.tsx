import { forwardRef, ReactNode, Ref } from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  Spinner,
  HStack,
} from '@chakra-ui/react';

export type ButtonV2Ref = HTMLButtonElement;

export type ButtonV2Types = 'button' | 'submit' | 'reset';
export type ButtonV2Colors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';
export type ButtonV2Variants = 'solid' | 'outline' | 'ghost';
export type ButtonV2Sizes = 'sm' | 'md' | 'lg';

export interface ButtonV2Props
  extends Omit<ChakraButtonProps, 'colorScheme' | 'size' | 'variant'> {
  /**
   * `button`, `submit` or `reset`
   */
  type?: ButtonV2Types;
  /**
   * `primary`, `secondary`, `tertiary`, `danger`, `success`, `warning`, `info`
   */
  color?: ButtonV2Colors;
  /**
   * `solid`, `outline` or `ghost`
   */
  variant?: ButtonV2Variants;
  /**
   * `sm`, `md` or `lg`
   */
  size?: ButtonV2Sizes;
  /**
   * Does it has a text ?
   */
  children?: ReactNode;
  /**
   * Display Icon Component to the left
   */
  leftIcon?: ReactNode;
  /**
   * Display Icon Component to the right
   */
  rightIcon?: ReactNode;
  /**
   * Is it loading ?
   */
  isLoading?: boolean;
  /**
   * Loading Icon Position
   * `left`, `right`
   */
  loadingPosition?: 'left' | 'right';
  /**
   * Disabled status
   */
  disabled?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * ButtonV2 - Nouveau composant bouton utilisant Chakra UI
 * Remplace progressivement le composant Button basé sur Bootstrap
 */
const ButtonV2 = forwardRef(
  (
    {
      color = 'primary',
      type = 'button',
      size = 'md',
      children,
      isLoading,
      loadingPosition = 'left',
      leftIcon,
      rightIcon,
      className,
      variant = 'solid',
      disabled,
      ...restProps
    }: ButtonV2Props,
    ref: Ref<ButtonV2Ref>,
  ) => {
    // Gestion des icônes et du loading
    const renderContent = () => {
      if (isLoading) {
        const spinner = <Spinner size="sm" />;

        if (loadingPosition === 'left') {
          return (
            <HStack gap={2}>
              {spinner}
              {children && <span>{children}</span>}
            </HStack>
          );
        } else {
          return (
            <HStack gap={2}>
              {children && <span>{children}</span>}
              {spinner}
            </HStack>
          );
        }
      }

      return (
        <HStack gap={2}>
          {leftIcon && <span>{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span>{rightIcon}</span>}
        </HStack>
      );
    };

    // Styles personnalisés basés sur votre système Bootstrap
    const getButtonStyles = () => {
      const baseStyles = {
        fontWeight: '600',
        borderRadius: '0.8rem',
        border: '0.1rem solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        height: '4rem',
        paddingX: '1.6rem',
        paddingY: '0.8rem',
        fontSize: '1.6rem',
        lineHeight: '2.2rem',
        _focus: {
          boxShadow: '0 0 0 0.4rem var(--edifice-secondary-200)',
        },
      };

      // Styles par taille
      const sizeStyles = {
        sm: {
          height: '3.2rem',
          paddingX: '1.2rem',
          paddingY: '0.4rem',
          fontSize: '1.4rem',
        },
        md: {
          height: '4rem',
          paddingX: '1.6rem',
          paddingY: '0.8rem',
          fontSize: '1.6rem',
        },
        lg: {
          height: '4.8rem',
          paddingX: '2rem',
          paddingY: '1.2rem',
          fontSize: '1.6rem',
        },
      };

      // Styles par couleur et variant
      const getColorStyles = () => {
        const colorMap = {
          primary: {
            solid: {
              bg: 'primary.500',
              color: 'white',
              _hover: { bg: 'primary.600' },
              _active: { bg: 'primary.700' },
              _disabled: { bg: 'gray.300', color: 'gray.600' },
            },
            outline: {
              border: '0.1rem solid',
              borderColor: 'primary.500',
              color: 'primary.500',
              bg: 'transparent',
              _hover: { bg: 'primary.50' },
              _active: { bg: 'primary.100' },
              _disabled: { borderColor: 'gray.300', color: 'gray.500' },
            },
            ghost: {
              color: 'primary.500',
              bg: 'transparent',
              _hover: { bg: 'primary.50' },
              _active: { bg: 'primary.100' },
              _disabled: { color: 'gray.500' },
            },
          },
          secondary: {
            solid: {
              bg: 'secondary.500',
              color: 'white',
              _hover: { bg: 'secondary.600' },
              _active: { bg: 'secondary.700' },
              _disabled: { bg: 'gray.300', color: 'gray.600' },
            },
            outline: {
              border: '0.1rem solid',
              borderColor: 'secondary.500',
              color: 'secondary.500',
              bg: 'transparent',
              _hover: { bg: 'secondary.50' },
              _active: { bg: 'secondary.100' },
              _disabled: { borderColor: 'gray.300', color: 'gray.500' },
            },
            ghost: {
              color: 'secondary.500',
              bg: 'transparent',
              _hover: { bg: 'secondary.50' },
              _active: { bg: 'secondary.100' },
              _disabled: { color: 'gray.500' },
            },
          },
          danger: {
            solid: {
              bg: 'danger.500',
              color: 'white',
              _hover: { bg: 'danger.600' },
              _active: { bg: 'danger.700' },
              _disabled: { bg: 'gray.300', color: 'gray.600' },
            },
            outline: {
              border: '0.1rem solid',
              borderColor: 'danger.500',
              color: 'danger.500',
              bg: 'transparent',
              _hover: { bg: 'danger.50' },
              _active: { bg: 'danger.100' },
              _disabled: { borderColor: 'gray.300', color: 'gray.500' },
            },
            ghost: {
              color: 'danger.500',
              bg: 'transparent',
              _hover: { bg: 'danger.50' },
              _active: { bg: 'danger.100' },
              _disabled: { color: 'gray.500' },
            },
          },
        };

        return (
          colorMap[color as keyof typeof colorMap]?.[
            variant as keyof typeof colorMap.primary
          ] || {}
        );
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...getColorStyles(),
      };
    };

    return (
      <ChakraButton
        ref={ref}
        data-testid="button-v2"
        className={className}
        type={type}
        disabled={disabled || isLoading}
        {...getButtonStyles()}
        {...restProps}
      >
        {renderContent()}
      </ChakraButton>
    );
  },
);

ButtonV2.displayName = 'ButtonV2';

export default ButtonV2;
