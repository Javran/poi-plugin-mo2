/*

   loads config upon initialization or admiralId change

 */
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'

import {
  mapDispatchToProps,
  asyncBoundActionCreators,
} from '../store'
import { admiralIdSelector } from '../selectors'
import { loadConfig } from '../config'

const configLoader = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
  }),
  (dispatch, cur, prev) => {
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
      mapDispatchToProps(dispatch).configInvalidate()
      // then asynchronously start a config-reloading process
      asyncBoundActionCreators(
        ({configLoaded}) =>
          configLoaded(loadConfig(admiralId)),
        dispatch,
      )
    }
  },
  {skipInitialCall: false}
)

export { configLoader }
