import React from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", invalid = false, children, ...rest }, ref) => {
    const base =
      "w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 transition-colors";
    const valid =
      "border-brand-700 focus:ring-brand-500 focus:border-brand-700";
    const invalidCls = "border-red-600 focus:ring-red-500";
    return (
      <select
        ref={ref}
        className={`${base} ${invalid ? invalidCls : valid} ${className}`}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
