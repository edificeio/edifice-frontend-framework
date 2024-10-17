import { useCallback, useState } from 'react';
// Hook
// Parameter is the boolean, with default "false" value
export default function useToggle(initialState = false): [boolean, any] {
  // Initialize the state
  const [state, setState] = useState<boolean>(initialState);
  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback((): void => {
    setState((prevState: any) => !prevState);
  }, []);
  return [state, toggle];
}
