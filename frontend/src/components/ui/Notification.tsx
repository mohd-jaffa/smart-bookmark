"use client";

import { useEffect } from "react";

type NotificationProps = {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
};

export default function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-emerald-50 border-emerald-200",
    error: "bg-rose-50 border-rose-200",
    info: "bg-blue-50 border-blue-200"
  }[type];

  const textColor = {
    success: "text-emerald-700",
    error: "text-rose-700",
    info: "text-blue-700"
  }[type];

  const iconColor = {
    success: "text-emerald-600",
    error: "text-rose-600",
    info: "text-blue-600"
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ"
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm rounded-lg border ${bgColor} p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 text-lg font-bold ${iconColor} leading-none`}>
          {icon}
        </div>
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      </div>
    </div>
  );
}
