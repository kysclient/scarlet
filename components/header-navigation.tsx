'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { useWindow } from '@/lib/window-context'
import { IconSeparator } from './ui/icons'
import { SidebarMobile } from './sidebar-mobile'
import { ChatHistory } from './chat-history'
import { SidebarToggle } from './sidebar-toggle'

const HeaderNavigation = ({ session }: any) => {
  const pathname = usePathname()
  const { width } = useWindow()
  return (
    <>
      <div className="flex items-center mr-10">
        {session?.user && (pathname === '/' || pathname.includes('chat')) && (
          <>
            <SidebarMobile>
              <ChatHistory userId={session.user.id} />
            </SidebarMobile>
            <SidebarToggle />
          </>
        )}
        {(pathname === '/' || pathname.includes('chat')) && (
          <IconSeparator className="size-6 text-muted-foreground/50" />
        )}

        <Link href={'/'}>
          <h1 className="font-bold text-2xl text-mainaccent">
            <span className="text-3xl font-extrabold text-[#C0C0C0]">:</span>
            Scarlet
          </h1>
        </Link>
      </div>

      {width > 600 && (
        <div className="flex space-x-8">
          <Link href={'/'}>
            <Button
              variant="ghost"
              className={`hover:text-mainaccent ${(pathname === '/' || pathname.includes('chat')) && 'text-mainaccent'}`}
            >
              <p className="font-medium ">채팅</p>
            </Button>
          </Link>
          <Link href={'/edit'}>
            <Button variant="ghost" className="">
              <p
                className={`font-medium hover:text-main_accent ${pathname.includes('edit') && 'text-mainaccent'}`}
              >
                이미지 편집
              </p>
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
export { HeaderNavigation }
