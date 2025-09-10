export const tableClasses = {
  container:
    "w-full max-w-full overflow-x-auto rounded-xl shadow-lg border border-brand-700 bg-white",
  table: "text-xs",
  headRow: "bg-brand-800 text-white font-semibold",
  th: "px-3 py-2 sticky top-0 bg-brand-800 z-10",
  tr: "even:bg-brand-50",
  td: "px-3 py-2 text-brand-800",
} as const;

export default tableClasses;
