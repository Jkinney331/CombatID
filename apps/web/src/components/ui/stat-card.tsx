"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBg = "bg-[#3b82f6]/20",
  className = "",
}: StatCardProps) {
  return (
    <div className={`bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && (
          <span className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {(trend || subtitle) && (
        <p className="text-sm mt-2 flex items-center gap-1">
          {trend && (
            <span className={trend.positive ? "text-[#22c55e]" : "text-[#ef4444]"}>
              {trend.positive ? "+" : ""}{trend.value}
            </span>
          )}
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
        </p>
      )}
    </div>
  );
}

// Quick stat with icon
interface QuickStatProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  iconGradient?: string;
  valueColor?: string;
}

export function QuickStat({
  value,
  label,
  icon,
  iconGradient = "from-[#3b82f6] to-[#2563eb]",
  valueColor = "text-white",
}: QuickStatProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className={`text-3xl font-black ${valueColor}`}>{value}</p>
          <p className="text-gray-500 text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}
