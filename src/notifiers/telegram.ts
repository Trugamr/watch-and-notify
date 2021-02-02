import { Telegraf } from 'telegraf'
import { Availability } from '../watchers/watcher.types'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN as string
const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID as string

const bot = new Telegraf(TOKEN)

bot.command('me', ctx => {
  ctx.reply(JSON.stringify(ctx.chat, null, 2))
})

bot.launch()

export const telegramNotifier = (availability: Availability): void => {
  const { productName, price, link } = availability

  const message = `*${productName}* is available to buy for *${price?.toLocaleString(
    'en-IN',
  )}* right now!
[Visit Product Page](${link})
  `

  bot.telegram.sendMessage(TELEGRAM_USER_ID, message, {
    parse_mode: 'Markdown',
  })
}
