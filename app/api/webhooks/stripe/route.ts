import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  console.log("----------------------------------------------")
  console.log("[WEBHOOK] 1. Recebi um aviso do Stripe!")

  const body = await req.text()
  
  // CORREÇÃO NEXT.JS 15: headers() agora é assíncrono
  const headerPayload = await headers()
  const signature = headerPayload.get("Stripe-Signature") as string

  if (!signature) {
    console.error("[WEBHOOK ERROR] Sem assinatura no header")
    return new NextResponse("No signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log("[WEBHOOK] 2. Assinatura válida! Evento:", event.type)
  } catch (error: any) {
    console.error("[WEBHOOK ERROR] Assinatura inválida. Verifique o Segredo na Vercel.")
    console.error("Erro detalhado:", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    
    console.log("[WEBHOOK] 3. Processando pagamento...")
    console.log("[WEBHOOK] Metadata recebido:", session.metadata)

    const userEmail = session.metadata?.userEmail

    if (!userEmail) {
      console.error("[WEBHOOK ERROR] Email não veio no metadata!")
      return new NextResponse("Email not found", { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { email: userEmail },
        data: { credits: { increment: 10 } },
      })
      console.log(`[WEBHOOK] 4. SUCESSO! 10 créditos adicionados para: ${userEmail}`)
    } catch (dbError) {
      console.error("[WEBHOOK DB ERROR] Falha ao salvar no banco:", dbError)
      return new NextResponse("Database Error", { status: 500 })
    }
  } else {
    console.log(`[WEBHOOK] Ignorando evento irrelevante: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}