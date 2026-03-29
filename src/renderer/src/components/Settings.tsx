import { useState, useEffect } from 'react'

interface Account { id?: number; name: string; balance: number }

export default function Settings() {
  const [accounts, setAccounts] = useState<Account[]>([])

  const fetchAccounts = async () => { setAccounts(await window.ekonomiAPI.getAccounts()) }
  useEffect(() => { fetchAccounts() }, [])

  const handleDelete = async (id: number) => {
    if (confirm("Bu hesabı silmek istediğine emin misin?")) {
      await window.ekonomiAPI.deleteAccount(id); fetchAccounts()
    }
  }

  return (
    <div className="max-w-2xl bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-sky-400 pb-3 border-b border-slate-700 mb-4">Hesap Yönetimi</h2>
      <div className="space-y-2">
        {accounts.length > 0 ? (
          accounts.map((acc) => (
            <div key={acc.id} className="flex justify-between items-center py-2 px-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
              <span className="text-slate-300 font-medium">{acc.name}</span>
              <button onClick={() => acc.id && handleDelete(acc.id)} className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-rose-600/20 hover:border-transparent">
                SİL
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">Silinecek hesap yok.</p>
        )}
      </div>
    </div>
  )
}