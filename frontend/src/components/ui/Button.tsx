import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-md shadow-black/10 hover:brightness-110",
  secondary:
    "bg-white/70 text-zinc-900 border border-white/40 shadow-sm shadow-black/5 hover:bg-white",
  ghost: "bg-transparent text-zinc-500 hover:text-zinc-900"
};

export default function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-[0.98] ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
