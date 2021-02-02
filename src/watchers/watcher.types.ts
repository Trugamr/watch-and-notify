import { Product } from '../types'

export interface Availability {
  product: Product
  available: boolean
  price?: number
  image?: string
}

export type Watcher = (product: Product) => Promise<Availability> | Availability
