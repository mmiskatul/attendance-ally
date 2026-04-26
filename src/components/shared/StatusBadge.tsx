import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending" | "present" | "absent" | "late" | "online" | "offline" | "healthy" | "degraded" | "down" | "normal" | "backlogged" | "stalled" | "closed";

const styleMap: Record<string, string> = {
  active: "bg-success-soft text-success",
  present: "bg-success-soft text-success",
  online: "bg-success-soft text-success",
  healthy: "bg-success-soft text-success",
  normal: "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  late: "bg-warning-soft text-warning",
  degraded: "bg-warning-soft text-warning",
  backlogged: "bg-warning-soft text-warning",
  inactive: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
  absent: "bg-destructive-soft text-destructive",
  offline: "bg-destructive-soft text-destructive",
  down: "bg-destructive-soft text-destructive",
  stalled: "bg-destructive-soft text-destructive",
};

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styleMap[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}
