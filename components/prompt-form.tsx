import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  IconArrowElbow,
  IconFolder,
  IconImage,
  IconPlus,
  IconSend,
  IconSpinner
} from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { useWindow } from '@/lib/window-context'
import { ChangeEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PNG_ERROR_MESSAGE, SIZE_ERROR_MESSAGE } from '@/app/edit/page'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { width } = useWindow()
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFilename] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    toast.error('준비중인 기능입니다.', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '14px'
      },
      iconTheme: {
        primary: 'white',
        secondary: 'black'
      }
    })

    // if (file) {
    //   if (validateFile(file)) {
    //     setFilename(file.name)
    //     setFile(file)

    //     const reader = new FileReader()
    //     reader.onloadend = () => {
    //       setPreview(reader.result)
    //     }
    //     reader.readAsDataURL(file)
    //   } else {
    //     setFile(null)
    //     setFilename('')
    //   }
    // }
  }

  const validateFile = (file: File) => {
    if (file.size / (1024 * 1024) > 4) {
      toast.error(SIZE_ERROR_MESSAGE, {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '14px'
        },
        iconTheme: {
          primary: 'white',
          secondary: 'black'
        }
      })
      return false
    }
    return true
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background rounded-2xl border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                // router.refresh()
                // router.push('/')                
                fileInputRef.current?.click();
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-2 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconFolder />
              <span className="sr-only">이미지 업로드</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>이미지 업로드</TooltipContent>
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            className="hidden"
          />
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`${width > 700 ? '스칼렛에게 무엇이든 요청하세요. "~그려줘" 라고 입력하면 스칼렛이 이미지를 그려드려요.' : '스칼렛에게 무엇이든 요청하세요.'}`}
          spellCheck={false}
          className=" min-h-[60px] w-full rounded-3xl resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-2 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                {isLoading ? (
                  <IconSpinner className="animate-spin" />
                ) : (
                  <IconSend />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
