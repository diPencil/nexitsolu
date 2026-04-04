import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-text-primary placeholder:text-text-secondary selection:bg-accent selection:text-white',
        'h-10 w-full min-w-0 rounded-lg border border-border-color bg-bg-secondary px-4 py-2 text-sm shadow-sm transition-all outline-none',
        'focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/10',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-bg-secondary/40',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
