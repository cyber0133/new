import React from 'react';
import { cn } from '../../lib/utils';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);
  return (
    <div className="w-full space-y-1.5">
      {label &&
      <label htmlFor={inputId} className="text-xs font-medium text-gray-400">
          {label}
        </label>
      }
      <input
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500/50',
          className
        )}
        {...props} />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>);

}