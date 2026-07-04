import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const databasePath = path.resolve(__dirname, '..', 'topup.sqlite')
const SQL = await initSqlJs({
  locateFile: (file) => path.resolve(__dirname, '..', 'node_modules', 'sql.js', 'dist', file),
})

const fileBuffer = fs.existsSync(databasePath) ? fs.readFileSync(databasePath) : null
const db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database()

const init = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT UNIQUE,
      serverId TEXT,
      username TEXT,
      validatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flowId TEXT,
      userId TEXT,
      serverId TEXT,
      username TEXT,
      supplierCheckoutRequest TEXT,
      supplierCheckoutResult TEXT,
      supplierDeliveryRequest TEXT,
      supplierDeliveryResult TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS server_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      server TEXT,
      supplierName TEXT,
      active INTEGER
    );
  `)
}

const saveDb = () => {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(databasePath, buffer)
}

init()

export { db, saveDb }
