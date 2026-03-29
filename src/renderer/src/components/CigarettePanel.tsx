import { useState, useEffect } from 'react'

interface CigaretteLog { date: string; status: string; package_count?: number; cost: number }

export default function CigarettePanel() {
  const [logs, setLogs] = useState<CigaretteLog[]>([])
  const [price, setPrice] = useState(120)
  const [count, setCount] = useState(1)

  const fetchLogs = async () => {
    const data = await window.ekonomiAPI.getCigaretteLogs()
    setLogs(data)
  }

  useEffect(() => { fetchLogs() }, [])

  // KAYIT FONKSİYONU
  const handleResult = async (hasBought: boolean) => {
    const dateObj = new Date()
    const todayStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
    
    // Almadıysa 120 TL kâr (negatif)
    const totalCost = hasBought ? count * price : -price 

    await window.ekonomiAPI.saveCigaretteLog({
      date: todayStr,
      status: hasBought ? 'BOUGHT' : 'NOT_BOUGHT',
      package_count: hasBought ? count : 0,
      cost: totalCost
    })
    fetchLogs()
  }

  // GEÇMİŞ GÜNE TIKLAMA (SON 3 GÜN)
  const handleDayClick = async (clickedDateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const clickedDate = new Date(clickedDateStr)
    clickedDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((today.getTime() - clickedDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays >= 0 && diffDays <= 3) {
      const currentLog = logs.find(l => l.date === clickedDateStr)
      const isBought = currentLog?.status === 'BOUGHT'
      
      await window.ekonomiAPI.saveCigaretteLog({
        date: clickedDateStr,
        status: isBought ? 'NOT_BOUGHT' : 'BOUGHT',
        package_count: isBought ? 0 : 1,
        cost: isBought ? -price : price 
      })
      fetchLogs()
    }
  }

  // --- İSTATİSTİK HESAPLAMALARI ---
  const totalPacks = logs.reduce((sum, log) => sum + (log.package_count || 0), 0)
  const totalSpent = logs.reduce((sum, log) => log.cost > 0 ? sum + log.cost : sum, 0)
  const totalSaved = logs.reduce((sum, log) => log.cost < 0 ? sum + Math.abs(log.cost) : sum, 0)
  
  // NET DURUM (KÂR / ZARAR)
  const netProfit = totalSaved - totalSpent
  const isProfit = netProfit >= 0

  // TAKVİM MANTIĞI
  const dateObj = new Date()
  const year = dateObj.getFullYear(); const month = dateObj.getMonth()
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
  const logMap: Record<string, CigaretteLog> = {}
  logs.forEach((log) => { logMap[log.date] = log })

  let firstDay = new Date(year, month, 1).getDay()
  let startDay = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const blanks = Array.from({ length: startDay })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const inputClass = "bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 text-center"

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center">
      <h2 className="text-xl font-bold text-sky-400 mb-4 w-full text-left pb-3 border-b border-slate-700">Sigara Takip & Tasarruf</h2>
      
      {/* 📊 İSTATİSTİK ÖZETİ (4 KART) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-6">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Toplam Paket</p>
          <p className="text-lg font-black text-slate-200">{totalPacks}</p>
        </div>
        <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center flex flex-col justify-center">
          <p className="text-[10px] text-rose-500 font-bold uppercase">Harcanan</p>
          <p className="text-lg font-black text-rose-400">{totalSpent.toLocaleString()} ₺</p>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center flex flex-col justify-center">
          <p className="text-[10px] text-emerald-500 font-bold uppercase">Tasarruf</p>
          <p className="text-lg font-black text-emerald-400">{totalSaved.toLocaleString()} ₺</p>
        </div>
        {/* NET DURUM KARTI */}
        <div className={`p-3 rounded-xl border text-center flex flex-col justify-center ${isProfit ? 'bg-sky-500/10 border-sky-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
          <p className={`text-[10px] font-bold uppercase ${isProfit ? 'text-sky-500' : 'text-orange-500'}`}>Net Durum</p>
          <p className={`text-lg font-black ${isProfit ? 'text-sky-400' : 'text-orange-400'}`}>
            {isProfit ? '+' : ''}{netProfit.toLocaleString()} ₺
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-6 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 w-full justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-300">Fiyat: <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`${inputClass} w-20`} /> ₺</div>
        <div className="flex items-center gap-2 text-sm text-slate-300">Adet: <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className={`${inputClass} w-16`} /></div>
      </div>
      
      <div className="flex gap-4 w-full mb-8">
        <button onClick={() => handleResult(true)} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/20">Aldım 🚬</button>
        <button onClick={() => handleResult(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20">Almadım 💰</button>
      </div>
      
      {/* TAKVİM */}
      <div className="w-full grid grid-cols-7 gap-2 text-center">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <div key={d} className="text-xs font-bold text-slate-500 mb-1">{d}</div>)}
        {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
        {days.map((dayNum) => {
          const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          const isToday = currentDateStr === todayStr
          const dayLog = logMap[currentDateStr]
          
          const targetDate = new Date(currentDateStr); targetDate.setHours(0,0,0,0)
          const todayDate = new Date(); todayDate.setHours(0,0,0,0)
          const diffDays = Math.ceil((todayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
          const isClickable = diffDays >= 0 && diffDays <= 3
          
          let boxClass = "flex flex-col justify-center items-center rounded-lg py-1 text-xs transition-all min-h-[45px] border "
          if (dayLog?.status === 'BOUGHT') boxClass += "bg-rose-500/10 border-rose-500/40 text-rose-400"
          else if (dayLog?.status === 'NOT_BOUGHT') boxClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
          else boxClass += "bg-slate-900/50 border-slate-700/30 text-slate-500"

          if (isToday) boxClass += " ring-1 ring-sky-500 font-bold"
          if (isClickable) boxClass += " cursor-pointer hover:border-sky-400/50"

          return (
            <div key={dayNum} className={boxClass} onClick={() => handleDayClick(currentDateStr)}>
              <span>{dayNum}</span>
              {dayLog?.status === 'BOUGHT' && <span className="text-[9px] font-bold">{dayLog.package_count}p</span>}
              {dayLog?.status === 'NOT_BOUGHT' && <span className="text-[9px]">💰</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}