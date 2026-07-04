'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700',
            error
              ? 'border-red-400 bg-red-50'
              : 'border-outline-variant bg-white hover:border-primary-700/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 flex items-center gap-1">⚠ {error}</p>}
        {helpText && !error && <p className="text-xs text-gray-500">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
