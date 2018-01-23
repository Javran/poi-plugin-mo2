import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import { admiralIdSelector, extSelector } from '../selectors'
import { saveConfig, configSelector } from '../config'

const extReadySelector = createSelector(
  extSelector,
  ext => ext.ready)

const debouncedSaveConfig = _.debounce(
  (admiralId, config) => setTimeout(() =>
    saveConfig(admiralId, config)),
  500)

const configSaver = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
    ready: extReadySelector,
    config: configSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      // valid admiralId
      cur.admiralId &&
      // not changing admiralId
      cur.admiralId === prev.admiralId &&
      // 'ready' flag is stayed true
      (cur.ready === true && prev.ready === true) &&
      !shallowEqual(cur.config,prev.config)
    ) {
      const {admiralId, config} = cur
      debouncedSaveConfig(admiralId, config)
    }
  }
)

export { configSaver }
