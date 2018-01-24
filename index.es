import { reducer } from './store'
import { MoraleMonitor as reactClass } from './ui'
import {
  globalSubscribe as pluginDidLoad,
  globalUnsubscribe as pluginWillUnload,
} from './observers'
import { Settings as settingsClass } from './ui/settings'

export {
  pluginDidLoad,
  pluginWillUnload,

  reactClass,
  reducer,
  settingsClass,
}
