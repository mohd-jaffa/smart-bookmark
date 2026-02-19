"use client";

import Button from "./Button";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in scale-95 fade-in duration-200">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-600 mt-2">{message}</p>
        
        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-zinc-600 hover:bg-zinc-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={isDangerous ? "bg-rose-600 hover:bg-rose-700 text-white" : undefined}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
