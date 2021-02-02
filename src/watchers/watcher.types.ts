export interface Availability {
  link: string
  productName: string
  available: boolean
  price?: number
  image?: string
}

export type Watcher = (link: string) => Promise<Availability> | Availability
