import depositIcon from "@/assets/protocol/Deposit.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ToggleGroupItem } from "@/components/ui/ToggleGroup";
import DepositDialog from "@/components/DepositDialog";
import { useDenomination } from "@/hooks/useAppSettings";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { formatter, truncateHex } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { DepositData, Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { HTMLMotionProps } from "framer-motion";
import React, { useState } from "react";
import CheckmarkCircle from "./CheckmarkCircle";
import IconImage from "./ui/IconImage";
import { PrivateModeWrapper } from "./PrivateModeWrapper";

interface DepositsTableProps {
  token: Token;
  selected?: string[];
  useToggle?: boolean;
  mode?: "send" | "combine";
}

interface DepositRowProps extends HTMLMotionProps<"tr"> {
  deposit: DepositData;
  token: Token;
  price: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean;
  isLoading: boolean;
  onRowClick: (deposit: DepositData) => void;
}

const DepositRow = React.forwardRef<HTMLTableRowElement, DepositRowProps & React.HTMLAttributes<HTMLTableRowElement>>(
  ({ deposit, token, price, useToggle, isSelected, isLoading, onRowClick, ...props }, ref) => {
    const denomination = useDenomination();

    return (
      <TableRow
        {...props}
        ref={ref}
        className={`h-[4.5rem] transition-all ${
          deposit.isGerminating ? "bg-pinto-off-green/15" : deposit.isPlantDeposit ? "bg-pinto-green-4/15" : "bg-white"
        } text-[1rem] ${
          useToggle 
            ? "hover:bg-pinto-green-1/50" 
            : "hover:cursor-pointer hover:bg-pinto-green-1/50"
        }`}
        onClick={() => onRowClick(deposit)}
      >
        <TableCell className="hidden md:table-cell pinto-sm">
          <div className="gap-2 pl-2 flex items-center">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <img src={depositIcon} alt="deposit icon" />
            <span>{truncateHex(deposit.idHex)}</span>
          </div>
        </TableCell>
        <TableCell className="pinto-sm text-left px-4 md:px-0 md:text-right">
          <div className="flex flex-row gap-1 items-center justify-start md:justify-end">
            <IconImage src={token.logoURI} size={4} />
            <div className="opacity-70">
              <PrivateModeWrapper>
                {`${formatter.token(deposit.amount, token)}`}
              </PrivateModeWrapper>
            </div>
            <span className="opacity-70 hidden md:block">{token.name}</span>
          </div>
          <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340]">
            <PrivateModeWrapper>
              {`${denomination === "USD" ? formatter.usd((deposit.currentBdv || TokenValue.ZERO).mul(price)) : formatter.pdv(deposit.depositBdv)}`}
            </PrivateModeWrapper>
          </div>
        </TableCell>
        <TableCell className="pinto-sm text-right">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={stalkIcon} size={4} />
            {deposit.isGerminating ? (
              <>
                {deposit.stalk.base.gt(0) && (
                  <>
                    <div className="hidden md:block opacity-60">
                      <PrivateModeWrapper>
                        {formatter.twoDec(deposit.stalk.base)}
                      </PrivateModeWrapper>
                    </div>
                    <div className="md:hidden opacity-60">
                      <PrivateModeWrapper>
                        {deposit.stalk.base.gt(9999)
                          ? deposit.stalk.base.toHuman("ultraShort")
                          : formatter.twoDec(deposit.stalk.base)}
                      </PrivateModeWrapper>
                    </div>
                  </>
                )}
                {deposit.stalk.germinating.gt(0) && (
                  <>
                    <div className="hidden md:block opacity-60 text-pinto-off-green">
                      <PrivateModeWrapper>
                        {formatter.twoDec(deposit.stalk.germinating, {
                          showPositiveSign: deposit.stalk.base.gt(0),
                        })}
                      </PrivateModeWrapper>
                    </div>
                    <div className="md:hidden opacity-60 text-pinto-off-green">
                      <PrivateModeWrapper>
                        {deposit.stalk.germinating.gt(9999)
                          ? `${deposit.stalk.base.gt(0) ? "+" : ""}${deposit.stalk.germinating.toHuman("ultraShort")}`
                          : formatter.twoDec(deposit.stalk.germinating, {
                            showPositiveSign: deposit.stalk.base.gt(0),
                          })}
                      </PrivateModeWrapper>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="hidden md:block opacity-70">
                  <PrivateModeWrapper>
                    {formatter.twoDec(deposit.stalk.base)}
                  </PrivateModeWrapper>
                </div>
                <div className="md:hidden opacity-70">
                  <PrivateModeWrapper>
                    {deposit.stalk.base.gt(9999)
                      ? deposit.stalk.base.toHuman("ultraShort")
                      : formatter.twoDec(deposit.stalk.base)}
                  </PrivateModeWrapper>
                </div>
              </>
            )}
          </div>
          {deposit.isGerminating && deposit.stalk.grown.gt(0) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340] hidden md:block">Claimable Grown Stalk: -</div>
          )}
          {!deposit.isGerminating && deposit.stalk.grown.gt(0) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340] hidden md:block">
              Claimable Grown Stalk:{" "}
              <span className="text-pinto-green-4">
                <PrivateModeWrapper>
                  {formatter.twoDec(deposit.stalk.grown, {
                    showPositiveSign: true,
                  })}
                </PrivateModeWrapper>
              </span>
            </div>
          )}
        </TableCell>
        <TableCell className="pinto-sm text-right p-4">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={seedIcon} size={4} />
            <div className="hidden md:block opacity-70">
              <PrivateModeWrapper>
                {formatter.twoDec(deposit.seeds)}
              </PrivateModeWrapper>
            </div>
            <div className="md:hidden opacity-70">
              <PrivateModeWrapper>
                {deposit.seeds.gt(9999) ? deposit.seeds.toHuman("ultraShort") : formatter.twoDec(deposit.seeds)}
              </PrivateModeWrapper>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

export default function DepositsTable({ token, selected, useToggle, mode }: DepositsTableProps) {
  const farmerDeposits = useFarmerSiloNew().deposits;
  const isLoading = useFarmerSiloNew().isLoading;
  const tokenData = farmerDeposits.get(token);
  const priceData = usePriceData();
  const [selectedDeposit, setSelectedDeposit] = useState<DepositData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, token.address));
  const poolPrice = pool?.price ?? TokenValue.ZERO;

  const handleRowClick = (deposit: DepositData) => {
    setSelectedDeposit(deposit);
    setDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="relative max-h-[min(600px,50vh)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-pinto-gray-1 z-2">
            <TableRow className="hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-[15%] p-4 hidden md:table-cell">
                Deposit ID
              </TableHead>
              <TableHead className="text-black text-left md:text-right font-[400] text-[1rem] w-[33.333%] md:w-[32.5%] px-4 md:px-2">
                Amount Deposited
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[33.333%] md:w-[32.5%]">
                Stalk
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[33.333%] md:w-[20%] p-4">
                Seeds
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!tokenData || tokenData.deposits.length === 0 ? (
              <TableRow className="bg-white hover:bg-white">
                <TableCell colSpan={4}>
                  <div className="flex flex-row h-48 w-full items-center justify-center text-pinto-gray-4 font-[400] text-[1rem]">
                    {`Your Deposits will appear here`}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tokenData.deposits
                .sort((a, b) => {
                  return a.stem.sub(b.stem).toNumber();
                })
                .map((deposit) => {
                  const isDisabled = mode === "combine" && deposit.isGerminating;
                  if (useToggle) {
                    return (
                      <ToggleGroupItem
                        value={deposit.stem.toHuman()}
                        aria-label={`Select ${token.name}`}
                        key={`toggle_${deposit.stem.toHuman()}`}
                        asChild
                        disabled={isDisabled}
                        className={cn(
                          "w-full table h-auto p-4 data-[state=on]:bg-pinto-gray-1 hover:bg-pinto-gray-1 rounded-none border-none",
                          isDisabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <DepositRow
                          deposit={deposit}
                          price={token.isMain ? priceData.price : poolPrice}
                          token={token}
                          useToggle
                          isSelected={selected?.includes(deposit.stem.toHuman())}
                          isLoading={isLoading}
                          onRowClick={handleRowClick}
                        />
                      </ToggleGroupItem>
                    );
                  }
                  return (
                    <DepositRow
                      deposit={deposit}
                      price={token.isMain ? priceData.price : poolPrice}
                      token={token}
                      key={deposit.stem.toHuman()}
                      isLoading={isLoading}
                      onRowClick={handleRowClick}
                      className="table w-full"
                    />
                  );
                })
            )}
          </TableBody>
        </Table>
      </div>
      {selectedDeposit && (
        <DepositDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          deposit={selectedDeposit}
          token={token}
          price={token.isMain ? priceData.price : poolPrice}
        />
      )}
    </div>
  );
}
