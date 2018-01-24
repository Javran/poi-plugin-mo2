import { createSelector } from 'reselect'

import {
  constSelector,
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
    const moraleFilter = moraleFilters[stypeExt] || {type: 'all'}
    const sortMethod = ships.sort.method
    const sortReverse = ships.sort.reversed
    return {
      stypeExt,
      moraleFilter,
      sortMethod,
      sortReverse,
    }
  }
)

const stypeInfoSelector =
  createSelector(
    constSelector,
    ({$shipTypes = {}}) =>
      Object.entries($shipTypes).map(([stypeStr,typeInfo]) =>
        ({ stype: Number(stypeStr), name: typeInfo.api_name })))

const shipMoraleListSelector =
  createSelector(
    shipsInfoSelector,
    stypeInfoSelector,
    shipListOptionsSelector,
    (shipsInfo,stypeInfo,listOptions) => {
      const {
        stypeExt, moraleFilter,
        sortMethod, sortReverse,
      } = listOptions
      const shipList =
        applyOptions(listOptions)(Object.values(shipsInfo))
      return {
        shipList,
        stypeInfo,
        stypeExt, moraleFilter,
        sortMethod, sortReverse,
      }
    })

export {
  shipMoraleListSelector,
}
