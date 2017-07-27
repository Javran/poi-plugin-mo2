import { createSelector } from 'reselect'

import {
  constSelector,
  configLayoutSelector,
} from 'views/utils/selectors'

import {
  extSelector,
  shipsInfoSelector,
} from '../../selectors'
import { applyOptions } from '../../shiplist-ops'

const shipListOptionsSelector = createSelector(
  extSelector,
  ({ships}) => {
    const {stypeExt, moraleFilters} = ships.filter
    const maybeSType = /^stype-(\d+)$/.exec(stypeExt)
    const filterSType = maybeSType ? Number(maybeSType[1]) : stypeExt
    const filterMorale = moraleFilters[stypeExt] || 'all'
    const sortMethod = ships.sort.method
    const sortReverse = ships.sort.reversed
    return {
      filterSType,
      filterMorale,
      sortMethod,
      sortReverse,
    }
  }
)

const stypeInfoSelector =
  createSelector(
    constSelector,
    ({$shipTypes}) =>
      Object.entries($shipTypes).map(([stypeStr,typeInfo]) =>
        ({ stype: parseInt(stypeStr,10), name: typeInfo.api_name })))

const shipMoraleListSelector =
  createSelector(
    shipsInfoSelector,
    stypeInfoSelector,
    shipListOptionsSelector,
    configLayoutSelector,
    (shipsInfo,stypeInfo,listOptions, layout) => {
      const {
        filterSType, filterMorale,
        sortMethod, sortReverse,
      } = listOptions
      const shipList =
        applyOptions(listOptions)(Object.values(shipsInfo))
      return {
        shipList,
        stypeInfo,
        filterSType, filterMorale,
        sortMethod, sortReverse,
        layout,
      }
    })

export { shipMoraleListSelector }
