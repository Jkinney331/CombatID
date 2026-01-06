"use client";

import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  default: { bg: "bg-[#3a3a3a]", text: "text-gray-400", dot: "bg-gray-400" },
  success: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]", dot: "bg-[#22c55e]" },
  warning: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]", dot: "bg-[#f59e0b]" },
  danger: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]", dot: "bg-[#ef4444]" },
  info: { bg: "bg-[#3b82f6]/20", text: "text-[#3b82f6]", dot: "bg-[#3b82f6]" },
  purple: { bg: "bg-[#8b5cf6]/20", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]" },
};

export function Badge({ children, variant = "default", dot = false, className = "" }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
}

// Status badge with predefined mappings
type StatusType = "draft" | "pending" | "submitted" | "approved" | "rejected" | "completed" | "cancelled" | "active" | "inactive" | "expired" | "suspended" | "eligible" | "ineligible";

const statusVariantMap: Record<StatusType, BadgeVariant> = {
  draft: "default",
  pending: "warning",
  submitted: "info",
  approved: "success",
  rejected: "danger",
  completed: "success",
  cancelled: "default",
  active: "success",
  inactive: "default",
  expired: "danger",
  suspended: "danger",
  eligible: "success",
  ineligible: "danger",
};

const statusLabels: Record<StatusType, string> = {
  draft: "Draft",
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  suspended: "Suspended",
  eligible: "Eligible",
  ineligible: "Ineligible",
};

export function StatusBadge({ status, className = "" }: { status: StatusType; className?: string }) {
  const variant = statusVariantMap[status] || "default";
  const label = statusLabels[status] || status;

  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
}
