import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/5 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
