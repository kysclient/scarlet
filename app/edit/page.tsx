'use client'
import { LoginButton } from '@/components/login-button'
import { IconGitHub, IconSearch, IconSpinner } from '@/components/ui/icons'
import { Button, type ButtonProps } from '@/components/ui/button'
import { LoadingButton } from '@/components/loading-button'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import { TextField } from '@radix-ui/themes'

export const PNG_ERROR_MESSAGE = 'PNG 파일만 업로드 가능합니다.'
export const SIZE_ERROR_MESSAGE = '4MB 미만 파일만 업로드 가능합니다.'

export default function EditPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFilename] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<any>()
  const [imgList, setImgList] = useState<any[]>([])
  const [variationLoading, setVariationLoading] = useState<boolean>(false)
  function validateImageExtension(filePath: string): boolean {
    const fileExtension = filePath.split('.').pop()?.toLowerCase()

    if (fileExtension && fileExtension === 'png') {
      return true
    } else {
      return false
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (validateFile(file)) {
        setFilename(file.name)
        setFile(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setFile(null)
        setFilename('')
      }
    }
  }

  const validateFile = (file: File) => {
    if (!validateImageExtension(file.name)) {
      toast.error(PNG_ERROR_MESSAGE, {
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
    } else if (file.size / (1024 * 1024) > 4) {
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

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  async function generate() {
    setLoading(true)
    if (!file) {
      toast.error('편집할 파일을 선택해주세요.', {
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
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('image', file!!)
    formData.append('prompt', prompt)

    const response = await fetch('/api/edit', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      setImgList(result)
    } else {
      toast.error('유효한 PNG 파일, 4MB미만 및 사각형이어야 합니다.', {
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
    }
    setLoading(false)
  }

  async function variation() {
    setVariationLoading(true)
    if (!file) {
      toast.error('편집할 파일을 선택해주세요.', {
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
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('image', file!!)

    const response = await fetch('/api/variation', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      setImgList(result)
    } else {
      toast.error('유효한 PNG 파일, 4MB미만 및 사각형이어야 합니다.', {
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
    }
    setVariationLoading(false)
  }

  return (
    <div className="w-full flex flex-col space-y-8 min-h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10 max-w-7xl mx-auto px-4">
      <div className="relative w-full">
        <TextField.Root className="w-full">
          <TextField.Slot>
            <IconSearch className="w-5 h-5 text-mainaccent" />
          </TextField.Slot>
          <TextField.Input
            color="blue"
            radius="full"
            value={prompt}
            onChange={e => {
              setPrompt(e.target.value)
            }}
            placeholder="ex) 플라밍고가 있는 수영장을 갖춘 햇빛이 잘 드는 실내 라운지 공간."
            size="3"
            className="min-w-[32rem] ring-mainaccent"
          />
        </TextField.Root>
      </div>
      <div className="flex items-center justify-center w-full">
        {file ? (
          <div className="relative">
            <img src={preview} className="w-[200px] rounded-xl" />
            <Button
              variant="destructive"
              onClick={() => {
                setPreview(null)
                setFile(null)
                setFilename('')
              }}
              className="absolute top-0 -right-20"
            >
              삭제
            </Button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-background hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="h"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Only PNG Supported (MAX. 1024x1024)
              </p>
            </div>
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              className="hidden"
            />
          </div>
        )}
      </div>

      <TextField.Root className="w-full">
        <TextField.Input
          placeholder="파일명"
          value={fileName}
          disabled
          className=""
          radius="large"
        />
      </TextField.Root>

      <div>
        {imgList.map((img, idx) => (
          <img
            src={img.url}
            alt="edit_img"
            key={idx}
            className="rounded-xl w-full h-[300px]"
          />
        ))}
      </div>

      <div className="flex space-x-4 items-center">
        <Button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center"
        >
          {loading ? <IconSpinner className="mr-2 animate-spin" /> : '편집'}
        </Button>

        <Button
          onClick={variation}
          disabled={variationLoading}
          className="flex items-center justify-center"
        >
          {variationLoading ? (
            <IconSpinner className="mr-2 animate-spin" />
          ) : (
            '변형'
          )}
        </Button>
      </div>
    </div>
  )
}
