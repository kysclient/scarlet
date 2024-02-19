import OpenAI from 'openai'

import { auth } from '@/auth'
import { Uploadable } from 'openai/uploads'
import sharp from 'sharp'
import fs from 'fs'
import { promisify } from 'util'
const writeFileAsync = promisify(fs.writeFile)
const unlinkAsync = promisify(fs.unlink)

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  let formData = await req.formData()
  let body = Object.fromEntries(formData)
  const fileData = formData.get('image')

  const userId = (await auth())?.user.id

  if (!userId) {
    return unauthorizedResponse()
  }

  if (!fileData || !(fileData instanceof Blob)) {
    return new Response('No image provided', { status: 400 })
  }

  const buffer = await fileData.arrayBuffer()
  const imageBuffer = Buffer.from(buffer)
  let tempFilePath

  try {
    const processedImageBuffer = await sharp(imageBuffer)
      .ensureAlpha()
      .toBuffer()
    tempFilePath = `temp-${Date.now()}.png`
    await writeFileAsync(tempFilePath, processedImageBuffer)

    const res = await openai.images.edit({
      model: 'dall-e-2',
      image: fs.createReadStream(tempFilePath),
      prompt: body.prompt as string
    })
    await unlinkAsync(tempFilePath)

    return new Response(JSON.stringify(res.data), { status: 200 })
  } catch (e) {
    if (tempFilePath) {
      await unlinkAsync(tempFilePath).catch(() => {})
    }
    return new Response(JSON.stringify(e), { status: 500 })
  }
}

function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401
  })
}
