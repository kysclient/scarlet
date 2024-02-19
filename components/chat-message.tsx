import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import Image from 'next/image'
import { auth } from '@/auth'
import { useSession } from 'next-auth/react'

export interface ChatMessageProps {
  message: Message
  user: any
}

export function ChatMessage({ message, user, ...props }: ChatMessageProps) {
  console.log('message :', message)
  const blurDataURL =
    'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
  const session = useSession()
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <p className="text-xl"></p>
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow overflow-hidden',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? (
          session?.data?.user?.image ? (
            <img src={session.data.user.image!!} alt="user image" className='w-full h-full' />
          ) : (
            <IconUser />
          )
        ) : (
          <IconOpenAI />
        )}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            },
            img({children}){
              return <img className='rounded-xl w-full'>{children}</img>
            }
          }}
        >
          {!message.content.includes('oaidalleapiprodscus') && message.content}
        </MemoizedReactMarkdown>
        {message.content.includes('oaidalleapiprodscus') &&
          message.content
            .split(',')
            .map((url: any) => (
              <Image
                placeholder="blur"
                blurDataURL={blurDataURL}
                key={Math.random()}
                layout="responsive"
                width={100}
                height={100}
                src={url}
                alt="custom_image"
                className="w-full rounded-xl"
              />
            ))}
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
