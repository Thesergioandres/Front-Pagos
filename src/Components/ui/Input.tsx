import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", invalid = false, ...rest }, ref) => {
    const base =
      "border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 transition-colors";
    const validCls =
      "border-brand-700 focus:ring-brand-500 focus:border-brand-700";
    const invalidCls = "border-red-600 focus:ring-red-500";
    return (
      <input
        ref={ref}
        className={`${base} ${invalid ? invalidCls : validCls} ${className}`}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
