import { useEffect, useState, useCallback } from 'react';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem { id: number; message: string; type: ToastType }

interface ToastStore { toasts: ToastItem[]; addToast: (message: string, type: ToastType) => void; removeToast: (id: number) => void }

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons: Record<ToastType, string> = { success: '\u2713', error: '\u2717', info: '\u2139' };
const colors: Record<ToastType, string> = { success: 'bg-(--success) text-white', error: 'bg-(--danger) text-white', info: 'bg-(--accent) text-white' };

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colors[t.type]} rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-medium animate-slide-up cursor-pointer`}
          onClick={() => removeToast(t.id)}
        >
          <span>{icons[t.type]}</span>
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
