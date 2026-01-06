"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = "left", className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-400">{label}</label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[#252525] border rounded-lg px-4 py-2.5 text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-[#ef4444]" : "border-[#2a2a2a]"}
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-400">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-[#252525] border rounded-lg px-4 py-2.5 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed resize-none
            ${error ? "border-[#ef4444]" : "border-[#2a2a2a]"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-400">{label}</label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-[#252525] border rounded-lg px-4 py-2.5 text-white
            focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed appearance-none
            ${error ? "border-[#ef4444]" : "border-[#2a2a2a]"}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

// Search input with built-in search icon
interface SearchInputProps extends Omit<InputProps, "icon" | "iconPosition"> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, onChange, ...props }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onSearch?.(e.target.value);
  };

  return (
    <Input
      type="search"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      iconPosition="left"
      onChange={handleChange}
      {...props}
    />
  );
}
