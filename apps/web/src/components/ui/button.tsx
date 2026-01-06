"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  disabled?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
  secondary: "bg-[#252525] text-white hover:bg-[#2a2a2a]",
  danger: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
  ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-[#252525]",
  outline: "bg-transparent border border-[#3a3a3a] text-white hover:bg-[#252525]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    loading = false,
    fullWidth = false,
    className = "",
  } = props;

  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

  const content = (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </>
  );

  if (props.href) {
    const { disabled } = props;
    return (
      <Link
        href={props.href}
        className={`${baseStyles} ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {content}
      </Link>
    );
  }

  const { disabled, type, onClick, ...rest } = props as ButtonAsButton;
  return (
    <button
      className={baseStyles}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
