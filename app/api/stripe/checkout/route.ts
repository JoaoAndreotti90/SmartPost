import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Plano Iniciante (10 Créditos)",
              description: "Pacote de créditos para gerar posts com IA"
            },
            unit_amount: 1900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/pricing?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userEmail: session.user.email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}