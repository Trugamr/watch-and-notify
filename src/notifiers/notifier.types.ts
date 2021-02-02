import { Availability } from '../watchers/watcher.types'

export type Notifier = (availability: Availability) => Promise<void> | void
