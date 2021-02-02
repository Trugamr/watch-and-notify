// Loading Environmental Variables
import dotenv from 'dotenv'
dotenv.config()

import { Notifier } from './notifiers/notifier.types'

// Start Telegram BOT
import './bots/telegram.bot'

// Import watchers
import { rptechWatcher } from './watchers/rptech'

// Import notifiers
import { telegramNotifier } from './notifiers/telegram'

// Other Imports
import cron from 'node-cron'

// Import db
import db from './db'

const notifiers: Notifier[] = [telegramNotifier]

// Start watching and notifying,
// Runs every watcher every 30 seconds and notifies if product is available
cron.schedule('*/30 * * * * *', () => {
  const rptechProducts = db
    .get('products')
    .filter(({ site }) => site === 'rptech')
    .value()

  rptechProducts.forEach(async product => {
    const availability = await rptechWatcher(product)
    if (availability.available) {
      notifiers.forEach(notify => notify(availability))
    }
  })
})
