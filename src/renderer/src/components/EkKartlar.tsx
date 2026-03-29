import { useState, useEffect } from 'react'

interface EkKartLog { id?: number; card_holder: string; amount: number; description: string; date: string }

export default function EkKartlar() {
  const [logs, setLogs] = useState<EkKartLog[]>([])
  const [holder, setHolder] = useState('Babam')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')

  const fetchLogs = async () => setLogs(await window.ekonomiAPI.getEkKartLogs())
  useEffect(() => { fetchLogs() }, [])

  const handleAdd = async () => {
    if (!amount) return
    await window.ekonomiAPI.addEkKartLog({
      card_holder: holder,
      amount: parseFloat(amount),
      description: desc,
      date: new Date().toISOString().split('T')[0]
    })
    setAmount(''); setDesc(''); fetchLogs()
  }

  const totalAbla = logs.filter(l => l.card_holder === 'Ablam').reduce((t, l) => t + l.amount, 0)
  const totalBaba = logs.filter(l => l.card_holder === 'Babam').reduce((t, l) => t + l.amount, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Özet Kartları */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-sky-400 mb-6 pb-2 border-b border-slate-700">Harcama Ekle</h2>
          <div className="space-y-4">
            <select value={holder} onChange={(e) => setHolder(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option value="Babam">Babamın Kartı</option>
              <option value="Ablam">Ablamın Kartı</option>
            </select>
            <input type="number" placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2" />
            <input type="text" placeholder="Açıklama (Örn: Yemek)" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2" />
            <button onClick={handleAdd} className="w-full bg-sky-600 hover:bg-sky-500 py-2.5 rounded-lg font-bold">Kaydet</button>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Babam Toplam:</span>
            <span className="text-rose-400 font-bold">{totalBaba.toLocaleString()} ₺</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Ablam Toplam:</span>
            <span className="text-rose-400 font-bold">{totalAbla.toLocaleString()} ₺</span>
          </div>
          <div className="pt-4 border-t border-slate-700 flex justify-between">
            <span className="font-bold">Genel Toplam:</span>
            <span className="text-xl text-white font-black">{(totalAbla + totalBaba).toLocaleString()} ₺</span>
          </div>
        </div>
      </div>

      {/* 2. Harcama Listesi */}
      <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <h2 className="text-xl font-bold text-sky-400 mb-4">Son Harcamalar</h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {logs.map(log => (
            <div key={log.id} className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
              <div>
                <p className="font-bold text-slate-200">{log.description || 'İsimsiz Harcama'}</p>
                <p className="text-xs text-slate-500">{log.date} - {log.card_holder}</p>
              </div>
              <span className="text-rose-400 font-bold">-{log.amount} ₺</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}