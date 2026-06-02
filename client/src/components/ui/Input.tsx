import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-(--text-secondary)">{label}</label>}
      <input
        className={`rounded-lg border border-(--border) bg-(--bg-primary) px-3 py-2 text-sm outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-(--danger)">{error}</span>}
    </div>
  );
}
