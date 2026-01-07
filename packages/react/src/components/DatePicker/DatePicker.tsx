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
  React.HTMLAttributes<HTMLDivElement>,
  // Excluded because they are redefined below with different signatures:
  // - onChange: takes (date: string | null) instead of React.ChangeEvent
  // - defaultValue: excluded by design choice to simplify the API (only controlled mode with value prop is supported)
  'onChange' | 'value'
> {
  /**
   * Selected date value
   * @default new Date()
   */
  value?: Date;
  /**
   * Callback called when date changes
   */
  onChange?: (date?: Date) => void;

  /**
   * Date format to display in the picker
   * @default 'YYY-MM-DD'
   */
  dateFormat?: string;
}

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
 * />
 * ```
 */
const DatePicker = forwardRef<any, DatePickerProps>(
  ({ value = new Date(), onChange, dateFormat }, ref) => {
    const handleChange = (date: Dayjs | null) => {
      onChange?.(date ? date.toDate() : undefined);
    };

    const antProps = {
      value: dayjs(value),
      onChange: handleChange,
      format: dateFormat,
      ref,
    };

    return <AntDatePicker {...antProps} />;
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
