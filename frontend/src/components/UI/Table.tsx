import { ReactNode } from "react";

type CellProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y">{children}</tbody>;
}

export function TR({ children }: { children: ReactNode }) {
  return <tr className="hover:bg-zinc-50">{children}</tr>;
}

export function TH({ children, className }: CellProps) {
  return (
    <th className={`px-4 py-3 whitespace-nowrap ${className ?? ""}`}>
      {children}
    </th>
  );
}

export function TD({ children, className }: CellProps) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap ${className ?? ""}`}>
      {children}
    </td>
  );
}
