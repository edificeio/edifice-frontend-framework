/**
 * This function aggregate events and call the callback with aggregated events every {delay}
 *
 * @param delay delay between each call
 * @param map a function to transform event from {INPUT} to {OUTPUT}
 * @param callback a callback called with aggregated events every x ms
 * @returns a function that take as argument (INPUT)=>void
 */
export function aggregate<INPUT, OUTPUT>(
  delay: number,
  map: (input: INPUT) => OUTPUT,
  callback: (aggregated: OUTPUT[]) => void,
): (arg: INPUT) => void {
  let timerId: number | undefined;
  const pending: OUTPUT[] = [];
  return function (arg: INPUT) {
    pending.push(map(arg));
    if (timerId) {
      return;
    }
    timerId = setTimeout(() => {
      const copy = [...pending];
      // remove all
      pending.splice(0, pending.length);
      // call with aggregated
      callback(copy);
      // reset timer
      timerId = undefined;
    }, delay) as unknown as number;
  };
}
