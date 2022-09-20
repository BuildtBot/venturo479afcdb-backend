/* eslint-disable no-unused-vars */
import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

// Connection URL
const url = getURL()
const client = new MongoClient(url)

// Database Name
const dbName = 'MongoDB'
let db: Db | undefined

export async function getDB (): Promise<Db> {
  console.info('Connecting to ', url)
  if (!db) {
    await client.connect()
    // eslint-disable-next-line no-undef
    console.info(`Database connected successfully to server ${url}`)
    db = client.db(dbName)
  }
  return db
}

function getURL () : string {
  const db = process.env.DATABASE_URL!
  const split = '://'
  const [protocol, domain] = db.split(split)
  const username = process.env.DATABASE_USER
  const password = process.env.DATABASE_PASSWORD
  return `${protocol}${split}${username}:${password}@${domain}`
}
