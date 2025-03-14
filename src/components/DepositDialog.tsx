import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import pintoTokenVanilla from "@/assets/tokens/PINTO_VANILLA.png";
import { TokenValue } from "@/classes/TokenValue";
import TooltipSimple from "@/components/TooltipSimple";
import { Card } from "@/components/ui/Card";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Separator } from "@/components/ui/Separator";
import { useDenomination } from "@/hooks/useAppSettings";
import { formatter, truncateHex } from "@/utils/format";
import { DepositData, Token } from "@/utils/types";
import { useAccount } from "wagmi";
import IconImage from "./ui/IconImage";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deposit: DepositData;
  token: Token;
  price: TokenValue;
}

export default function DepositDialog({ open, onOpenChange, deposit, token, price }: Readonly<DepositDialogProps>) {
  const denomination = useDenomination();
  const { address } = useAccount();

  const depositIdHex = truncateHex(deposit.idHex);
  const depositBdv = formatter.twoDec(deposit.depositBdv);
  const currentBdv = formatter.twoDec(deposit.currentBdv);
  const stalkBase = formatter.twoDec(deposit.stalk.base);
  const grownStalk = deposit.isGerminating ? 0 : formatter.twoDec(deposit.stalk.total.sub(deposit.depositBdv));
  const claimableGrownStalk = deposit.isGerminating || deposit.stalk.grown.isZero ? "text-pinto-gray-4" : "text-pinto-green";
  const formattedGrownStalk = deposit.isGerminating ? 0 : formatter.twoDec(deposit.stalk.grown, { showPositiveSign: true });

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialog.Content className="w-full sm:w-[calc(100%-2rem)] max-w-[65rem] sm:p-0 mx-auto">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="flex flex-col p-6 sm:min-w-[33rem] h-full justify-between max-[530px]:min-w-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between h-full">
                <Card className="relative w-full h-full hidden sm:block rounded-lg text-body text-pinto-off-white bg-pinto-gradient-green">
                  <img
                    src={pintoTokenVanilla}
                    alt="Pinto Token"
                    className="absolute inset-0 m-auto object-contain w-1/4 h-1/4"
                  />
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center">
                      <span>{`Deposit ${depositIdHex}`}</span>
                    </div>
                    <div className="ml-auto">
                      <span>{token.name}</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-row justify-between mt-4 gap-4">
                <div className="flex flex-col justify-between min-h-6">
                  <span className="text-pinto-gray-5">Stalk grown since deposit</span>
                  <span className="text-primary text-h3">
                    {formatter.twoDec(deposit.stalk.grownSinceDeposit, { showPositiveSign: true })}
                  </span>
                </div>
                <div className="flex flex-col justify-between min-h-6 text-right">
                  <span className="text-pinto-gray-5">Grown Stalk per PDV</span>
                  <span className="text-primary text-h3">
                    {formatter.xDec(deposit.stalk.grownSinceDeposit.div(deposit.depositBdv), 3)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-auto" />
          <Separator orientation="horizontal" className="block lg:hidden w-auto" />

          <div className="flex flex-col gap-3 flex-1 p-6 h-full">
            <div className="hidden sm:block">
              <ResponsiveDialog.Header>
                <div className="pinto-body">Silo Deposit</div>
              </ResponsiveDialog.Header>
            </div>
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4">Deposit Owner</span>
                  <span className="text-primary">{`${truncateHex(address ?? '0x0')}`} <span className="text-pinto-gray-4">{`${'(me)'}`}</span>
                  </span>
                </div>
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4 flex flex-row gap-1 items-center"> Stem
                    <TooltipSimple variant="outlined" showOnMobile content={"Stem is the internal accounting unit used to credit deposits with Grown Stalk."} /></span>
                  <span className="text-primary">{formatter.twoDec(deposit.stem)}</span>
                </div>
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4">Amount</span>
                  <span className="text-primary flex flex-row gap-1 items-center"><IconImage src={token.logoURI} alt={token.name} size={4} />{formatter.token(deposit.amount, token)}</span>
                </div>
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4 flex flex-row gap-1 items-center"> Recorded PDV
                    <TooltipSimple
                      variant="outlined"
                      showOnMobile
                      content={
                        <div className="pinto-sm">
                          PDV is Pinto Denominated Value or the value of your Deposit <br /> denominated in the price of Pinto.
                          Base Stalk and Seed are credited <br /> to your Deposit based on the PDV of your deposit.
                          Any time you interact <br /> with a Deposit, your Deposit will automatically update to the current PDV <br /> if it's higher than the PDV of your last interaction, or your recorded PDV. <br />
                          This means you'll have a greater amount of Base Stalk and Seed.
                        </div>
                      }
                    />
                  </span>
                  <span className="text-primary">{`${depositBdv} PDV`}</span>
                </div>
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4 flex flex-row gap-1 items-center"> Current PDV
                    <TooltipSimple
                      variant="outlined"
                      showOnMobile
                      content={
                        <div className="pinto-sm">
                          PDV is Pinto Denominated Value or the value of your Deposit <br /> denominated in the price of Pinto.
                          Base Stalk and Seed are credited <br /> to your Deposit based on the PDV of your deposit.
                          Any time you interact <br /> with a Deposit, your Deposit will automatically update to the current PDV <br /> if it's higher than the PDV of your last interaction, or your recorded PDV. <br />
                          This means you'll have a greater amount of Base Stalk and Seed.
                        </div>}
                    />
                  </span>
                  <span className="text-primary">{`${currentBdv} PDV`}</span>
                </div>
                <div className="flex justify-between min-h-6 items-center">
                  <span className="text-pinto-gray-4">Current Value</span>
                  <span className="text-primary">
                    {`${denomination === "USD"
                      ? formatter.usd((deposit.currentBdv || TokenValue.ZERO).mul(price))
                      : formatter.pdv(deposit.depositBdv)
                      }`}
                  </span>
                </div>
                <div className="flex justify-between min-h-12 items-start">
                  <span className="text-pinto-gray-4 pt-1">Stalk</span>
                  <div className="flex flex-col justify-end items-end">
                    <span className="flex flex-row gap-1 items-center justify-end text-primary">
                      <IconImage src={stalkIcon} size={4} />
                      {stalkBase}
                    </span>
                    <div className="flex flex-col text-right">
                      <span className="text-pinto-gray-4">Base Stalk:{" "}<span className="text-pinto-gray-4">{depositBdv}</span></span>
                      <span className="text-pinto-gray-4">Grown Stalk:{" "}<span className="text-pinto-gray-4">{grownStalk}</span></span>
                      <span className="text-pinto-gray-4">
                        Claimable Grown Stalk:{" "}
                        <span className={claimableGrownStalk}>
                          {formattedGrownStalk}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between min-h-8 items-center">
                  <span className="text-pinto-gray-4">Seed</span>
                  <span className="flex flex-row gap-1 items-center text-primary">
                    <IconImage src={seedIcon} size={4} />
                    {formatter.twoDec(deposit.seeds)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}