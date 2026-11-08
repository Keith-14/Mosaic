import type { PropsWithChildren } from 'react'

type ContainerProps = PropsWithChildren<{ className?: string }>

export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-content px-4 md:px-8 ${className}`}>{children}</div>
}
