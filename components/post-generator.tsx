"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Copy, Check, Wand2, Linkedin, Instagram, Twitter, 
  ChevronDown, Briefcase, Smile, Flame, Sparkles, Zap
} from "lucide-react"

const PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
]

const TONES = [
  { id: 'profissional', label: 'Profissional', icon: Briefcase, color: 'text-slate-600' },
  { id: 'engracado', label: 'Descontraído', icon: Smile, color: 'text-orange-500' },
  { id: 'urgente', label: 'Urgente / Vendas', icon: Flame, color: 'text-red-500' },
  { id: 'inspirador', label: 'Inspirador', icon: Zap, color: 'text-yellow-500' },
]

export function PostGenerator() {
  const [topic, setTopic] = useState("")
  
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [isPlatformOpen, setIsPlatformOpen] = useState(false)
  
  const [tone, setTone] = useState(TONES[0])
  const [isToneOpen, setIsToneOpen] = useState(false)

  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const closeMenus = () => {
    setIsPlatformOpen(false)
    setIsToneOpen(false)
  }

  async function handleGenerate() {
    if (!topic) {
      toast.warning("Digite um tema primeiro")
      return
    }
    setLoading(true)
    setGeneratedContent("")
    setCopied(false)
    closeMenus()

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone: tone.id, platform: platform.id })
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data.content)
        toast.success("Post criado com sucesso!")
        router.refresh()
      } else {
        toast.error(data.message || "Erro ao gerar")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedContent)
    toast.success("Copiado!")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 relative isolate">
      {(isPlatformOpen || isToneOpen) && (
        <div className="fixed inset-0 z-10 bg-transparent" onClick={closeMenus} />
      )}

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md relative">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <div className={`space-y-2 relative ${isPlatformOpen ? 'z-20' : 'z-auto'}`}>
            <label className="text-sm font-semibold text-slate-700">Onde vamos postar?</label>
            <div className="relative">
              <button
                type="button" 
                onClick={() => { setIsPlatformOpen(!isPlatformOpen); setIsToneOpen(false); }}
                className={`w-full p-3 pl-4 rounded-xl border flex items-center justify-between transition-all outline-none bg-white ${isPlatformOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <platform.icon size={20} className={platform.color} />
                  <span className="font-medium text-slate-900">{platform.label}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isPlatformOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPlatformOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setPlatform(p); 
                        setIsPlatformOpen(false); 
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-slate-50 ${p.id === platform.id ? 'bg-blue-50' : ''}`}>
                         <p.icon size={18} className={p.color} />
                      </div>
                      <span className={`text-sm font-medium ${p.id === platform.id ? 'text-slate-900' : 'text-slate-600'}`}>
                        {p.label}
                      </span>
                      {p.id === platform.id && <Check size={16} className="ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 relative ${isToneOpen ? 'z-20' : 'z-auto'}`}>
            <label className="text-sm font-semibold text-slate-700">Qual o tom de voz?</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setIsToneOpen(!isToneOpen); setIsPlatformOpen(false); }}
                className={`w-full p-3 pl-4 rounded-xl border flex items-center justify-between transition-all outline-none bg-white ${isToneOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <tone.icon size={20} className={tone.color} />
                  <span className="font-medium text-slate-900">{tone.label}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isToneOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToneOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation();
                        setTone(t); 
                        setIsToneOpen(false); 
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-slate-50 ${t.id === tone.id ? 'bg-blue-50' : ''}`}>
                         <t.icon size={18} className={t.color} />
                      </div>
                      <span className={`text-sm font-medium ${t.id === tone.id ? 'text-slate-900' : 'text-slate-600'}`}>
                        {t.label}
                      </span>
                      {t.id === tone.id && <Check size={16} className="ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-sm font-semibold text-slate-700">Sobre o que você quer falar?</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={closeMenus}
            placeholder="Ex: 3 dicas para melhorar a produtividade usando IA..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900 placeholder:text-slate-400 transition-all font-medium leading-relaxed"
            disabled={loading}
          />
        </div>

        <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              loading || !topic
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/25 hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                <Wand2 className="h-5 w-5" />
                Gerar Post Mágico
                </>
            )}
        </button>
      </div>

      {generatedContent && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md shadow-blue-50/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50/80 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Resultado Gerado
            </h3>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                copied ? "bg-green-100 text-green-700" : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="p-6 bg-white">
            <p className="whitespace-pre-wrap text-slate-800 text-[15px] leading-relaxed">
              {generatedContent}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}