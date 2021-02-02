import cheerio from 'cheerio'
import { getPageSource } from '../utils'

interface RPtechAvailability {
  available: boolean
  price?: number
  image?: string
}

/**
 *
 * @param itemLink Link to item from RPtech website
 */
export const rptechAvailability = async (
  itemLink: string,
): Promise<RPtechAvailability> => {
  const data = await getPageSource(itemLink)
  const $ = cheerio.load(data)
  // Can be 'In stock' or 'Out of stock'
  const status = $('.rs2').text().trim()
  const price = $('meta[itemprop=price]').attr('content')
  const image = $('img[src]#zoom_03').attr('src')

  return {
    available: status === 'In stock',
    price: price ? parseFloat(price) : undefined,
    image,
  }
}
