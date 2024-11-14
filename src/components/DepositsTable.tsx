import depositIcon from "@/assets/protocol/Deposit.svg";
import { TokenValue } from "@/classes/TokenValue";
import { CheckmarkIcon } from "@/components/Icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ToggleGroupItem } from "@/components/ui/ToggleGroup";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { truncateHex } from "@/utils/format";
import { DepositData, Token } from "@/utils/types";
import { HTMLMotionProps } from "framer-motion";
import CheckmarkCircle from "./CheckmarkCircle";

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
  key?: string;
}

const DepositRow = ({ deposit, token, price, useToggle, isSelected, key }: DepositRowProps) => {
  return (
    <TableRow
      key={key}
      className={`h-[4.5rem] ${deposit.isGerminating ? "bg-pinto-off-green/15" : "bg-white"} text-[1rem] hover:bg-pinto-green-1/50 hover:cursor-pointer`}
    >
      <TableCell className="text-black font-[400]">
        <div className="gap-2 pl-2 flex items-center">
          {useToggle && <CheckmarkCircle isSelected={isSelected} />}
          <img src={depositIcon} alt="deposit icon" />
          {truncateHex(deposit.idHex)}
        </div>
      </TableCell>
      <TableCell className="text-right text-black">
        <div>{`${deposit.amount.toHuman("short")} ${token.name}`}</div>
        <div className="text-pinto-gray-4">{`$${(deposit.depositBdv || TokenValue.ZERO).mul(price).toHuman("short")}`}</div>
      </TableCell>
      <TableCell className="text-right text-black">
        <div>{deposit.stalk.base.toHuman("short")}</div>
        {deposit.stalk.grown.gt(0) && (
          <div className="text-pinto-gray-4">
            Claimable Grown Stalk: <span className="text-pinto-green-2">+{deposit.stalk.grown.toHuman("short")}</span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-right text-black p-4">{deposit.seeds.toHuman("short")}</TableCell>
    </TableRow>
  );
};

export default function DepositsTable({ token, selected, useToggle }: DepositsTable) {
  const farmerDeposits = useFarmerDepositedBalances().data;
  const tokenData = farmerDeposits.get(token);
  const priceData = usePriceData();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
          <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposit ID</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Amount Deposited</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Stalk</TableHead>
          <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">Seeds</TableHead>
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
          tokenData.deposits.map((deposit) => {
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
            return <DepositRow deposit={deposit} price={priceData.price} token={token} key={deposit.stem.toHuman()} />;
          })
        )}
      </TableBody>
    </Table>
  );
}
