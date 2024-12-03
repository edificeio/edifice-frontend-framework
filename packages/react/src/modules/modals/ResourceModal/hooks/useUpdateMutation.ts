import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { UpdateParameters, UpdateResult, odeServices } from "edifice-ts-client";

const useUpdateMutation = ({
  application,
  options,
}: {
  application: string;
  options?: UseMutationOptions<UpdateResult, Error, UpdateParameters>;
}): UseMutationResult<UpdateResult, Error, UpdateParameters> => {
  return useMutation({
    mutationFn: async (params: UpdateParameters) =>
      await odeServices.resource(application).update(params),
    ...options,
  });
};

export default useUpdateMutation;
