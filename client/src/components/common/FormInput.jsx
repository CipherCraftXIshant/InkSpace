import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Editorial Form Input component.
 * Follows modern web accessibility patterns, with password reveal toggle,
 * autocomplete hints, and crisp monochrome focus states.
 */
export default function FormInput({
  label,
  id: explicitId,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  enterKeyHint,
  icon: Icon,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const inputId = explicitId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#1F2937] dark:text-[#F4F4F6]"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>
      )}

      <div className="relative rounded-md shadow-2xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-[#9CA3AF] dark:text-[#71717A]" aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          name={name || inputId}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`block w-full rounded-md border text-sm text-[#111827] dark:text-[#F4F4F6] placeholder:text-[#9CA3AF] dark:placeholder:text-[#71717A] bg-white dark:bg-[#18181B] transition-colors duration-150 py-2.5 ${
            Icon ? 'pl-9' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-[#E5E7EB] dark:border-[#27272A] hover:border-[#D1D5DB] dark:hover:border-zinc-500 focus:border-[#121212] dark:focus:border-white focus:ring-1 focus:ring-[#121212] dark:focus:ring-white'
          } disabled:bg-[#F3F4F6] dark:disabled:bg-zinc-800 disabled:text-[#9CA3AF] disabled:cursor-not-allowed outline-hidden`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] dark:text-[#71717A] hover:text-[#121212] dark:hover:text-white cursor-pointer focus:outline-hidden focus:text-[#121212] dark:focus:text-white focus:ring-1 focus:ring-[#121212] dark:focus:ring-white focus:rounded-sm transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-[#6B7280] dark:text-[#A1A1AA]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
