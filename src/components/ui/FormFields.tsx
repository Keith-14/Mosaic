import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

type FieldProps = { label: string; error?: string; className?: string }

const fieldClass = 'mt-1 w-full rounded-card border border-accent-soft bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted focus:border-accent'

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const fieldId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    return <label className={`block text-sm font-medium text-text ${className}`} htmlFor={fieldId}>
      {label}<input ref={ref} id={fieldId} className={fieldClass} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
      {error && <span id={`${fieldId}-error`} className="mt-1 block text-xs text-badge">{error}</span>}
    </label>
  },
)
Input.displayName = 'Input'

export const Select = forwardRef<HTMLSelectElement, FieldProps & SelectHTMLAttributes<HTMLSelectElement>>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    const fieldId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`
    return <label className={`block text-sm font-medium text-text ${className}`} htmlFor={fieldId}>
      {label}<select ref={ref} id={fieldId} className={fieldClass} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props}>{children}</select>
      {error && <span id={`${fieldId}-error`} className="mt-1 block text-xs text-badge">{error}</span>}
    </label>
  },
)
Select.displayName = 'Select'

export const Textarea = forwardRef<HTMLTextAreaElement, FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const fieldId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`
    return <label className={`block text-sm font-medium text-text ${className}`} htmlFor={fieldId}>
      {label}<textarea ref={ref} id={fieldId} className={`${fieldClass} min-h-28 resize-y`} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
      {error && <span id={`${fieldId}-error`} className="mt-1 block text-xs text-badge">{error}</span>}
    </label>
  },
)
Textarea.displayName = 'Textarea'
