import { auth } from '@/auth'
import OpenAI from 'openai'
import { Uploadable } from 'openai/uploads'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  let formData = await req.formData()
  const fileData = formData.get('image') as Uploadable
  const userId = (await auth())?.user.id

  if (!userId) {
    return unauthorizedResponse()
  }

  try {
    const res = await openai.images.createVariation({
      model: 'dall-e-2',
      image: fileData
    })

    return new Response(JSON.stringify(res.data), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 500 })
  }
}

function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401
  })
}
