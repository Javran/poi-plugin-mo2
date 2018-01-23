/*

   loads pState upon initialization or admiralId change

 */
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'

import {
  boundActionCreators as bac,
} from '../store'
import { admiralIdSelector } from '../selectors'
import { loadPState } from '../p-state'

const pStateLoader = observer(
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
      // immediately invalidate the pState
      bac.pStateInvalidate()
      // then asynchronously start a pState-reloading process
      setTimeout(() =>
        bac.pStateLoaded(loadPState(admiralId))
      )
    }
  },
  {skipInitialCall: false}
)

export { pStateLoader }
