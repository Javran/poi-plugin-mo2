import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  shipsSelector,
  basicSelector,
  constSelector,
  fleetsSelector,
} from 'views/utils/selectors'

import { initState } from './store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mo2'),
  extStore =>
    _.isEmpty(extStore) ? initState : extStore)

const admiralIdSelector = createSelector(
  basicSelector,
  s => {
    const parsed = Number(s.api_member_id)
    return _.isInteger(parsed) ? parsed : null
  })

// like shipsSelector but with data fields trimed and renamed
// for the purpose of this plugin.
const shipsInfoSelector =
  createSelector(
    shipsSelector,
    constSelector,
    fleetsSelector,
    (ships, {$ships = {}, $shipTypes = {}},fleets) => {
      const shipsInfo = {}
      Object.entries(ships)
        .map(([rstIdStr, ship]) => {
          const rstId = parseInt(rstIdStr,10)
          const mstId = ship.api_ship_id
          const level = ship.api_lv
          const morale = ship.api_cond
          const masterInfo = $ships[mstId]
          const name = masterInfo.api_name
          const stype = masterInfo.api_stype
          const stypeInfo = $shipTypes[stype]
          const typeName = stypeInfo.api_name
          const sortNo = masterInfo.api_sortno
          const fleetInd = fleets.findIndex(fleet => fleet.api_ship.indexOf(rstId) !== -1)
          const fleet = fleetInd === -1 ? null : fleets[fleetInd].api_id
          const locked = ship.api_locked === 1
          shipsInfo[rstIdStr] = {
            rstId, mstId,
            name, stype, typeName, sortNo,
            level, morale, fleet, locked,
          }
        })
      return shipsInfo
    })

const lessThanArrSelector = createSelector(
  extSelector,
  ext => ext.ships.filter.lessThanArr)

export {
  extSelector,
  shipsInfoSelector,
  admiralIdSelector,
  lessThanArrSelector,
}
