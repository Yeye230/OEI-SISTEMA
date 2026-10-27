import { PropsWithChildren } from "react";
import { CornerFiligree } from '../corner-filigree';
import { cn } from '@/core/utils/function';

export const CardWrapper = ({
  children,
  withCornerFiligree = true,
  withBackground = true,
  className = ""
}: PropsWithChildren & {
  withCornerFiligree?: boolean;
  withBackground?: boolean;
  className?: string;
}): React.JSX.Element => {
  return (
    <div
      className={cn(
        "relative rounded-[14px] border border-border p-8 lg:p-10 shadow-card",
        withBackground ? "bg-surface" : "bg-transparent",
        className
      )}
      style={{ backdropFilter: "blur(16px)" }}
    >
      {/* corner filigree */}
      {withCornerFiligree && <CornerFiligree />}
      {children}
    </div>
  );
};
