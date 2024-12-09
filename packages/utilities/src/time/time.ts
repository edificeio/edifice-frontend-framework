export const convertMsToMS = (milliseconds: number): string => {
  if (milliseconds > 0) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;

    return padTo2Digits(minutes) + ':' + padTo2Digits(seconds);
  }
  return '00:00';
};

export const padTo2Digits = (val: number): string => {
  return val.toString().padStart(2, '0');
};
