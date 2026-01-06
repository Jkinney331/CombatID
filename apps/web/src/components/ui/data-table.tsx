"use client";

import { ReactNode } from "react";
import { TableSkeleton } from "./loading";
import { NoResultsState } from "./empty-state";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (item: T) => void;
  rowKey: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyState,
  onRowClick,
  rowKey,
  className = "",
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return <>{emptyState || <NoResultsState />}</>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-[#151515]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {data.map((item) => (
            <tr
              key={rowKey(item)}
              className={`hover:bg-[#252525] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={column.key} className={`px-5 py-4 ${column.className || ""}`}>
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Pagination component for tables
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  );

  return (
    <div className={`flex items-center justify-between px-5 py-4 border-t border-[#2a2a2a] ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <span key={page} className="flex items-center">
              {showEllipsis && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-[#3b82f6] text-white"
                    : "text-gray-400 hover:bg-[#252525] hover:text-white"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
