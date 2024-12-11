import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';
import { useMockedData } from '../../providers/MockedDataProvider';

export default function useHasWorkflow(
  workflow: string | string[],
): (boolean | undefined) | Record<string, boolean> {
  const mock = useMockedData();

  const [state, setState] = useState<
    (boolean | undefined) | Record<string, boolean>
  >();

  useEffect(() => {
    (async () => {
      let response: boolean | Record<string, boolean>;
      if (mock?.hasWorkflow) {
        if (typeof workflow === 'string') {
          response = await mock.hasWorkflow(workflow);
        } else {
          throw 'not.implemented.yet)';
        }
      } else {
        if (typeof workflow === 'string') {
          response = await odeServices
            .rights()
            .sessionHasWorkflowRight(workflow);
        } else {
          response = await odeServices
            .rights()
            .sessionHasWorkflowRights(workflow);
        }
      }
      setState(response);
    })();
  }, [workflow, mock]);

  return state;
}
