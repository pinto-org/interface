import { MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { Token } from "@/utils/types";
import React, { useState } from "react";
import MultiLPConversionDialog from "./MultiLPConversionDialog";
import RainbowTableRowConnector from "./RainbowTableRowConnector";

interface MultiLPHelperLinkProps {
  lpTokens: Token[];
  totalSeedsGain: number;
  className?: string;
  onSuccess?: () => void;
}

export default function MultiLPHelperLink({
  lpTokens,
  totalSeedsGain,
  className = "",
  onSuccess,
}: MultiLPHelperLinkProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pintoToken = useChainConstant(MAIN_TOKEN);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    onSuccess?.();
    setIsDialogOpen(false);
  };

  return (
    <>
      <RainbowTableRowConnector
        fromTokens={lpTokens}
        toTarget={`token-row-${pintoToken.address}`}
        extensionLength={40}
        dotted={true}
        componentOffset={20}
        componentOffsetHeight={22}
        component={
          <div className="group flex flex-col max-w-[280px] cursor-pointer place-items-end gap-2">
            <div
              data-action-target="convert-all-lp"
              className="cursor-pointer text-[1.25rem] font-[340] tracking-[-0.025rem] leading-[1.375rem] text-end transition-all hover:scale-105"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "300% 300%",
                animation: "rainbowShift 3s ease infinite",
              }}
              onClick={handleClick}
            >
              🌈 Convert All LP to Pinto
            </div>
            
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="pinto-sm-light text-pinto-gray-4 text-end">
                Convert {lpTokens.length} LP tokens in one transaction
              </div>
              <div className="pinto-sm-light text-pinto-gray-4 text-end">
                Gain {totalSeedsGain.toFixed(0)}+ Seeds with rainbow power ✨
              </div>
            </div>
          </div>
        }
      />

      <MultiLPConversionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        lpTokens={lpTokens}
        onSuccess={handleSuccess}
      />

      {/* Add rainbow animation CSS */}
      <style jsx>{`
        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}