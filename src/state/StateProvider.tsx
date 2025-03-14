import useUpdateFarmerStatus from "./farmer/status/farmerStatus.updater";
import { useUpdateField } from "./protocol/field/field.updater";
import { useUpdateMorning, useUpdateSunData } from "./protocol/sun/sun.updater";
import { useUpdateFarmerBalances } from "./useFarmerBalances";
import { useUpdateFarmerDepositedBalances } from "./useFarmerDepositedBalances";
import { useUpdateFarmerField } from "./useFarmerField";
import { useUpdateFarmerSilo } from "./useFarmerSilo";
import { useUpdateTokenData } from "./useTokenData";

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  // Group 1: Core protocol state
  useUpdateMorning();
  useUpdateSunData();
  useUpdateField();
  useUpdateTokenData();

  // Group 2: Farmer state (depends on protocol state)
  useUpdateFarmerField();
  useUpdateFarmerSilo();
  useUpdateFarmerBalances();
  useUpdateFarmerDepositedBalances();

  // Group 3: Status (depends on farmer state)
  useUpdateFarmerStatus();

  return <>{children}</>;
};

export default StateProvider;
