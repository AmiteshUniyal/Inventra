import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants: Record<Variant, string> = {
    primary: "bg-zinc-700 text-white hover:bg-zinc-900 focus:ring-zinc-900",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-400 focus:ring-zinc-400",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-600",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
