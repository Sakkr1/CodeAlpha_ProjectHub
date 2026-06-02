import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
}

const base = 'inline-flex items-center justify-center rounded-xl gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer';

const variants: Record<string, string> = {
  primary: 'bg-(--accent) text-white hover:bg-(--accent-hover) shadow-sm hover:shadow-md',
  danger: 'bg-(--danger) text-white hover:opacity-90 shadow-sm',
  ghost: 'bg-transparent hover:bg-(--bg-secondary) text-(--text-primary)',
};

export function Button({ variant = 'primary', loading, children, className = '', ...props }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
