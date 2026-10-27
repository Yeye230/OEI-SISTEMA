// * [DONE] Approved.

import * as Icons from "lucide-react";
import { memo } from "react";

interface LucideIconRendererProps {
  iconName: string;
  className?: string | undefined;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const LucideIconRender = memo((({
  iconName,
  ...props
}: LucideIconRendererProps): React.JSX.Element => {
  const IconComponent = (Icons[iconName as keyof typeof Icons] ||
    Icons.HelpCircle) as React.ComponentType<any>;

  return <IconComponent {...props} />;
}) as React.FC<LucideIconRendererProps>);

LucideIconRender.displayName = "LucideIconRender";

/* eslint-enable @typescript-eslint/no-explicit-any */
