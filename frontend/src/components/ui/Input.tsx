import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm shadow-black/5 focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 ${className}`}
      {...props}
    />
  );
}
