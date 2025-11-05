import { Card, CardContent } from "@/components/ui/Card";
import type { NFTMetadata } from "@/utils/ipfs";

interface TraitsCardProps {
  attributes?: NFTMetadata["attributes"];
}

// Priority order for trait display
const TRAIT_PRIORITY = ["Tool", "Headwear", "Clothing", "Backpack", "Background Items", "Goggles", "Uniques"];

export const TraitsCard = ({ attributes }: TraitsCardProps) => {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  // Sort attributes by priority order, then alphabetically for unlisted traits
  const sortedAttributes = [...attributes].sort((a, b) => {
    const aPriority = TRAIT_PRIORITY.indexOf(a.trait_type);
    const bPriority = TRAIT_PRIORITY.indexOf(b.trait_type);

    // If both are in priority list, sort by priority
    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }

    // If only a is in priority list, a comes first
    if (aPriority !== -1 && bPriority === -1) {
      return -1;
    }

    // If only b is in priority list, b comes first
    if (aPriority === -1 && bPriority !== -1) {
      return 1;
    }

    // If neither is in priority list, sort alphabetically by trait_type
    return a.trait_type.localeCompare(b.trait_type);
  });

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4">
        <h3 className="pinto-h4 sm:pinto-h3 mb-3 sm:mb-4 text-pinto-dark">Traits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
          {sortedAttributes.map((attribute, index) => (
            <div
              key={`${attribute.trait_type}-${index}`}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100"
            >
              <div className="text-[0.65rem] sm:pinto-xs text-pinto-light uppercase tracking-wide mb-0.5 sm:mb-1">
                {attribute.trait_type}
              </div>
              <div className="pinto-xs sm:pinto-sm font-medium text-pinto-dark break-words">{attribute.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
