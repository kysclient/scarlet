import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { HeaderNavigation } from './header-navigation'

async function HeaderLeft() {
  const session = await auth()

  return (
    <>
      <HeaderNavigation session={session} />
    </>
  )
}

export async function Header() {
  const session = await auth()

  return (
    <header className="backdrop-blur-[12px] sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80">
      <div className="flex items-center mr-10">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <HeaderLeft />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-4">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
