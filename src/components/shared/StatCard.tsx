import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label?: string };
  iconColor?: "primary" | "success" | "warning" | "info" | "destructive";
  className?: string;
}

const colorMap = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  destructive: "bg-destructive-soft text-destructive",
};

export function StatCard({ label, value, icon: Icon, trend, iconColor = "primary", className }: StatCardProps) {
  const formatted = typeof value === "number" ? value.toLocaleString() : value;
  const positive = trend && trend.value >= 0;

  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{formatted}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110", colorMap[iconColor])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
              positive ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"
            )}
          >
            {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">{trend.label || "vs last week"}</span>
        </div>
      )}
    </div>
  );
}
