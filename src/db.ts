import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { Product } from './types'

interface DB {
  users: {
    [key: string]: {
      id: string
      type: string
      platform: 'telegram'
      products: string[]
    }
  }
  notifications: string[]
  products: Product[]
}

const adapter = new FileSync<DB>('db.json')
const db = low(adapter)
export default db
