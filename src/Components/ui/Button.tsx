import React from "react";

type Variant = "brand" | "secondary" | "success" | "danger" | "ghost" | "back"; // fondo negro, borde y texto blanco
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  brand: "bg-brand-700 hover:bg-brand-800 text-white focus:ring-brand-500",
  secondary:
    "bg-gray-100 hover:bg-gray-200 text-brand-800 focus:ring-brand-400",
  success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50 focus:ring-brand-400",
  back: "bg-black text-white border border-white hover:bg-black/90 focus:ring-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "brand",
      size = "md",
      isLoading,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded shadow-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
    const cls = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled || isLoading}
        aria-busy={!!isLoading}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
