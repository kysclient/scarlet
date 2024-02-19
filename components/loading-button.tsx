'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconSpinner } from '@/components/ui/icons'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

interface LoadingButtonProps extends ButtonProps {
  text?: string
}

export function LoadingButton({
  text = 'Loading',
  className,
  ...props
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )

  const fineTune = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/finetune', {
        method: 'POST',
        body: JSON.stringify({ previewToken: previewToken })
      })
      if (response.ok) {
        console.log('response : ', response)
      } else {
        console.error('Failed to fetch API data')
      }
    } catch (error) {
      console.error('Error fetching API data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={() => {
        fineTune()
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <IconSpinner className="mr-2 animate-spin" /> : null}
      {text}
    </Button>
  )
}
