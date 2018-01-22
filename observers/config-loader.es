/*

   loads config upon initialization or admiralId change

 */
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'

import {
  boundActionCreators as bac,
} from '../store'
import { admiralIdSelector } from '../selectors'
import { loadConfig } from '../config'

const configLoader = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      cur.admiralId && (
        // during initialization
        typeof prev === 'undefined' ||
        // or admiral id change
        cur.admiralId !== prev.admiralId
      )
    ) {
      const {admiralId} = cur
      // immediately invalidate the config
      bac.configInvalidate()
      // then asynchronously start a config-reloading process
      setTimeout(() =>
        bac.configLoaded(loadConfig(admiralId))
      )
    }
  },
  {skipInitialCall: false}
)

export { configLoader }
