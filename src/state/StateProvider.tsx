import { useUpdateSunData } from "./protocol/sun/sun.updater";

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  useUpdateSunData();

  return children;
};

export default StateProvider;
