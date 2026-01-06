"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`${sizeStyles[size]} ${className}`}>
      <svg className="animate-spin" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-[#0f0f0f]/80 flex items-center justify-center z-50 rounded-2xl">
      <LoadingSpinner size="lg" className="text-[#3b82f6]" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-[#3b82f6] mx-auto" />
        <p className="text-gray-500 mt-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#252525] rounded ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#151515]">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-5 py-3">
                <SkeletonBox className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-5 py-4">
                  <SkeletonBox className={`h-4 ${colIndex === 0 ? "w-32" : "w-20"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-10 w-10 rounded-xl" />
      </div>
      <SkeletonBox className="h-8 w-20 mb-2" />
      <SkeletonBox className="h-4 w-32" />
    </div>
  );
}
