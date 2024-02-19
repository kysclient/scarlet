'use client'

import Image from 'next/image'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconExternalLink, IconHamburg } from '@/components/ui/icons'
import { useWindow } from '@/lib/window-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export interface UserMenuProps {
  user: Session['user']
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {
  const { width } = useWindow()
  const router = useRouter()
  return (
    <div className="flex items-center justify-between ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {width > 600 ? (
            <Button variant="ghost" className="pl-0">
              {user?.image ? (
                <Image
                  className="size-6 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
                  src={user?.image ? `${user.image}&s=60` : ''}
                  alt={user.name ?? 'Avatar'}
                  height={48}
                  width={48}
                />
              ) : (
                <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none size-7 shrink-0 bg-muted/50 text-muted-foreground">
                  {user?.name ? getUserInitials(user?.name) : null}
                </div>
              )}
              <span className="pl-2">{user?.name}</span>
            </Button>
          ) : (
            <Button>
              <IconHamburg className="text-white" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full text-xs"
            >
              Vercel Homepage
              <IconExternalLink className="size-3 ml-auto" />
            </a>
          </DropdownMenuItem>
          {width < 600 && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  router.push('/')
                }}
                className="text-xs"
              >
                채팅
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push('edit')
                }}
                className="text-xs"
              >
                이미지 편집
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: '/'
              })
            }
            className="text-xs"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
