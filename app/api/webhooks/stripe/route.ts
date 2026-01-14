import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error("[WEBHOOK ERROR] Assinatura inválida:", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    
    const userEmail = session.metadata?.userEmail

    if (!userEmail) {
      console.error("[WEBHOOK ERROR] Email não encontrado no metadata")
      return new NextResponse("Email not found in metadata", { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { email: userEmail },
        data: {
          credits: { increment: 10 },
        },
      })
      console.log(`[SUCESSO] 10 créditos adicionados para: ${userEmail}`)
    } catch (error) {
      console.error("[DB ERROR] Falha ao adicionar créditos:", error)
      return new NextResponse("Database Error", { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}