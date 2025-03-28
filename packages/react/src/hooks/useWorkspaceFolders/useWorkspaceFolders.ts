import { odeServices } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';

function useWorkspaceFolders() {
  const { data: folders } = useQuery({
    queryKey: ['workspace-folders'],
    queryFn: async () => await odeServices.workspace().listFolder('owner'),
  });

  return { folders };
}

export default useWorkspaceFolders;
