import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import { admiralIdSelector, extSelector } from '../selectors'
import { savePState, pStateSelector } from '../p-state'

const extReadySelector = createSelector(
  extSelector,
  ext => ext.ready)

const debouncedSavePState = _.debounce(
  (admiralId, pState) => setTimeout(() =>
    savePState(admiralId, pState)),
  500)

const pStateSaver = observer(
  createStructuredSelector({
    admiralId: admiralIdSelector,
    ready: extReadySelector,
    pState: pStateSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      // valid admiralId
      cur.admiralId &&
      // not changing admiralId
      cur.admiralId === prev.admiralId &&
      // 'ready' flag is stayed true
      (cur.ready === true && prev.ready === true) &&
      !shallowEqual(cur.pState,prev.pState)
    ) {
      const {admiralId, pState} = cur
      debouncedSavePState(admiralId, pState)
    }
  }
)

export { pStateSaver }
