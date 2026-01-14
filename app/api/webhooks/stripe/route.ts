import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  
  const headerPayload = await headers()
  const signature = headerPayload.get("Stripe-Signature") as string

  if (!signature) {
    return new NextResponse("No signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userEmail = session.metadata?.userEmail

    if (!userEmail) {
      return new NextResponse("Email not found", { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { email: userEmail },
        data: { credits: { increment: 10 } },
      })
    } catch (dbError) {
      return new NextResponse("Database Error", { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}