import BetaSwitch from './BetaSwitch';
import { useBetaSwitch } from './useBetaSwitch';

export function BetaSwitchContainer() {
  const props = useBetaSwitch();

  return <BetaSwitch {...props} />;
}

BetaSwitchContainer.displayName = 'BetaSwitchContainer';
