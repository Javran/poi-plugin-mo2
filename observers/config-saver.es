import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import { admiralIdSelector, extSelector } from '../selectors'
import { extStateToConfig, saveConfig } from '../config'

const currentConfigSelector = createSelector(
  extSelector,
  extStateToConfig)

const extReadySelector = createSelector(
  extSelector,
  ext => ext.ready)

const configSaver = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
    ready: extReadySelector,
    config: currentConfigSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      // valid admiralId
      cur.admiralId &&
      // not changing admiralId
      cur.admiralId === prev.admiralId &&
      // 'ready' flag is stayed true
      (cur.ready === true && prev.ready === true) &&
      ! shallowEqual(cur.config,prev.config)
    ) {
      const {admiralId, config} = cur
      setTimeout(() => {
        saveConfig(admiralId, config)
      })
    }
  }
)

export { configSaver }
