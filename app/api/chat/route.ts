import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return unauthorizedResponse()
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const lastMessage = messages[messages.length - 1].content
  if (isImagePrompt(lastMessage)) {
    return handleImageRequest(lastMessage, userId, json)
  } else {
    return handleTextRequest(messages, userId, json)
  }
}

function isImagePrompt(message: any) {
  const imagePrompts = /(그려줘)/
  return imagePrompts.test(message)
}

async function handleImageRequest(message: any, userId: any, json: any) {
  const res = await openai.images.generate({
    model: 'dall-e-3',
    prompt: message,
    quality: 'hd'
  })
  const urls = res.data.map(item => item.url).join(',')
  const chatPayload = await createChatPayload(message, urls, userId, json)
  await storeChatData(chatPayload)
  return new Response(urls, { status: 200 })
}

async function handleTextRequest(messages: any, userId: any, json: any) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages,
    temperature: 0.7,
    stream: true
  })
  const stream = new (OpenAIStream as any)(res, {
    async onCompletion(completion: any) {
      const chatPayload = await createChatPayload(
        messages[0].content,
        completion,
        userId,
        json
      )
      await storeChatData(chatPayload)
    }
  })
  return new StreamingTextResponse(stream)
}

async function createChatPayload(
  prompt: any,
  content: any,
  userId: any,
  json: any
) {
  const title = prompt.substring(0, 100)
  const id = json.id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  return {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...json.messages,
      {
        content,
        role: 'assistant'
      }
    ]
  }
}

async function storeChatData(payload: any) {
  await kv.hmset(`chat:${payload.id}`, payload)
  await kv.zadd(`user:chat:${payload.userId}`, {
    score: payload.createdAt,
    member: `chat:${payload.id}`
  })
}

function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401
  })
}
