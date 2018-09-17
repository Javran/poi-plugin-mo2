import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  stateSelector as poiStateSelector,
} from 'views/utils/selectors'

const rawAirbaseSelector = createSelector(
  poiStateSelector,
  state => _.get(state, ['info', 'airbase'], [])
)

const lbasWorldsSelector = createSelector(
  rawAirbaseSelector,
  rawAirbase => _.uniq(rawAirbase.map(x => x.api_area_id))
)

const getLbasInfoFuncSelector = createSelector(
  rawAirbaseSelector,
  rawAirbase => (world, sqId) => {
    const ind = rawAirbase.findIndex(x =>
      x.api_area_id === world && x.api_rid === sqId
    )
    if (ind === -1)
      return null
    const rawSqInfo = rawAirbase[ind]
    const planes = rawSqInfo.api_plane_info.filter(x => x.api_state !== 0)
    const cond = planes.length === 0 ? null : (
      Math.max(...planes.map(x => x.api_cond))
    )

    return {
      world,
      sqId,
      name: rawSqInfo.api_name,
      actionKind: rawSqInfo.api_action_kind,
      cond,
    }
  }
)

export {
  lbasWorldsSelector,
  getLbasInfoFuncSelector,
}
