import cheerio from 'cheerio'
import { getPageSource } from '../utils'
import { Availability, Watcher } from './watcher.types'

/**
 *
 * @param itemLink Link to item from RPtech website
 */
export const rptechWatcher: Watcher = async (
  link: string,
): Promise<Availability> => {
  const data = await getPageSource(link)
  const $ = cheerio.load(data)

  const productName = $('.product-title').text().trim()
  // Can be 'In stock' or 'Out of stock'
  const status = $('.rs2').text().trim()
  const price = $('meta[itemprop=price]').attr('content')
  const image = $('img[src]#zoom_03').attr('src')

  return {
    link,
    productName,
    available: status === 'In stock',
    price: price ? parseFloat(price) : undefined,
    image,
  }
}
