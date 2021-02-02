import { Telegraf } from 'telegraf'
import db from '../db'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN as string

export const telegramBOT = new Telegraf(TOKEN)

telegramBOT.command('me', ctx => {
  ctx.reply(JSON.stringify(ctx.chat, null, 2))
})

telegramBOT.command('register', ctx => {
  const { chat } = ctx
  if (!chat) return

  try {
    db.get('users')
      .set(chat.id, { ...chat, platform: 'telegram', products: [] })
      .write()
    ctx.reply('Thanks for registering, you can now use other commands.')
  } catch (error) {
    ctx.reply('Failed to register, try again later.')
  }
})

telegramBOT.command('unregister', ctx => {
  const { chat } = ctx
  if (!chat) return

  try {
    db.get('users').unset(chat.id).write()
    ctx.reply('Un-registerd successfully.')
  } catch (error) {
    ctx.reply('Failed to un-register, try again later.')
  }
})

telegramBOT.command('products', ctx => {
  const products = db.get('products').sortBy('id').value()
  const message = products.reduce(
    (acc, { name, id }) => `${acc}\n${id}. ${name}`,
    '',
  )
  ctx.reply(message)
})

telegramBOT.command(['sub', 'subscribe'], ctx => {
  const { chat } = ctx
  const [, id] = ctx.message.text.split(' ')

  if (id) {
    const product = db.get('products').find({ id }).value()
    if (product && chat?.id) {
      const userProducts = db.get('users').get(chat.id).get('products')
      if (userProducts.value().includes(product.id))
        return ctx.reply('You are already subbed to this product.')
      userProducts.push(product.id).write()
      ctx.reply(
        `You will be notified whenever *${product.name}* comes in stock.`,
        {
          parse_mode: 'Markdown',
        },
      )
    } else {
      return ctx.reply('Invalid product id.')
    }
  } else {
    ctx.reply('Provide id of product to subscribe to.')
  }
})

telegramBOT.command(['unsub', 'unsubscribe'], ctx => {
  const { chat } = ctx
  const [, id] = ctx.message.text.split(' ')

  if (id) {
    const product = db.get('products').find({ id }).value()
    if (product && chat?.id) {
      const userProducts = db.get('users').get(chat.id).get('products')
      if (userProducts.value().includes(product.id)) {
        userProducts.pull(product.id).write()
        return ctx.reply(`Unsubscribed from *${product.name}* updates.`, {
          parse_mode: 'Markdown',
        })
      } else {
        return ctx.reply('You are already unsubscribed from this product.')
      }
    } else {
      return ctx.reply('Invalid product id.')
    }
  } else {
    ctx.reply('Provide id of product to subscribe to.')
  }
})

telegramBOT.command(['subs', 'subscriptions'], ctx => {
  const { chat } = ctx

  if (chat?.id) {
    const userProducts = db.get('users').get(chat.id).get('products').value()
    const subscribedProducts = db
      .get('products')
      .filter(({ id }) => userProducts.includes(id))
      .value()

    if (subscribedProducts.length) {
      const message = subscribedProducts.reduce(
        (acc, { name, id }) => `${acc}\n${id}. ${name}`,
        '',
      )
      ctx.reply(message)
    } else {
      ctx.reply('You are not subscribed to any product.')
    }
  }
})

telegramBOT.launch()
