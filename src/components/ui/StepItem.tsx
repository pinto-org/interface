interface StepItemProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function StepItem({ stepNumber, title, description }: StepItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
        {stepNumber}
      </div>
      <div>
        <div className="pinto-body text-pinto-dark mb-1">{title}</div>
        <div className="pinto-sm text-pinto-light">{description}</div>
      </div>
    </div>
  );
}
