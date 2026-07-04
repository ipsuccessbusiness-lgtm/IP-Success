'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700',
            error
              ? 'border-red-400 bg-red-50'
              : 'border-outline-variant hover:border-primary-700/50',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">⚠ {error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
