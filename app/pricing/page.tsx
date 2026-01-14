import { Check, ArrowLeft, Loader2 } from "lucide-react" // Adicionei Loader2
import { CheckoutButton } from "@/components/checkout-button"
import Link from "next/link"
import { Suspense } from "react" // IMPORTANTE: Importar o Suspense

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Simples */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-600">
             <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Planos & Créditos</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* PLANO INICIANTE (O Único Ativo) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Iniciante</h3>
                <p className="text-slate-500 text-sm mt-1">Para testar e começar.</p>
            </div>

            <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">R$ 19</span>
                <span className="text-slate-500">/mês</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={18} className="text-green-500" /> 10 Créditos de IA
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={18} className="text-green-500" /> Histórico de 30 dias
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={18} className="text-green-500" /> Suporte por email
                </li>
            </ul>

            {/* AQUI ESTÁ A CORREÇÃO: ENVOLVER EM SUSPENSE */}
            <Suspense fallback={
                <button disabled className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} /> Carregando...
                </button>
            }>
                <CheckoutButton />
            </Suspense>

          </div>

          {/* PLANO PRO (Em Breve) */}
          <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 flex flex-col relative text-white transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
                MAIS POPULAR
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-bold">Creator Pro</h3>
                <p className="text-slate-400 text-sm mt-1">Em breve...</p>
            </div>
            <div className="mb-8">
                <span className="text-4xl font-extrabold">R$ 49</span>
                <span className="text-slate-400">/mês</span>
            </div>
            <div className="mt-auto">
                <button disabled className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                    Em Breve
                </button>
            </div>
          </div>

          {/* PLANO AGÊNCIA (Em Breve) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col opacity-60">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Agência</h3>
                <p className="text-slate-500 text-sm mt-1">Em breve...</p>
            </div>
            <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">R$ 99</span>
                <span className="text-slate-500">/mês</span>
            </div>
            <div className="mt-auto">
                <button disabled className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                    Em Breve
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}