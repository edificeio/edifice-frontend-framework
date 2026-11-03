export type ScreenTimeStatus = 'loading' | 'default' | 'empty' | 'error';

export type ScreenTimeView = 'weekly' | 'daily';

export interface ScreenTimeKid {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
}

/** Hour entry of GET /appregistry/screen-time/:kidId/daily */
export interface ScreenTimeHourEntry {
  /** "00".."23" */
  hour: string;
  durationMinutes: number;
  schoolUsePercentage: number;
}

/** Day entry of GET /appregistry/screen-time/:kidId/weekly */
export interface ScreenTimeDayEntry {
  /** "YYYY-MM-DD" */
  date: string;
  durationMinutes: number;
  schoolUsePercentage: number;
}

export interface ScreenTimeChartBar {
  label: string[];
  /** Full accessible label, independent of the (possibly abbreviated) visual `label`. */
  srLabel: string;
  value: number;
  tooltip: string;
}
