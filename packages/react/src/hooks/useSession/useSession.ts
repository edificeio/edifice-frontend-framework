import { useQuery } from "@tanstack/react-query";
import { IGetSession, odeServices } from "edifice-ts-client";

export default function useSession() {
  return useQuery<IGetSession>({
    queryKey: ["session"],
    queryFn: async () => await odeServices.session().getSession(),
  });
}
