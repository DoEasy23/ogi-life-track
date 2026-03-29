import sqlite3 from 'sqlite3'
import path from 'path'
import { app } from 'electron'

// İsmi v3 yaptık ki tertemiz, yeni sütunlu bir veritabanı oluşsun
const dbPath = path.join(app.getPath('userData'), 'finance_v3.db')
const db = new sqlite3.Database(dbPath)

export function initDB() {
  return new Promise((resolve) => {
    db.serialize(() => {
      // DİKKAT: currency TEXT eklendi!
      db.run(`CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, balance REAL, currency TEXT DEFAULT 'TRY')`)
      db.run(`CREATE TABLE IF NOT EXISTS debts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL, due_date TEXT)`)
      db.run(`CREATE TABLE IF NOT EXISTS cigarette_log (date TEXT PRIMARY KEY, status TEXT, package_count INTEGER, cost REAL)`)
      db.run(`CREATE TABLE IF NOT EXISTS ek_kart_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, card_holder TEXT, amount REAL, description TEXT, date TEXT)`)
      resolve(true)
    })
  })
}

export default db