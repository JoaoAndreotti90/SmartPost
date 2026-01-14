"use client"

import { signOut } from "next-auth/react"
import { LogOut, Trash2, AlertTriangle, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function LogoutButton() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteAccount() {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" })

      if (response.ok) {
        toast.success("Conta excluída.")
        signOut({ callbackUrl: "/" })
      } else {
        toast.error("Erro ao excluir.")
        setIsDeleting(false)
      }
    } catch (error) {
      toast.error("Erro de conexão.")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button 
            onClick={() => setShowDeleteModal(true)}
            title="Excluir Conta"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
            <Trash2 size={16} />
        </button>

        <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-2 rounded-lg transition-colors"
        >
            <LogOut size={16} />
            <span>Sair</span>
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Já vai embora?</h3>
            <p className="text-slate-500 mb-6 text-sm">Você precisará fazer login novamente para acessar seus posts.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition">Cancelar</button>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Sair</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border-2 border-red-100 animate-in zoom-in-95 duration-200">
             <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full text-red-600"><AlertTriangle size={24} /></div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Excluir conta?</h3>
                    <p className="text-sm text-red-600 font-medium mt-1">Essa ação é irreversível.</p>
                </div>
                <button onClick={() => setShowDeleteModal(false)} className="ml-auto text-slate-400 hover:text-slate-600"><X size={20} /></button>
             </div>
            <div className="bg-red-50 p-4 rounded-xl mb-6">
                <ul className="text-sm text-red-800 space-y-2 list-disc pl-4">
                    <li>Seus posts e créditos serão apagados.</li>
                    <li>Não é possível desfazer.</li>
                </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition">Cancelar</button>
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Excluir tudo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) 

}