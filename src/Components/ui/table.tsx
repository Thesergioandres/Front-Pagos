import React from "react";
import { tableClasses } from "./tableClasses";

type ContainerProps = React.PropsWithChildren<{
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
}>;

export function TableContainer({
  maxHeight = "calc(90vh - 150px)",
  className = "",
  style,
  children,
}: ContainerProps) {
  return (
    <div
      className={`${tableClasses.container} ${className}`}
      style={{ maxHeight, overflowY: "auto", ...style }}
    >
      {children}
    </div>
  );
}

export default { TableContainer };
