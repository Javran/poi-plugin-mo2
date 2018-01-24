import { reducer } from './store'
import { MoraleMonitor as reactClass } from './ui'
import {
  globalSubscribe as pluginDidLoad,
  globalUnsubscribe as pluginWillUnload,
} from './observers'
// import { Settings as settingsClass } from './ui/settings'

/*
   TODO:

   - filter customization:

       - no longer require filters to be sorted
       - new syntax for users: `<num`, `<=num`, `>num`, `>=num`, `=num`

       - but for underlying rep, we'll use `lt-num`, `le-num`, `gt-num`, `ge-num`, `eq-num`
         or go structural
 */

export {
  pluginDidLoad,
  pluginWillUnload,

  reactClass,
  reducer,
  // settingsClass,
}
