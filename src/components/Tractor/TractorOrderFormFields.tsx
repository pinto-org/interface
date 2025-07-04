import arrowDown from "@/assets/misc/ChevronDown.svg";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { TractorOrderFormFieldsProps } from "@/lib/Tractor/tractorOrderTypes";
import { inputIds, tractorOrderStyles } from "@/lib/Tractor/tractorOrderUtils";
import { formatter } from "@/utils/format";

export default function TractorOrderFormFields({
  formState,
  handlers,
  validation,
  calculations,
  currentTemperature,
  podLine,
  temperatureInputRef,
  disabled = false,
}: TractorOrderFormFieldsProps) {
  return (
    <Col className="gap-6 pinto-sm-light text-pinto-light">
      {/* I want to Sow up to */}
      <div className="flex flex-col gap-2">
        <label htmlFor={inputIds.totalAmount}>I want to Sow up to</label>
        <div className="flex rounded-lg overflow-hidden border border-pinto-gray-2 group focus-within:border-[#2F8957]">
          <div className="flex-1">
            <Input
              id={inputIds.totalAmount}
              className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.00"
              value={formState.totalAmount}
              onChange={handlers.handleSetTotalAmount}
              type="text"
              disabled={disabled}
            />
          </div>
          <div className="flex items-center gap-2 px-4 bg-white">
            <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
            <span className="text-black">PINTO</span>
          </div>
        </div>
      </div>

      {/* Min and Max per Season - combined in a single row */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {/* Min per Season */}
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor={inputIds.minPerSeason}>Min per Season</label>
            <div
              className={`flex rounded-lg overflow-hidden border ${
                formState.error ? "border-red-500" : "border-pinto-gray-2"
              } group focus-within:${formState.error ? "border-red-500" : "border-[#2F8957]"}`}
            >
              <div className="flex-1">
                <Input
                  id={inputIds.minPerSeason}
                  className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.00"
                  value={formState.minSoil}
                  onChange={handlers.handleSetMinSoil}
                  type="text"
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center gap-2 px-4 bg-white">
                <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                <span className="text-black">PINTO</span>
              </div>
            </div>
          </div>

          {/* Max per Season */}
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor={inputIds.maxPerSeason}>Max per Season</label>
            <div
              className={`flex rounded-lg overflow-hidden border ${
                formState.error ? "border-red-500" : "border-pinto-gray-2"
              } group focus-within:${formState.error ? "border-red-500" : "border-[#2F8957]"}`}
            >
              <div className="flex-1">
                <Input
                  id={inputIds.maxPerSeason}
                  className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.00"
                  value={formState.maxPerSeason}
                  onChange={handlers.handleSetMaxPerSeason}
                  type="text"
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center gap-2 px-4 bg-white">
                <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                <span className="text-black">PINTO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund order using */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>Fund order using</div>
          <Button
            variant="outline-gray-shadow"
            size="xl"
            rounded="full"
            onClick={() => handlers.setShowTokenSelectionDialog(true)}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              {formState.selectedTokenStrategy.type === "SPECIFIC_TOKEN" && (
                <IconImage
                  src={""} // This would need to be passed from parent component with token data
                  alt="token"
                  size={6}
                  className="rounded-full"
                />
              )}
              <div className="pinto-body-light">{calculations.getSelectedTokenDisplay()}</div>
              <IconImage src={arrowDown} size={3} alt="open token select dialog" />
            </div>
          </Button>
        </div>
      </div>

      {/* Execute when Temperature is at least */}
      <div className="flex flex-row items-center justify-between gap-4">
        <label htmlFor={inputIds.temperature}>Execute when Temperature is at least</label>
        <Input
          id={inputIds.temperature}
          className="h-12 px-3 py-1.5 border border-pinto-gray-2 rounded-lg w-[140px]"
          placeholder={`${Math.max(10, Math.floor(currentTemperature.toNumber() || 0) + 1)}%`}
          value={formState.displayTemperature}
          onChange={handlers.handleTemperatureChange}
          onBlur={handlers.handleTemperatureBlur}
          onFocus={handlers.handleTemperatureFocus}
          onKeyDown={handlers.handleTemperatureKeyDown}
          ref={temperatureInputRef}
          type="text"
          disabled={disabled}
        />
      </div>

      {/* Execute when the length of the Pod Line is at most */}
      <div className="flex flex-col gap-2">
        <label htmlFor={inputIds.podLineLength}>Execute when the length of the Pod Line is at most</label>
        <Input
          id={inputIds.podLineLength}
          className="h-12 px-3 py-1.5 border border-pinto-gray-2 rounded-lg"
          placeholder={formatter.number(podLine)}
          value={formState.podLineLength}
          onChange={handlers.handlePodLineLengthChange}
          disabled={disabled}
        />

        <div className="flex justify-between gap-2 mt-1 w-full">
          {[5, 10, 25, 50, 100].map((increment) => (
            <Button
              key={increment}
              variant="outline"
              size="sm"
              className={`${tractorOrderStyles.inputs} ${
                calculations.isButtonActive(increment)
                  ? tractorOrderStyles.activeButton
                  : tractorOrderStyles.inactiveButton
              }`}
              onClick={() => handlers.handlePodLineSelect(increment, podLine)}
              disabled={disabled}
            >
              {increment}% ↑
            </Button>
          ))}
        </div>
      </div>

      {/* Execute during the Morning Auction */}
      <div className="flex flex-col gap-2">
        <label htmlFor={inputIds.morningAuction}>Execute during the Morning Auction</label>
        <div className="flex justify-between gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className={`${tractorOrderStyles.inputs} ${
              formState.morningAuction ? tractorOrderStyles.activeButton : tractorOrderStyles.inactiveButton
            }`}
            onClick={() => handlers.setMorningAuction(true)}
            disabled={disabled}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${tractorOrderStyles.inputs} ${
              !formState.morningAuction ? tractorOrderStyles.activeButton : tractorOrderStyles.inactiveButton
            }`}
            onClick={() => handlers.setMorningAuction(false)}
            disabled={disabled}
          >
            No
          </Button>
        </div>
      </div>
    </Col>
  );
}
