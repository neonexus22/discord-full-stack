import { useQuery } from "@apollo/client";
import { GET_SERVERS } from "../../../graphql/queries/get-servers";

export function useGetServers() {
  const { data: servers, loading } = useQuery(GET_SERVERS);
  return { servers: servers?.getServers, loading };
}
