import { reducer } from './store'
import { MoraleMonitor as reactClass } from './ui'
import { observeAll } from './observers'
import { Settings as settingsClass } from './ui/settings'

// for observer
let unsubscribe = null

const pluginDidLoad = () => {
  if (unsubscribe !== null) {
    console.error(`unsubscribe function should be null`)
  }
  unsubscribe = observeAll()
}

const pluginWillUnload = () => {
  if (typeof unsubscribe !== 'function') {
    console.error(`invalid unsubscribe function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }
}

export {
  pluginDidLoad,
  pluginWillUnload,

  reactClass,
  reducer,
  settingsClass,
}
