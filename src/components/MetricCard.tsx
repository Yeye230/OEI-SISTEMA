
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  tint: string;
  trend?: string;
  trendType?: "up" | "down";
  description: string;
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  tint,
  trend,
  trendType,
  description,
}: Props) {
  const hasValue = value.trim() !== "" && value !== "—";

  return (
    <article
      className="group relative flex h-full min-h-[158px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
      style={{
        background: `linear-gradient(135deg, #ffffff 62%, ${tint} 100%)`,
      }}
    >
      {/* Acento decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full opacity-60"
        style={{ backgroundColor: tint }}
      />

      <div className="relative flex min-w-0 items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12"
          style={{
            backgroundColor: iconBg,
            color: iconColor,
          }}
        >
          <Icon size={23} strokeWidth={1.9} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[12px] font-medium leading-5 text-slate-500 sm:text-[13px]">
            {title}
          </p>

          <p
            className={`mt-1 break-words text-3xl font-bold leading-tight tracking-tight sm:text-[32px] ${
              hasValue ? "text-[#102b49]" : "text-slate-400"
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-slate-100 pt-3">
        {trend && trendType === "up" && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight size={13} aria-hidden="true" />
            {trend}
          </span>
        )}

        {trend && trendType === "down" && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-rose-50 px-1.5 py-1 text-[11px] font-semibold text-rose-700">
            <ArrowDownRight size={13} aria-hidden="true" />
            {trend}
          </span>
        )}

        {!trend && (
          <Minus
            size={13}
            className="shrink-0 text-slate-400"
            aria-hidden="true"
          />
        )}

        <span className="min-w-0 text-[11px] leading-4 text-slate-500">
          {description}
        </span>
      </div>
    </article>
  );
}
