import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft, Calendar, Sparkles } from "lucide-react"
import { HistorySearch } from "@/components/history-search"

interface HistoryProps {
  searchParams: Promise<{ q?: string }>
}

export default async function History(props: HistoryProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const searchParams = await props.searchParams
  const query = searchParams?.q || ""

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } }
          ]
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!user) redirect("/")

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2.5 bg-white rounded-xl hover:bg-slate-50 hover:shadow-sm transition border border-slate-200 group">
                <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-900" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Seu Histórico</h1>
                <p className="text-slate-500 mt-1">Gerencie e encontre suas criações.</p>
            </div>
          </div>
        </div>

        <HistorySearch />

        <div className="grid gap-6">
            {user.posts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {query ? "Nenhum resultado encontrado" : "Nenhum post por aqui... ainda!"}
                    </h2>
                    <p className="text-slate-500 mb-6 max-w-md">
                      {query ? `Não encontramos nada com "${query}". Tente outro termo.` : "Sua jornada de conteúdo viral começa agora. Vamos criar algo incrível?"}
                    </p>
                    {!query && (
                      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                          Criar meu primeiro post
                      </Link>
                    )}
                </div>
            ) : (
                user.posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {post.title || "Sem título"}
                            </h2>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm whitespace-nowrap">
                                <Calendar size={14} />
                                {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </span>
                        </div>
                        <div className="p-6 bg-white">
                            <div className="prose prose-slate max-w-none prose-p:leading-relaxed text-sm line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                <p className="whitespace-pre-wrap text-slate-700">{post.content}</p>
                            </div>
                             <div className="mt-4 pt-4 border-t border-slate-50 text-center md:hidden">
                                <span className="text-xs font-medium text-blue-600">Toque para expandir</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}