import depositIcon from "@/assets/protocol/Deposit.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { useDenomination } from "@/hooks/useAppSettings";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { formatter, truncateHex } from "@/utils/format";
import { DepositData, Token } from "@/utils/types";
import { HTMLMotionProps } from "framer-motion";
import React from "react";
import CheckmarkCircle from "./CheckmarkCircle";
import IconImage from "./ui/IconImage";
import Text from "./ui/Text";

interface DepositsTable {
  token: Token;
  selected?: string[];
  useToggle?: boolean;
}

interface DepositRowProps extends HTMLMotionProps<"tr"> {
  deposit: DepositData;
  token: Token;
  price: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean;
}

const DepositRow = React.forwardRef<HTMLTableRowElement, DepositRowProps & React.HTMLAttributes<HTMLTableRowElement>>(
  ({ deposit, token, price, useToggle, isSelected, ...props }, ref) => {
    const denomination = useDenomination();
    return (
      <TableRow
        {...props}
        ref={ref}
        className={`h-[4.5rem] ${deposit.isGerminating ? "bg-pinto-off-green/15" : "bg-white"} text-[1rem] pointer-events-none`}
      >
        <Text as={TableCell}>
          <div className="gap-2 pl-2 flex items-center">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <img src={depositIcon} alt="deposit icon" />
            <span>{truncateHex(deposit.idHex)}</span>
          </div>
        </Text>
        <Text as={TableCell} className="text-right">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={token.logoURI} size={4} />
            <div className="opacity-70">{`${formatter.token(deposit.amount, token)} ${token.name}`}</div>
          </div>
          <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340]">{`${denomination === "USD" ? formatter.usd((deposit.depositBdv || TokenValue.ZERO).mul(price)) : formatter.pdv(deposit.depositBdv)}`}</div>
        </Text>
        <Text as={TableCell} className="text-right">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={stalkIcon} size={4} />
            {deposit.isGerminating ? (
              <div className="opacity-60 text-pinto-off-green">{formatter.twoDec(deposit.stalk.germinating)}</div>
            ) : (
              <div className="opacity-70">{formatter.twoDec(deposit.stalk.base)}</div>
            )}
          </div>
          {deposit.isGerminating && deposit.stalk.grown.gt(0.0001) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340]">Claimable Grown Stalk: -</div>
          )}
          {deposit.stalk.grown.gt(0.0001) && (
            <div className="text-pinto-gray-4 mt-1 opacity-70 font-[340]">
              Claimable Grown Stalk:{" "}
              <span className="text-pinto-green-4">
                {formatter.twoDec(deposit.stalk.grown, { showPositiveSign: true })}
              </span>
            </div>
          )}
        </Text>
        <Text as={TableCell} className="text-right p-4">
          <div className="flex flex-row gap-1 items-center justify-end">
            <IconImage src={seedIcon} size={4} />
            <div className="opacity-70">{formatter.twoDec(deposit.seeds)}</div>
          </div>
        </Text>
      </TableRow>
    );
  },
);

export default function DepositsTable({ token, selected, useToggle }: DepositsTable) {
  const farmerDeposits = useFarmerSiloNew().deposits;
  const tokenData = farmerDeposits.get(token);
  const priceData = usePriceData();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
          <TableHead className="text-black font-[400] text-[1rem] w-[15%] p-4">Deposit ID</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-[27.5%]">Amount Deposited</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-[37.5%]">Stalk</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%] p-4">Seeds</TableHead>
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
              // Sort by `stem` in descending order
              return a.stem.sub(b.stem).toNumber(); // Descending order
            })
            .map((deposit) => {
              if (useToggle) {
                return (
                  <ToggleGroupItem
                    value={deposit.stem.toHuman()}
                    aria-label={`Select ${token.name}`}
                    key={`toggle_${deposit.stem.toHuman()}`}
                    asChild
                  >
                    <DepositRow
                      deposit={deposit}
                      price={priceData.price}
                      token={token}
                      useToggle
                      isSelected={selected?.includes(deposit.stem.toHuman())}
                    />
                  </ToggleGroupItem>
                );
              }
              return (
                <DepositRow deposit={deposit} price={priceData.price} token={token} key={deposit.stem.toHuman()} />
              );
            })
        )}
      </TableBody>
    </Table>
  );
}
