import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { topic, tone, platform } = body

    if (!topic) {
      return NextResponse.json({ message: "O tema é obrigatório" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json({ message: "Sem créditos suficientes" }, { status: 403 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "API Key não configurada" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    let model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
    
    const prompt = `
      Atue como especialista em Marketing Digital.
      Crie um post para ${platform} sobre "${topic}".
      Tom de voz: ${tone}.
      Use emojis e parágrafos curtos.
      PT-BR.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        if (!text) throw new Error("Vazio")

        await prisma.$transaction([
          prisma.post.create({
            data: {
              title: topic,
              content: text,
              userId: user.id
            }
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } }
          })
        ])

        return NextResponse.json({ success: true, content: text })

    } catch (innerError: any) {
        console.log("Tentando fallback para gemini-flash-latest...")
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        await prisma.$transaction([
          prisma.post.create({
            data: {
              title: topic,
              content: text,
              userId: user.id
            }
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } }
          })
        ])
        
        return NextResponse.json({ success: true, content: text })
    }

  } catch (error: any) {
    console.error("Erro Final:", error)
    return NextResponse.json(
      { message: error.message || "Erro interno na IA" },
      { status: 500 }
    )
  }
}