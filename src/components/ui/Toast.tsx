import { X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore()
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card px-4 py-3 text-sm font-medium shadow-card ${toast.tone === 'error' ? 'bg-badge text-background' : 'bg-primary text-background'}`}>
          <span className="flex-1">{toast.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)} className="rounded-full p-1 hover:bg-background/15"><X size={16} /></button>
        </div>
      ))}
    </div>
  )
}
