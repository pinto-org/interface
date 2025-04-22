import { Environment } from "@react-three/drei";

const EnvironmentSetup = () => {
  return <Environment environmentRotation={[0.75, Math.PI / 2, 0.75]} preset="warehouse" />;
};

export default EnvironmentSetup;
