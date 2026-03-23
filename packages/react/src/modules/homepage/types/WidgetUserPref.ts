export type WidgetUserPref = {
  //--------------------------------------------------------------------------
  // General user's preferences, available for every widget.
  //--------------------------------------------------------------------------
  /** Boolean indicating wether the user wants to see this widget, or not. */
  show: boolean;
  /** Integer defining the sort order of this widget. */
  index: number;
  /** Prefered column on-screen. */
  position?: 'left' | 'right';
} & {
  //--------------------------------------------------------------------------
  // Specific user's preferences, available to some widgets only.
  //--------------------------------------------------------------------------
  /** Lastest selected school ID, in SchoolWidget */
  schoolId?: string;
};
