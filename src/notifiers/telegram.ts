import { telegramBOT } from '../bots/telegram.bot'
import { Availability } from '../watchers/watcher.types'
import db from '../db'

export const telegramNotifier = (availability: Availability): void => {
  const { product, price } = availability

  const message = `*${
    product.name
  }* is available to buy for *${price?.toLocaleString('en-IN')}* right now!
[Visit Product Page](${product.url})
  `
  const usersToNotify = db
    .get('users')
    .filter(
      ({ platform, products }) =>
        platform === 'telegram' && products.includes(product.id),
    )
    .value()

  const notificationPromises = usersToNotify.map(({ id }) =>
    telegramBOT.telegram.sendMessage(id, message, {
      parse_mode: 'Markdown',
    }),
  )

  Promise.all(notificationPromises)
    .then(() =>
      console.log(`Everyone notified successfully about ${product.name}.`),
    )
    .catch(error =>
      console.error(
        `Failed to notify some people about ${product.name}.`,
        error.message,
      ),
    )
}
