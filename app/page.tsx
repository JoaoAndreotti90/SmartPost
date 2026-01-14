import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { LogoutButton } from "@/components/auth-buttons"
import { PostGenerator } from "@/components/post-generator"
import { LandingPage } from "@/components/landing-page"
import { LayoutDashboard, History, CreditCard, Sparkles } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return <LandingPage />
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return <LandingPage /> 
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-72 bg-white border-r border-slate-100 p-6 hidden md:flex md:flex-col h-full overflow-y-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 px-2 flex-shrink-0">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm shadow-blue-200">
                <Sparkles className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SmartPost</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Link href="/" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium transition-all group">
             <LayoutDashboard size={18} className="text-blue-600" />
             Gerar Post
          </Link>
          
          <Link href="/history" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium group">
             <History size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
             Histórico
          </Link>

          <Link href="/pricing" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium group">
             <CreditCard size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
             Comprar Créditos
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 flex-shrink-0">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-12 w-12 text-blue-600 rotate-12" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Seus Créditos</p>
            <div className="flex items-end gap-2 relative z-10">
                <p className="text-3xl font-extrabold text-blue-600 leading-none">{user.credits}</p>
                <span className="text-sm text-slate-500 font-medium mb-0.5">disponíveis</span>
            </div>
          </div>
      
          <div className="flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white ring-2 ring-slate-50 flex-shrink-0">
                {user.name?.[0]}
              </div>
              <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-slate-500 truncate" title={user.email || ""}>
                    {user.email}
                  </span>
              </div>
            </div>

            <div className="flex-shrink-0">
                <LogoutButton />
            </div>

          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 md:p-12 max-w-5xl mx-auto">
            <header className="mb-8 flex justify-between items-center md:hidden">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <Sparkles className="h-6 w-6" /> SmartPost
            </h1>
            <LogoutButton />
            </header>

            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-slate-900 tracking-tight">Gerador Mágico</h2>
                    <p className="text-lg text-slate-500">
                        O que vamos criar hoje?
                    </p>
                </div>

                <PostGenerator />
            </div>
        </div>
      </main>
    </div>
  )
}