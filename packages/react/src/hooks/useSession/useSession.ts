import { IGetSession, odeServices } from "@edifice.io/ts-client";
import { useQuery } from "@tanstack/react-query";

export default function useSession() {
  return useQuery<IGetSession>({
    queryKey: ["session"],
    queryFn: async () => await odeServices.session().getSession(),
  });
}
