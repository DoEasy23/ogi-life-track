import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db, { initDB } from './database'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,       // Geniş ekran
    height: 800,       // Yüksek ekran
    minWidth: 1024,    // Minimum genişlik
    minHeight: 700,    // Minimum yükseklik
    show: false,
    autoHideMenuBar: true, // Üst menüyü gizle
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ANA İŞLEMCİ: Uygulama hazır olduğunda tek bir kez çalışır
app.whenReady().then(async () => {
  // 1. VERİTABANINI BAŞLAT
  await initDB()

  // 2. WİNDOWS BAŞLANGICINDA OTOMATİK ÇALIŞTIRMA (Sadece .exe yapıldığında çalışır)
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe'),
    })
  }

  // 3. ELEKTRON AYARLARI
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 4. IPC KANALLARI (Veritabanı İletişimi)
  
  // -- Hesaplar --
  ipcMain.handle('get-accounts', async () => {
    return new Promise((resolve) => {
      db.all("SELECT * FROM accounts", [], (_err, rows) => resolve(rows || []))
    })
  })

  ipcMain.handle('add-account', async (_event, { name, balance, currency }) => {
    return new Promise((resolve) => {
      db.run("INSERT INTO accounts (name, balance, currency) VALUES (?, ?, ?)", [name, balance, currency || 'TRY'], (err) => resolve({ success: !err }))
    })
  })

ipcMain.handle('update-account', async (_event, { id, name, balance, currency }) => {
  return new Promise((resolve) => {
    db.run(
      "UPDATE accounts SET name = ?, balance = ?, currency = ? WHERE id = ?",
      [name, balance, currency, id],
      (err) => resolve({ success: !err })
    )
  })
})

  ipcMain.handle('delete-account', async (_event, id) => {
    return new Promise((resolve) => {
      db.run("DELETE FROM accounts WHERE id = ?", [id], (err) => resolve({ success: !err }))
    })
  })

  // -- Borçlar --
  ipcMain.handle('get-debts', async () => {
    return new Promise((resolve) => {
      db.all("SELECT * FROM debts ORDER BY due_date ASC", [], (_err, rows) => resolve(rows || []))
    })
  })

  ipcMain.handle('add-debt', async (_event, { title, amount, due_date }) => {
    return new Promise((resolve) => {
      db.run("INSERT INTO debts (title, amount, due_date) VALUES (?, ?, ?)", [title, amount, due_date], (err) => resolve({ success: !err }))
    })
  })

  ipcMain.handle('update-debt', async (_event, { id, amount, due_date }) => {
    return new Promise((resolve) => {
      db.run("UPDATE debts SET amount = ?, due_date = ? WHERE id = ?", [amount, due_date, id], (err) => resolve({ success: !err }))
    })
  })

  // -- Sigara Takvimi --
  ipcMain.handle('get-cigarette-logs', async () => {
    return new Promise((resolve) => {
      db.all("SELECT * FROM cigarette_log", [], (_err, rows) => resolve(rows || []))
    })
  })

  ipcMain.handle('save-cigarette-log', async (_event, { date, status, package_count, cost }) => {
    return new Promise((resolve) => {
      const query = `INSERT OR REPLACE INTO cigarette_log (date, status, package_count, cost) VALUES (?, ?, ?, ?)`
      db.run(query, [date, status, package_count, cost], (err) => resolve({ success: !err }))
    })
  })

  // -- Ek Kartlar --
  ipcMain.handle('get-ek-kart-logs', async () => {
    return new Promise((resolve) => {
      db.all("SELECT * FROM ek_kart_logs ORDER BY date DESC", [], (_err, rows) => resolve(rows || []))
    })
  })

  ipcMain.handle('add-ek-kart-log', async (_event, { card_holder, amount, description, date }) => {
    return new Promise((resolve) => {
      db.run("INSERT INTO ek_kart_logs (card_holder, amount, description, date) VALUES (?, ?, ?, ?)", 
      [card_holder, amount, description, date], (err) => resolve({ success: !err }))
    })
  })

  // 5. PENCEREYİ OLUŞTUR
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Tüm pencereler kapandığında uygulamadan çık
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})