"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const router = useRouter()
  const [status, setStatus] = useState("loading") 

  useEffect(() => {
    if (!sessionId) return

    fetch("/api/payment-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success")
          router.refresh() 
        } else {
          setStatus("error")
        }
      })
      .catch(() => setStatus("error"))
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirmando pagamento...</h1>
            <p className="text-gray-500">Estamos adicionando seus créditos.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</h1>
            <p className="text-gray-500 mb-6">Seus 10 créditos foram adicionados.</p>
            <Link 
              href="/" 
              className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Voltar e Gerar Posts
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-red-600 mb-2">Ops! Algo deu errado.</h1>
            <p className="text-gray-500 mb-4">Não conseguimos confirmar automaticamente, mas se o pagamento saiu, seus créditos chegarão em breve.</p>
            <Link href="/" className="text-blue-600 underline">Voltar para o início</Link>
          </>
        )}

      </div>
    </div>
  )
}