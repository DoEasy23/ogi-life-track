import { useState, useEffect } from 'react'

interface Debt { id?: number; title: string; amount: number; due_date: string }

export default function Debts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [title, setTitle] = useState(''); const [amount, setAmount] = useState(''); const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [editAmount, setEditAmount] = useState(''); const [editDate, setEditDate] = useState('')

  const fetchDebts = async () => { setDebts(await window.ekonomiAPI.getDebts()) }
  useEffect(() => { fetchDebts() }, [])

  const handleAddDebt = async () => {
    if (!title || !amount || !dueDate) return alert("Tüm alanları doldur!")
    await window.ekonomiAPI.addDebt({ title, amount: parseFloat(amount), due_date: dueDate })
    setTitle(''); setAmount(''); setDueDate(''); fetchDebts()
  }

  const startEditing = (debt: Debt) => { setEditingId(debt.id!); setEditAmount(debt.amount.toString()); setEditDate(debt.due_date) }

  const saveEdit = async (id: number) => {
    if (!editAmount || !editDate) return alert("Boş alan bırakamazsın!")
    await window.ekonomiAPI.updateDebt({ id, amount: parseFloat(editAmount), due_date: editDate })
    setEditingId(null); fetchDebts()
  }

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl h-fit space-y-4">
        <h2 className="text-xl font-bold text-sky-400 pb-3 border-b border-slate-700">Borç Ekle</h2>
        <input type="text" placeholder="Kime? (Örn: Kredi Kartı)" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        <input type="number" placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        <div>
          <label className="text-xs text-slate-400 ml-1 mb-1 block">Ödeme Tarihi Seç:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
        </div>
        <button onClick={handleAddDebt} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-rose-900/20 mt-2">Borcu Kaydet</button>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-sky-400 pb-3 border-b border-slate-700 mb-4">Ödeme Takvimi</h2>
        <div className="space-y-3">
          {debts.length > 0 ? debts.map((debt) => {
            const debtDate = new Date(debt.due_date)
            const diffDays = Math.ceil((debtDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            const isCritical = diffDays <= 3 && diffDays >= 0
            
            if (editingId === debt.id) {
              return (
                <div key={debt.id} className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/50 shadow-inner">
                  <b className="text-amber-400 mb-2 block">{debt.title}</b>
                  <div className="flex gap-2 mb-3">
                    <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className={`${inputClass} w-1/3`} />
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className={`${inputClass} w-2/3`} />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded text-sm font-semibold transition-colors" onClick={() => saveEdit(debt.id!)}>Kaydet</button>
                    <button className="flex-1 bg-slate-600 hover:bg-slate-500 py-1.5 rounded text-sm font-semibold transition-colors" onClick={() => setEditingId(null)}>İptal</button>
                  </div>
                </div>
              )
            }

            return (
              <div key={debt.id} className={`bg-slate-900/40 p-4 rounded-xl border-l-4 transition-all ${isCritical ? 'border-rose-500 animate-blink shadow-lg shadow-rose-900/20' : 'border-sky-500 border-y border-r border-y-slate-700/50 border-r-slate-700/50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <b className="text-slate-200 text-lg">{debt.title}</b>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-400 font-bold">{debt.amount.toLocaleString('tr-TR')} ₺</span>
                    <button onClick={() => startEditing(debt)} className="text-sky-400 hover:text-sky-300 text-xs underline decoration-sky-400/30 underline-offset-4 transition-colors">Düzenle</button>
                  </div>
                </div>
                <div className={`text-xs ${isCritical ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                  Son Gün: {debt.due_date} ({diffDays < 0 ? 'Gecikti!' : `${diffDays} gün kaldı`})
                </div>
              </div>
            )
          }) : <p className="text-slate-500 text-sm">Kayıtlı borç yok.</p>}
        </div>
      </div>
    </div>
  )
}