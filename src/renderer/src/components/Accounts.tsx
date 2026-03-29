import { useState, useEffect } from 'react'

interface Account { id?: number; name: string; balance: number; currency?: string }
interface Debt { id?: number; title: string; amount: number; due_date: string }

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  
  // Yeni Hesap Ekleme State'leri
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [currency, setCurrency] = useState('TRY')
  
  // Düzenleme (Edit) State'leri
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editBalance, setEditBalance] = useState('')
  const [editCurrency, setEditCurrency] = useState('TRY')

  const [usdtRate, setUsdtRate] = useState<number>(32.5)
  const TARGET_USDT = 5000 

  const fetchData = async () => {
    try {
      const [accData, debtData] = await Promise.all([
        window.ekonomiAPI.getAccounts(),
        window.ekonomiAPI.getDebts()
      ])
      setAccounts(accData)
      setDebts(debtData)

      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY')
      const json = await res.json()
      if (json.price) setUsdtRate(parseFloat(json.price))
    } catch (error) {
      console.error("Veri çekilemedi:", error)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Yeni Hesap Ekle
  const handleAddAccount = async () => {
    if (!name || !balance) return alert("Lütfen tüm bilgileri giriniz!")
    await window.ekonomiAPI.addAccount({ name, balance: parseFloat(balance), currency })
    setName(''); setBalance(''); fetchData()
  }

  // Düzenleme Modunu Başlat
  const startEditing = (acc: Account) => {
    setEditingId(acc.id!)
    setEditName(acc.name)
    setEditBalance(acc.balance.toString())
    setEditCurrency(acc.currency || 'TRY')
  }

  // Düzenlemeyi Kaydet (Artık hem bakiye hem isim güncelleniyor)
  const saveEdit = async (id: number) => {
    if (!editName || !editBalance) return alert("Alanlar boş bırakılamaz!")
    
    // Not: main/index.ts içinde update-account handler'ını hem name hem balance alacak şekilde güncellediysen burası harika çalışır
    await window.ekonomiAPI.updateAccount({ 
      id, 
      name: editName, 
      balance: parseFloat(editBalance),
      currency: editCurrency 
    })
    
    setEditingId(null)
    fetchData()
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu hesabı silmek istediğine emin misin?")) {
      await window.ekonomiAPI.deleteAccount(id)
      fetchData()
    }
  }

  // --- HESAPLAMALAR ---
  const totalAssetsTRY = accounts.reduce((total, acc) => {
    return acc.currency === 'USDT' ? total + (acc.balance * usdtRate) : total + acc.balance
  }, 0)

  const totalDebtsTRY = debts.reduce((total, debt) => total + debt.amount, 0)
  const netBalanceTRY = totalAssetsTRY - totalDebtsTRY
  const netBalanceUSDT = netBalanceTRY / usdtRate
  const progressPercent = Math.min((netBalanceUSDT / TARGET_USDT) * 100, 100)

  const inputClass = "bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors text-sm"

  return (
    <div className="space-y-6">
      {/* ÜST ÖZET VE HEDEF KARTLARI (Kod kalabalığı olmasın diye öncekiyle aynı mantıkta devam ediyor) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs font-bold mb-1 uppercase">Varlıklar</p>
          <h3 className="text-xl font-black text-emerald-400">{totalAssetsTRY.toLocaleString('tr-TR')} ₺</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-xs font-bold mb-1 uppercase">Borçlar</p>
          <h3 className="text-xl font-black text-rose-400">-{totalDebtsTRY.toLocaleString('tr-TR')} ₺</h3>
        </div>
        <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl shadow-lg">
          <p className="text-sky-500 text-xs font-bold mb-1 uppercase font-mono tracking-tighter">Net USDT (Kur: {usdtRate.toFixed(2)})</p>
          <h3 className="text-xl font-black text-white">{netBalanceUSDT.toLocaleString('en-US', { maximumFractionDigits: 2 })} $</h3>
        </div>
      </div>

      {/* İLERLEME ÇUBUĞU */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-300">Hedef: 5000 USDT</span>
          <span className="text-sky-400 font-black">%{progressPercent.toFixed(1)}</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* HESAP LİSTESİ */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h2 className="text-lg font-bold text-sky-400 mb-5 pb-3 border-b border-slate-700">Hesap Yönetimi</h2>
        
        <div className="space-y-3">
          {accounts.map((acc) => {
            // DÜZENLEME MODU AÇIKSA
            if (editingId === acc.id) {
              return (
                <div key={acc.id} className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-3 shadow-inner">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClass} placeholder="Hesap İsmi" />
                    <div className="flex gap-2">
                      <input type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} className={`${inputClass} w-2/3`} placeholder="Bakiye" />
                      <select value={editCurrency} onChange={(e) => setEditCurrency(e.target.value)} className={`${inputClass} w-1/3`}>
                        <option value="TRY">₺</option>
                        <option value="USDT">$</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(acc.id!)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded-lg text-xs font-bold transition-all">Güncellemeyi Kaydet</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-1.5 rounded-lg text-xs font-bold transition-all">İptal</button>
                  </div>
                </div>
              )
            }

            // NORMAL GÖRÜNÜM
            return (
              <div key={acc.id} className="group flex justify-between items-center py-3 px-4 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:border-sky-500/40 transition-all">
                <div>
                  <p className="text-slate-300 font-semibold">{acc.name}</p>
                  <p className={`text-xs font-bold ${acc.currency === 'USDT' ? 'text-sky-500' : 'text-emerald-500'}`}>
                    {acc.balance.toLocaleString()} {acc.currency === 'USDT' ? '$' : '₺'}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <button onClick={() => startEditing(acc)} className="text-[10px] text-sky-400 hover:underline uppercase tracking-widest font-bold">Düzenle</button>
                  <button onClick={() => handleDelete(acc.id!)} className="text-[10px] text-rose-500 hover:underline uppercase tracking-widest font-bold">Sil</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* YENİ HESAP EKLEME FORMU */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase ml-1">Yeni Hesap Tanımla</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Banka/Borsa Adı" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <div className="flex gap-2">
              <input type="number" placeholder="Miktar" value={balance} onChange={(e) => setBalance(e.target.value)} className={`${inputClass} w-2/3`} />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`${inputClass} w-1/3`}>
                <option value="TRY">TRY</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>
          <button onClick={handleAddAccount} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
            Hesabı Sisteme Ekle
          </button>
        </div>
      </div>
    </div>
  )
}