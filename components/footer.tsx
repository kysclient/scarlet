import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <>
      <div className="flex gap-1 justify-center">
        <a
          target="_blank"
          href="https://kysclient.me"
          rel="noopener noreferrer"
          className={cn(
            'px-2 text-center text-xs leading-normal text-muted-foreground',
            className
          )}
          {...props}
        >
          © 2024 kysclient
        </a>
        <p
          className={cn(
            'px-2 text-center text-xs leading-normal text-muted-foreground',
            className
          )}
        >
          Scarlet can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  )
}
