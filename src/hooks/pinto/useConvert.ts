import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { Token } from "graphql";

export default function useConvert() {
  const tokenData = useTokenData();
  const siloData = useSiloData();

  const getTargetsWithToken = (token: Token) => {};
}
