import { useHasWorkflow } from 'src/hooks';
import AlloRegion from './AlloRegion';

const ALLO_REGION_ACCESS_WORKFLOW = 'alloregion.access';
const ALLO_REGION_ADDRESS = '/alloregion';

export function AlloRegionContainer() {
  // Undefined while the rights are loading: the card waits for them.
  const hasAccess = useHasWorkflow(ALLO_REGION_ACCESS_WORKFLOW);

  if (!hasAccess) return null;

  return (
    <AlloRegion
      onRequestsClick={() => window.open(ALLO_REGION_ADDRESS, '_self')}
      onNewRequestClick={() =>
        window.open(`${ALLO_REGION_ADDRESS}/new`, '_self')
      }
    />
  );
}

AlloRegionContainer.displayName = 'AlloRegionContainer';
