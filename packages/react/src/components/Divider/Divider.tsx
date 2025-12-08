import { Divider as AntDivider } from 'antd';
import { ReactNode } from 'react';

/**
 * A divider component that renders a horizontal or vertical line to separate content.
 *
 * @param props - The component props
 * @param props.children - Content to be displayed inside the divider
 * @param props.variant - The variant of the divider. Can be 'dashed', 'dotted', or 'solid'. Defaults to 'solid'
 * @param props.vertical - Whether the divider is vertical. Defaults to false
 * @param props.className - Optional CSS class name for additional styling
 * @param props.style - Optional inline styles for the divider
 *
 * @returns A React component that renders a divider with the specified properties
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Divider with text content
 * <Divider>Section Title</Divider>
 *
 * // Vertical dashed divider
 * <Divider variant="dashed" vertical />
 *
 * // Custom colored divider
 * <Divider className="border-red-500" />
 * ```
 */
const Divider = ({
  children,
  variant = 'solid',
  vertical = false,
  className = 'border-gray-400',
  style,
}: {
  children?: ReactNode;
  variant?: 'dashed' | 'dotted' | 'solid';
  vertical?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <AntDivider
      plain
      children={children}
      variant={variant as any}
      type={vertical ? 'vertical' : 'horizontal'}
      className={className}
      orientation="center"
      style={style}
    />
  );
};

Divider.displayName = 'Divider';

export default Divider;
