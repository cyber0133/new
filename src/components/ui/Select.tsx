import React from 'react';
import { cn } from '../../lib/utils';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: {
    value: string | number;
    label: string;
  }[];
}
export function Select({
  className,
  label,
  options,
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name || Math.random().toString(36).substring(7);
  return (
    <div className="w-full space-y-1.5">
      {label &&
      <label htmlFor={selectId} className="text-xs font-medium text-gray-400">
          {label}
        </label>
      }
      <select
        id={selectId}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}>

        {options.map((opt) =>
        <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )}
      </select>
    </div>);

}