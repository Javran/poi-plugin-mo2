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
    const filterMorale = moraleFilters[stypeExt] || 'all'
    const sortMethod = ships.sort.method
    const sortReverse = ships.sort.reversed
    return {
      stypeExt,
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
        stypeExt, filterMorale,
        sortMethod, sortReverse,
      } = listOptions
      const shipList =
        applyOptions(listOptions)(Object.values(shipsInfo))
      return {
        shipList,
        stypeInfo,
        stypeExt, filterMorale,
        sortMethod, sortReverse,
        layout,
      }
    })

const lessThanArrSelector = createSelector(
  extSelector,
  ext => ext.ships.filter.lessThanArr)

export {
  shipMoraleListSelector,
  lessThanArrSelector,
}
