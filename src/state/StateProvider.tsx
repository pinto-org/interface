import { useUpdateField } from "./protocol/field/field.updater";
import { useUpdateMorning, useUpdateSunData } from "./protocol/sun/sun.updater";

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  useUpdateMorning();
  useUpdateSunData();
  useUpdateField();
  return <>{children}</>;
};

export default StateProvider;
