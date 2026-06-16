import { DatePicker as AntDatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import { forwardRef } from 'react';

// Import dayjs locales
import 'dayjs/locale/de.js';
import 'dayjs/locale/es.js';
import 'dayjs/locale/fr.js';
import 'dayjs/locale/it.js';
import 'dayjs/locale/pt.js';

// Extend dayjs with plugins required by Ant Design DatePicker
dayjs.extend(weekday);
dayjs.extend(localeData);

/**
 * DatePicker component props
 *
 * Minimal interface that only exposes what is necessary.
 * Ant Design implementation is hidden and no Ant Design-specific props are exposed.
 * Standard HTML div attributes are supported (passed through to the underlying DOM element).
 */
export interface DatePickerProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  // Excluded because they are redefined below with different signatures:
  'onChange' | 'value' | 'defaultValue' // defaultValue is excluded by design choice to simplify the API (only controlled mode with value prop is supported)
> {
  /**
   * Selected date values
   * @default today's date is setted by ant design if no value is provided
   */
  value?: Date;
  /**
   * Callback called when date changes
   */
  onChange?: (date?: Date) => void;

  /**
   * Date format to display in the picker
   * @default 'DD / MM / YYYY'
   */
  dateFormat?: string;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;
}

/**
 * Type for DatePicker ref
 */

/**
 * DatePicker component
 *
 * Date picker component for selecting a date.
 *
 * **Note:** This component uses Ant Design's DatePicker component internally.
 * Only the props defined in DatePickerProps are allowed to prevent
 * dependency on Ant Design-specific features. To replace the implementation,
 * modify the component body below.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={(date) => setDate(date)}
 *   dateFormat="YYYY-MM-DD"
 *   minDate={new Date(today.setDate(today.getDate() - 2))}
 *   maxDate={new Date(today.setDate(today.getDate() + 3))}
 * />
 * ```
 */
const DatePicker = forwardRef<HTMLElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      dateFormat = 'DD / MM / YYYY',
      minDate,
      maxDate,
      ...htmlProps
    },
    ref,
  ) => {
    const handleChange = (date: Dayjs | null) => {
      onChange?.(date ? date.toDate() : undefined);
    };

    const antProps = {
      value: value ? dayjs(value) : undefined,
      onChange: handleChange,
      format: dateFormat,
      minDate: minDate ? dayjs(minDate) : undefined,
      maxDate: maxDate ? dayjs(maxDate) : undefined,
      ref: ref as any, // Cast necessary because AntDatePicker expects a specific type, but our API exposes only HTMLElement to avoid dependency on Ant Design-specific features.
      ...htmlProps,
    };

    const setPopupContainer = (triggerNode: HTMLElement) => {
      return triggerNode.parentElement || document.body;
    };

    return (
      <AntDatePicker {...antProps} getPopupContainer={setPopupContainer} />
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
