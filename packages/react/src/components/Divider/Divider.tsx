import { Divider as AntDivider } from 'antd';
import { ReactNode } from 'react';

/**
 * A divider component that renders a horizontal or vertical line to separate content.
 *
 * @param props - The component props
 * @param props.children - Content to be displayed inside the divider
 * @param props.vertical - Whether the divider is vertical. Defaults to false
 * @param props.className - Optional CSS class name for additional styling of the divider
 * @default 'border-gray-500'
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
 * // Vertical divider
 * <Divider vertical />
 *
 * // Custom colored divider
 * <Divider className="border-red-500" />
 * ```
 */
const Divider = ({
  children,
  vertical = false,
  className = 'border-gray-500',
  style,
}: {
  children?: ReactNode;
  vertical?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <AntDivider
      plain
      children={children}
      type={vertical ? 'vertical' : 'horizontal'}
      className={className}
      orientation="center"
      style={style}
    />
  );
};

Divider.displayName = 'Divider';

export default Divider;
