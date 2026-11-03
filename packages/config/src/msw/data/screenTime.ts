/** Kid ids for which the screen-time mock answers an edge case. */
export const mockScreenTimeKidIds = {
  notFound: 'screen-time-not-found',
  error: 'screen-time-error',
  empty: 'screen-time-empty',
  zero: 'screen-time-zero',
  pending: 'screen-time-pending',
};

/** Minutes per hour (00h..23h), returned for any other kid and any day. */
export const mockScreenTimeMinutesPerHour = [
  0, 0, 0, 0, 0, 0, 0, 5, 10, 8, 12, 15, 20, 18, 10, 12, 8, 25, 30, 20, 10, 5,
  0, 0,
];

/** Minutes per day (Monday..Sunday), returned for any other kid and any week. */
export const mockScreenTimeMinutesPerWeekday = [
  420, 300, 480, 360, 540, 90, 60,
];
