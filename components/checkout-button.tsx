"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function CheckoutButton() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const hasAutoCheckoutRun = useRef(false)

  useEffect(() => {
    const isPending = searchParams.get("checkout_pending") === "true"
    
    console.log("[DEBUG] Status da Sessão:", status)
    console.log("[DEBUG] Parametro Pendente:", isPending)
    console.log("[DEBUG] Já rodou auto-checkout?", hasAutoCheckoutRun.current)

    if (status === "authenticated" && isPending && !hasAutoCheckoutRun.current) {
      console.log("[DEBUG] CONDIÇÃO ACEITA! Iniciando pagamento automático...")
      hasAutoCheckoutRun.current = true 
      toast.success("Login realizado! Iniciando pagamento...")
      handleCheckout()
    }
  }, [status, searchParams])

  async function handleCheckout() {
    console.log("[DEBUG] Botão clicado ou acionado.")

    if (status === "unauthenticated") {
      console.log("[DEBUG] Usuário deslogado. Preparando redirecionamento...")
      
      const callbackUrl = `${window.location.origin}/pricing?checkout_pending=true`
      
      console.log("[DEBUG] URL de Retorno (Callback) definida como:", callbackUrl)
      
      toast.info("Faça login para continuar sua compra.")
      signIn("google", { callbackUrl }) 
      return
    }

    console.log("[DEBUG] Usuário logado. Chamando API do Stripe...")
    setLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      console.log("[DEBUG] Resposta do Stripe:", data)

      if (data.url) {
        console.log("[DEBUG] Redirecionando para:", data.url)
        window.location.href = data.url
      } else {
        console.error("[DEBUG] Erro: Sem URL na resposta")
        toast.error("Erro ao iniciar pagamento.")
        setLoading(false)
      }
    } catch (error) {
      console.error("[DEBUG] Erro de conexão:", error)
      toast.error("Erro de conexão.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || status === "loading"}
      className="w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Redirecionando...
        </>
      ) : (
        "Comprar Agora"
      )}
    </button>
  )
}