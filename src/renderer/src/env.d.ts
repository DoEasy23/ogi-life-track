export {}

// Veri Tiplerimizi Tanımlıyoruz (any yerine bunları kullanacağız)
export interface Account {
  id?: number
  name: string
  balance: number
  currency?: string // Yeni ekledik!
}
export interface EkKartLog { id?: number; card_holder: string; amount: number; description: string; date: string }


export interface Debt {
  id?: number
  title: string
  amount: number
  due_date: string
}

export interface CigaretteLog {
  date: string
  status: string
  count?: number
  package_count?: number
  cost: number
}

// Köprümüzün Tipleri
export interface IElectronAPI {
  getAccounts: () => Promise<Account[]>
  addAccount: (data: Account) => Promise<{ success: boolean; id?: number }>
  deleteAccount: (id: number) => Promise<{ success: boolean }>
  getDebts: () => Promise<Debt[]>
  addDebt: (data: Debt) => Promise<{ success: boolean }>
  getCigaretteLogs: () => Promise<CigaretteLog[]>
  saveCigaretteLog: (data: CigaretteLog) => Promise<{ success: boolean }>
  // Diğerlerinin altına bunu ekle
updateDebt: (data: { id: number; amount: number; due_date: string }) => Promise<{ success: boolean }>
updateAccount: (data: { id: number; name: string; balance: number; currency: string }) => Promise<{ success: boolean }>
// IElectronAPI içine ekle:
getEkKartLogs: () => Promise<EkKartLog[]>
addEkKartLog: (data: EkKartLog) => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    ekonomiAPI: IElectronAPI
  }
}