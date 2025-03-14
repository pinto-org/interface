import depositIcon from "@/assets/protocol/Deposit.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { HTMLMotionProps } from "framer-motion";
import { ToggleGroupItem } from "@/components/ui/ToggleGroup";
import DepositDialog from "@/components/DepositDialog";
import { useDenomination } from "@/hooks/useAppSettings";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { formatter, truncateHex } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { cn } from "@/utils/utils";
import React, { useState } from "react";
import CheckmarkCircle from "./CheckmarkCircle";
import IconImage from "./ui/IconImage";

interface DepositsTableProps {
  token: Token;
  selected?: string[];
  useToggle?: boolean;
  mode?: "send" | "combine";
  disabledDeposits?: string[];
  groups?: { id: number; deposits: string[] }[];
}

interface DepositRowProps {
  deposit: DepositData;
  token: Token;
  price: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  groupId?: number;
  groups?: { id: number; deposits: string[] }[];
  farmerDeposits?: TokenDepositData;
  isLoading: boolean;
  onRowClick: (deposit: DepositData) => void;
}

type TableRowProps = HTMLMotionProps<"tr"> &
  React.HTMLAttributes<HTMLTableRowElement> & { noHoverMute?: boolean };

const DepositRow = React.forwardRef<
  HTMLTableRowElement,
  DepositRowProps & TableRowProps
