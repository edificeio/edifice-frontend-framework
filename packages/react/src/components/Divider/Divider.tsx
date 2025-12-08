import { Divider as AntDivider } from 'antd';
import clsx from 'clsx';
import { ReactNode } from 'react';

/**
 * A divider component that renders a horizontal or vertical line to separate content.
 *
 * @param props - The component props
 * @param props.children - Content to be displayed inside the divider
 * @param props.color - The color of the divider border (css class name). Defaults to 'border-gray-400'
 * @param props.variant - The variant of the divider. Can be 'dashed', 'dotted', or 'solid'. Defaults to 'solid'
 * @param props.vertical - Whether the divider is vertical. Defaults to false
 * @param props.className - Optional CSS class name for additional styling
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
 * <Divider color="border-red-500" />
 * ```
 */
export function Divider({
  children,
  color = 'border-gray-400',
  variant = 'solid',
  vertical = false,
  className,
}: {
  children?: ReactNode;
  color?: string;
  variant?: 'dashed' | 'dotted' | 'solid';
  vertical?: boolean;
  className?: string;
}) {
  const classNames = clsx(color, className);

  return (
    <AntDivider
      plain
      children={children}
      variant={variant as any}
      type={vertical ? 'vertical' : 'horizontal'}
      className={classNames}
      orientation="center"
    />
  );
}
