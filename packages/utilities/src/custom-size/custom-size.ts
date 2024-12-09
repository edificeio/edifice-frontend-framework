export const customSize = (bytes: number, decimalPoint: number) => {
  if (bytes == 0) return '0 octets';
  const k = 1000,
    dm = decimalPoint || 2,
    sizes = ['octets', 'Ko', 'Mo', 'Go'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
