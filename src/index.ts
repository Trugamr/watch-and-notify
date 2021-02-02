// Loading Environmental Variables
import dotenv from 'dotenv'
dotenv.config()

// Import watchers
import { rptechWatcher } from './watchers/rptech'

// Start Telegram BOT
import './notifiers/telegram'
import { telegramNotifier } from './notifiers/telegram'

// Other Imports
import cron from 'node-cron'
import { Notifier } from './notifiers/notifier.types'
import { Links } from './links.types'

const links: Links = {
  rptech: [
    'https://rptechindia.in/nvidia-geforce-rtx-3060-ti.html',
    'https://rptechindia.in/catalog/product/view/id/406/s/igame-graphic-card-geforce-rtx-2080-ti-advanced-oc-v-iggfrtx2080tiadvoc/',
  ],
}

const notifiers: Notifier[] = [telegramNotifier]

// Start watching and notifying,
// Runs every watcher every 30 seconds and notifies if product is available
cron.schedule('*/30 * * * * *', () => {
  if (links.rptech) {
    links.rptech.forEach(async link => {
      const availability = await rptechWatcher(link)
      if (availability.available)
        notifiers.forEach(notify => notify(availability))
    })
  }
})