>(
  (
    {
      deposit,
      token,
      price,
      useToggle,
      isSelected,
      disabled,
      groupId,
      groups,
      farmerDeposits,
      isLoading,
      onRowClick,
      ...props
    },
    ref
  ) => {
    const denomination = useDenomination();

    const getGroupCombinedRatio = (groupId: number) => {
      const group = groups?.find((g) => g.id === groupId);
      if (!group) return null;

      const groupDeposits = group.deposits
        .map((stem) =>
          farmerDeposits?.deposits.find((d) => d.stem.toHuman() === stem)
        )
        .filter((d): d is DepositData => d !== undefined);

      const totalStalk = groupDeposits.reduce(
        (sum, d) => sum.add(d.stalk.total),
        TokenValue.ZERO
      );
      const totalBdv = groupDeposits.reduce(
        (sum, d) => sum.add(d.depositBdv),
        TokenValue.ZERO
      );

      return totalBdv.gt(0) ? totalStalk.div(totalBdv) : TokenValue.ZERO;
    };

    return (
      <TableRow
        {...props}
        ref={ref}
        className={cn(
          "h-[4.5rem] transition-all",
          deposit.isGerminating
            ? "bg-pinto-off-green/15"
            : deposit.isPlantDeposit
              ? "bg-pinto-green-4/15"
              : "bg-white",
          "text-[1rem]",
          !useToggle
            ? "pointer-events-none"
            : "hover:cursor-pointer hover:bg-pinto-green-1/50",
          disabled &&
            "bg-pinto-gray-2/30 hover:bg-pinto-gray-2/30 opacity-60 cursor-not-allowed"
        )}
        onClick={!disabled ? () => onRowClick(deposit) : undefined}
      >
        <TableCell className="hidden md:table-cell pinto-sm">
          <div className="gap-2 pl-2 flex items-center">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <img src={depositIcon} alt="deposit icon" />
            <span>{truncateHex(deposit.idHex)}</span>
            {groupId && (
              <span className="ml-2 text-xs px-2 py-0.5 text-pinto-green-4 whitespace-nowrap">
                Group {groupId}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="pinto-sm text-left px-4 md:px-0 md:text-right">
          <div className="flex flex-row gap-1 items-center justify-start md:justify-end">
            <IconImage src={token.logoURI} size={4} />
            <div className="opacity-70">{`${formatter.token(deposit.amount, token)}`}</div>
            <span className="opacity-70 hidden md:block">{token.name}</span>
          </div>
          <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340]">{`${denomination === "USD" ? formatter.usd((deposit.currentBdv || TokenValue.ZERO).mul(price)) : formatter.pdv(deposit.depositBdv)}`}</div>
        </TableCell>
        <TableCell className="pinto-sm text-right">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={stalkIcon} size={4} />
            {deposit.isGerminating ? (
              <>
                {deposit.stalk.base.gt(0) && (
                  <>
                    <div className="hidden md:block opacity-60">
                      {formatter.twoDec(deposit.stalk.base)}
                    </div>
                    <div className="md:hidden opacity-60">
                      {deposit.stalk.base.gt(9999)
                        ? deposit.stalk.base.toHuman("ultraShort")
                        : formatter.twoDec(deposit.stalk.base)}
                    </div>
                  </>
                )}
                {deposit.stalk.germinating.gt(0) && (
                  <>
                    <div className="hidden md:block opacity-60 text-pinto-off-green">
                      {formatter.twoDec(deposit.stalk.germinating, {
                        showPositiveSign: deposit.stalk.base.gt(0),
                      })}
                    </div>
                    <div className="md:hidden opacity-60 text-pinto-off-green">
                      {deposit.stalk.germinating.gt(9999)
                        ? `${deposit.stalk.base.gt(0) ? "+" : ""}${deposit.stalk.germinating.toHuman("ultraShort")}`
                        : formatter.twoDec(deposit.stalk.germinating, {
                            showPositiveSign: deposit.stalk.base.gt(0),
                          })}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="hidden md:block opacity-70">
                  {formatter.twoDec(deposit.stalk.base)}
                </div>
                <div className="md:hidden opacity-70">
                  {deposit.stalk.base.gt(9999)
                    ? deposit.stalk.base.toHuman("ultraShort")
                    : formatter.twoDec(deposit.stalk.base)}
                </div>
              </>
            )}
          </div>
          {deposit.isGerminating && deposit.stalk.grown.gt(0) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340] hidden md:block">
              Claimable Grown Stalk: -
            </div>
          )}
          {!deposit.isGerminating && deposit.stalk.grown.gt(0) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340] hidden md:block">
              Claimable Grown Stalk:{" "}
              <span className="text-pinto-green-4">
                {formatter.twoDec(deposit.stalk.grown, {
                  showPositiveSign: true,
                })}
              </span>
            </div>
          )}
        </TableCell>
        <TableCell className="pinto-sm text-right">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={stalkIcon} size={4} />
            <div className="opacity-70">
              {deposit.depositBdv.gt(0) ? (
                <>
                  {formatter.xDec(
                    deposit.stalk.total.div(deposit.depositBdv),
                    3
                  )}
                  {groupId && (
                    <>
                      {" → "}
                      {formatter.xDec(getGroupCombinedRatio(groupId), 3)}
                    </>
                  )}
                </>
              ) : (
                "0"
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="pinto-sm text-right p-4">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={seedIcon} size={4} />
            <div className="hidden md:block opacity-70">
              {formatter.twoDec(deposit.seeds)}
            </div>
            <div className="md:hidden opacity-70">
              {deposit.seeds.gt(9999)
                ? deposit.seeds.toHuman("ultraShort")
                : formatter.twoDec(deposit.seeds)}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

export default function DepositsTable({
  token,
  selected = [],
  useToggle,
  mode,
  disabledDeposits,
  groups,
}: DepositsTableProps) {
  const farmerDeposits = useFarmerSiloNew().deposits;
  const isLoading = useFarmerSiloNew().isLoading;
  const tokenData = farmerDeposits.get(token);
  const priceData = usePriceData();
  const [selectedDeposit, setSelectedDeposit] = useState<DepositData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const pool = priceData.pools.find((poolData) =>
    stringEq(poolData.pool.address, token.address)
  );
  const poolPrice = pool?.price ?? TokenValue.ZERO;

  const isDepositInOtherGroup = (stem: string) => {
    return disabledDeposits?.includes(stem) || false;
  };

  const getGroupId = (stem: string) => {
    if (!groups) return undefined;
    const group = groups.find((g) => g.deposits.includes(stem));
    return group?.id;
  };

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
              <TableHead className="text-black text-left md:text-right font-[400] text-[1rem] w-[33.333%] md:w-[25%] px-4 md:px-2">
                Amount Deposited
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[33.333%] md:w-[25%]">
                Stalk
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[33.333%] md:w-[15%]">
                Grown Stalk/PDV
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
                  const stem = deposit.stem.toHuman();
                  const isDepositDisabled = isDepositInOtherGroup(stem);
                  const isGerminating =
                    mode === "combine" && deposit.isGerminating;

                  if (useToggle) {
                    return (
                      <ToggleGroupItem
                        value={stem}
                        aria-label={`Select ${token.name}`}
                        key={stem}
                        asChild
                        disabled={isDepositDisabled || isGerminating}
                      >
                        <DepositRow
                          deposit={deposit}
                          price={token.isMain ? priceData.price : poolPrice}
                          token={token}
                          useToggle
                          isSelected={selected.includes(stem) ?? false}
                          disabled={isDepositDisabled || isGerminating}
                          groupId={getGroupId(stem)}
                          groups={groups}
                          farmerDeposits={tokenData}
                          isLoading={isLoading}
                          onRowClick={handleRowClick}
                        />
                      </ToggleGroupItem>
                    );
                  }

                  return (
                    <DepositRow
                      key={stem}
                      deposit={deposit}
                      price={token.isMain ? priceData.price : poolPrice}
                      token={token}
                      groups={groups}
                      farmerDeposits={tokenData}
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
