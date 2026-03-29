export default function Navbar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const btnBase = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md text-sm"
  const activeStyle = "bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/30"
  const inactiveStyle = "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-slate-700"

  return (
    <div className="flex flex-wrap gap-3 mb-8 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 w-fit backdrop-blur-sm">
      <button className={`${btnBase} ${activeTab === 'main' ? activeStyle : inactiveStyle}`} onClick={() => setActiveTab('main')}>
        🏠 Bakiyeler
      </button>
      <button className={`${btnBase} ${activeTab === 'debts' ? activeStyle : inactiveStyle}`} onClick={() => setActiveTab('debts')}>
        💸 Borçlar
      </button>
      <button className={`${btnBase} ${activeTab === 'cigarette' ? activeStyle : inactiveStyle}`} onClick={() => setActiveTab('cigarette')}>
        🚬 Sigara
      </button>
      <button className={`${btnBase} ${activeTab === 'ekkart' ? activeStyle : inactiveStyle}`} onClick={() => setActiveTab('ekkart')}>
        💳 Ek Kart
      </button>
      <button className={`${btnBase} ${activeTab === 'settings' ? activeStyle : inactiveStyle}`} onClick={() => setActiveTab('settings')}>
        ⚙️ Ayarlar
      </button>
    </div>
  )
}