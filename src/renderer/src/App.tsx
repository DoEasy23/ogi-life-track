import { useState } from 'react'
import Navbar from './components/Navbar'
import Accounts from './components/Accounts'
import Debts from './components/Debts'
import CigarettePanel from './components/CigarettePanel'
import Settings from './components/Settings'
import EkKartlar from './components/EkKartlar'

export default function App() {
  const [activeTab, setActiveTab] = useState('main')

  return (
    <div className="max-w-5xl mx-auto">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'main' && (
        <div className="max-w-2xl">
          <Accounts />
        </div>
      )}

      {activeTab === 'debts' && <Debts />}
      
      {activeTab === 'cigarette' && (
        <div className="max-w-2xl">
          <CigarettePanel />
        </div>
      )}

      {activeTab === 'ekkart' && <EkKartlar />}

      
      {activeTab === 'settings' && <Settings />}
    </div>
  )
}