import { Col, Row } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";

interface IConvertUpOrderForm {
  onOpenChange: (open: boolean) => void;
}

export default function ConvertUpOrderForm({ onOpenChange }: IConvertUpOrderForm) {
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    onOpenChange(false);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    onOpenChange(false);
  };

  const isLoading = false;

  return (
    <Col className="w-full gap-6">
      <FormTitle />
      <div className="form-contents">asdf</div>
      <Row className="gap-6 w-full flex-1">
        <Button
          variant="outline"
          size="xlargest"
          rounded="full"
          className="w-full flex-1 text-pinto-light bg-pinto-gray-1"
          onClick={handleBack}
          type="button"
        >
          ← Back
        </Button>
        <Button
          size="xlargest"
          rounded="full"
          className={`w-full flex-1 ${isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
          // disabled={nextDisabled}
          onClick={handleNext}
          type="button"
        >
          Next
        </Button>
      </Row>
    </Col>
  );
}

const FormTitle = () => (
  <div className="flex flex-col gap-2">
    <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Automated Convert Parameters</div>
    <Separator className="h-[1px] w-full bg-pinto-gray-2" />
  </div>
);
