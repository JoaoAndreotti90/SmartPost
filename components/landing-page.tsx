import Link from "next/link"
import { ArrowRight, CheckCircle, Zap, TrendingUp, Shield } from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Zap className="fill-blue-600" size={24} />
            SmartPost
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              Entrar
            </Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition">
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nova IA 2.0 Disponível
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Crie posts virais <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">em segundos</span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Abandone o bloqueio criativo. Use nossa Inteligência Artificial para gerar conteúdo engajador para LinkedIn, Instagram e Twitter com um clique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              Criar meu primeiro post <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition">
              Ver Planos
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> Sem cartão de crédito</div>
            <div className="flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> Teste grátis</div>
          </div>
        </div>

        <div className="bg-gray-50 py-20 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Geração Instantânea</h3>
                <p className="text-gray-500">Basta digitar um tema e nossa IA escreve um post completo, formatado e com emojis em menos de 5 segundos.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Foco em Engajamento</h3>
                <p className="text-gray-500">Nossos modelos são treinados para criar textos que geram curtidas, comentários e compartilhamentos.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Original</h3>
                <p className="text-gray-500">Conteúdo único criado especificamente para você. Nada de textos repetidos ou plágio.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-gray-400 text-sm">
          <p>© 2024 SmartPost. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-600">Termos</Link>
            <Link href="#" className="hover:text-gray-600">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}