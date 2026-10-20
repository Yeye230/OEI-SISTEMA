import { Button } from "@heroui/react";
import { Sparkles } from "lucide-react";
import { btnPrimaryClassName } from "@/utils/const";

interface SubmitButtonProps {
  buttonName: string;
  type: "button" | "submit" | "reset";
  isDisabled?: boolean;
}

const SubmitButton = ({
  buttonName,
  type,
  isDisabled = false
}: SubmitButtonProps): React.JSX.Element => (
  <Button type={type} className={btnPrimaryClassName} isDisabled={isDisabled}>
    <span className="relative z-10 flex items-center justify-center gap-3 text-sm">
      <Sparkles className="h-4 w-4" />
      {buttonName}
      <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-8 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  </Button>
);

export default SubmitButton;
