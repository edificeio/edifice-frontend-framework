import { useHasWorkflow } from 'src/hooks';
import AlloLycee from './AlloLycee';

const ALLO_LYCEE_ACCESS_WORKFLOW = 'allolycee.access';
const ALLO_LYCEE_ADDRESS = '/allolycee';

export function AlloLyceeContainer() {
  // Undefined while the rights are loading: the card waits for them.
  const hasAccess = useHasWorkflow(ALLO_LYCEE_ACCESS_WORKFLOW);

  if (!hasAccess) return null;

  return (
    <AlloLycee
      onRequestsClick={() => window.open(ALLO_LYCEE_ADDRESS, '_self')}
      onNewRequestClick={() =>
        window.open(`${ALLO_LYCEE_ADDRESS}/new`, '_self')
      }
    />
  );
}

AlloLyceeContainer.displayName = 'AlloLyceeContainer';
