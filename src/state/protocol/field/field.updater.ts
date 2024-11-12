import { useAtom } from "jotai";
import { temperatureAtom } from "./field.atoms";

const settings = {
  query: {
    staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  },
};

const useUpdateField = () => {
  const [temperatureAtom, setTemperatureAtom] = useAtom(temperatureAtom);
};
