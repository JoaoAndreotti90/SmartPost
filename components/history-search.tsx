"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export function HistorySearch() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [term, setTerm] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set("q", term)
      } else {
        params.delete("q")
      }
      replace(`/history?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [term, searchParams, replace])

  return (
    <div className="relative mb-8">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Pesquisar seus posts..."
        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm placeholder:text-slate-400 font-medium"
      />
    </div>
  )
}