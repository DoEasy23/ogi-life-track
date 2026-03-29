import { contextBridge, ipcRenderer } from 'electron'

// React'in çağıracağı fonksiyonlar
const api = {
  getAccounts: () => ipcRenderer.invoke('get-accounts'),
  addAccount: (data) => ipcRenderer.invoke('add-account', data),
  deleteAccount: (id) => ipcRenderer.invoke('delete-account', id),
  getDebts: () => ipcRenderer.invoke('get-debts'),
  addDebt: (data) => ipcRenderer.invoke('add-debt', data),
  // Diğer ipcRenderer.invoke fonksiyonlarının yanına bunu ekle
updateDebt: (data) => ipcRenderer.invoke('update-debt', data),
  getCigaretteLogs: () => ipcRenderer.invoke('get-cigarette-logs'),
  saveCigaretteLog: (data) => ipcRenderer.invoke('save-cigarette-log', data),
  updateAccount: (data) => ipcRenderer.invoke('update-account', data),
  // IElectronAPI içine ekle:
getEkKartLogs: () => ipcRenderer.invoke('get-ek-kart-logs'),
  addEkKartLog: (data) => ipcRenderer.invoke('add-ek-kart-log', data)
}

// Güvenli bir şekilde ana dünyaya (React'e) aktar
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ekonomiAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (TypeScript hatasını yoksaymak için)
  window.ekonomiAPI = api
}