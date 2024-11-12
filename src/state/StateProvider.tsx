import { useUpdateField } from "./protocol/field/field.updater";
import { useUpdateSunData } from "./protocol/sun/sun.updater";

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  useUpdateSunData();
  useUpdateField();

  return children;
};

export default StateProvider;
