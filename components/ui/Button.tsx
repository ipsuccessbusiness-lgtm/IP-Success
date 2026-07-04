'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-primary-700 text-white hover:bg-primary-800 shadow-md hover:shadow-lg focus:ring-primary-700',
      secondary: 'bg-secondary-fixed text-primary-700 hover:bg-white font-bold shadow-md focus:ring-secondary-fixed',
      outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white focus:ring-primary-700',
      ghost: 'text-primary-700 hover:bg-primary-50 focus:ring-primary-700',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md focus:ring-red-600',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-sm gap-2',
      lg: 'px-8 py-4 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
