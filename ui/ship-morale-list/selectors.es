import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  constSelector,
  wctfSelector,
} from 'views/utils/selectors'

import {
  extSelector,
  shipsInfoSelector,
  availableShipTypesSelector,
} from '../../selectors'
import { applyOptions } from '../../shiplist-ops'

const shipListOptionsSelector = createSelector(
  extSelector,
  ({ships}) => {
    const {stypeExt, moraleFilters} = ships.filter
    const moraleFilter = moraleFilters[stypeExt] || {type: 'all'}
    const shipsSort = _.get(ships, 'sort', {method: 'level', reversed: false})
    const sortMethod = shipsSort.method
    const sortReverse = shipsSort.reversed
    return {
      stypeExt,
      moraleFilter,
      sortMethod,
      sortReverse,
    }
  }
)

const stypeInfoSelector = createSelector(
  constSelector,
  availableShipTypesSelector,
  ({$shipTypes = {}}, avaShipTypes) =>
    avaShipTypes.map(stype =>
      ({stype, name: $shipTypes[stype].api_name}))
)

const shipMoraleListSelector =
  createSelector(
    shipsInfoSelector,
    stypeInfoSelector,
    shipListOptionsSelector,
    wctfSelector,
    (shipsInfo,stypeInfo,listOptions,wctf) => {
      const {
        stypeExt, moraleFilter,
        sortMethod, sortReverse,
      } = listOptions
      const shipList =
        applyOptions(listOptions, wctf)(Object.values(shipsInfo))
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
