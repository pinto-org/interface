import { CheckmarkIcon } from "./Icons";

export default function CheckmarkCircle({ isSelected = false }: { isSelected: boolean | undefined }) {
  return (
    <div
      className={`w-6 h-6 border rounded-full flex items-center justify-center ${isSelected ? "border-pinto-green-4 bg-pinto-green-1 text-pinto-green-4" : "border-pinto-gray-2 bg-transparent"}`}
    >
      {isSelected && <CheckmarkIcon color="currentColor" width={16} height={16} />}
    </div>
  );
}
