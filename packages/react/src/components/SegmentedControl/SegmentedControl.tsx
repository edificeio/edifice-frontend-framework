import { forwardRef, Ref } from 'react';
import { Segmented as AntSegmented } from 'antd';

/**
 * Simple option for SegmentedControl
 */
export interface SegmentedOption {
  /**
   * Option label
   */
  label: string;
  /**
   * Option value
   */
  value: string;
}

/**
 * SegmentedControl component props
 *
 * Minimal interface that only exposes what is necessary.
 * Ant Design implementation is hidden and no Ant Design-specific props are exposed.
 */
export interface SegmentedControlProps {
  /**
   * Segmented control options
   */
  options: SegmentedOption[];
  /**
   * Selected value
   */
  value?: string;
  /**
   * Callback called when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * SegmentedControl component
 *
 * Segmented control component for selecting between multiple options.
 *
 * **Note:** This component uses Ant Design's Segmented component internally.
 * Only the props defined in SegmentedControlProps are allowed to prevent
 * dependency on Ant Design-specific features. To replace the implementation,
 * modify the component body below.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { label: 'List', value: 'list' },
 *     { label: 'Kanban', value: 'kanban' },
 *     { label: 'Table', value: 'table' }
 *   ]}
 *   value={value}
 *   onChange={(val) => setValue(val)}
 * />
 * ```
 */
const SegmentedControl = forwardRef(
  (
    {
      options,
      value,
      onChange,
      className,
      ...restProps
    }: SegmentedControlProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const antProps = {
      options,
      value,
      onChange,
      className,
      ...restProps,
    };

    return <AntSegmented ref={ref} {...antProps} />;
  },
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
