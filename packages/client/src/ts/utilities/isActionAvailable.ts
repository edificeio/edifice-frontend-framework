import { IAction } from '../services';

export const isActionAvailable = (
  workflow: string,
  actions: IAction[] | undefined,
) => {
  const found = actions?.filter(
    (action: IAction) => action.id === workflow && action.available,
  );
  return found && found.length > 0;
};
