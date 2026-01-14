import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
})

export async function POST(req: Request) {
  try {
    const sessionAuth = await getServerSession(authOptions)

    if (!sessionAuth?.user?.email) {
      return NextResponse.json({ message: "Não logado" }, { status: 401 })
    }

    const { sessionId } = await req.json()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ message: "Pagamento não confirmado" }, { status: 400 })
    }

    const userEmail = sessionAuth.user.email

    await prisma.user.update({
      where: { email: userEmail },
      data: { 
        credits: { increment: 10 } 
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Erro ao processar" }, { status: 500 })
  }
}