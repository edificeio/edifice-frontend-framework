import { forwardRef } from 'react';
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
 * Standard HTML div attributes are supported (passed through to the underlying DOM element).
 */
export interface SegmentedControlProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  // Excluded because they are redefined below with different signatures:
  // - onChange: takes (value: string) instead of React.ChangeEvent
  // - defaultValue: excluded by design choice to simplify the API (only controlled mode with value prop is supported)
  'onChange' | 'defaultValue'
> {
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
const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, value, onChange, ...htmlProps }, ref) => {
    const transformedOptions = options.map((option) => {
      return {
        ...option,
        label: (
          <span data-testid={`segmented-option-${option.value}`}>
            {option.label}
          </span>
        ),
      };
    });

    const antProps = {
      options: transformedOptions,
      value,
      onChange,
      ref,
      ...htmlProps,
    };

    return <AntSegmented {...antProps} />;
  },
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
