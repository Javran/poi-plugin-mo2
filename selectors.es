import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  shipsSelector,
  basicSelector,
  constSelector,
  fleetsSelector,
  configLayoutSelector,
} from 'views/utils/selectors'
import { WSubject } from './structs'

import { applyOptions } from './shiplist-ops'

const extSelector = extensionSelectorFactory('poi-plugin-mo2')

const presetDeckSelector =
  createSelector(
    extSelector,
    s => s.presetDeck)

const presetDeckMaxSelector =
  createSelector(
    extSelector,
    s => s.presetDeck === null ?
      3 :
      s.presetDeck.api_max_num)

const shipListOptionsSelector =
  createSelector(
    extSelector,
    ({filterSType, filterMorale, sortMethod, sortReverse}) => ({
      filterSType, filterMorale, sortMethod, sortReverse}))

const watchlistSelector =
  createSelector(
    extSelector,
    s => s.watchlist)

const admiralIdSelector =
  createSelector(
    basicSelector,
    s => parseInt(s.api_member_id,10))

// like shipsSelector but with data fields trimed and renamed
// for the purpose of this plugin.
const shipsInfoSelector =
  createSelector(
    shipsSelector,
    constSelector,
    fleetsSelector,
    (ships, {$ships, $shipTypes},fleets) => {
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

// putting info together for displaying the monitor part
const moraleListSelector =
  createSelector(
    watchlistSelector,
    shipsInfoSelector,
    fleetsSelector,
    presetDeckSelector,
    (watchlist, shipsInfo, fleets, presetDeck) => {
      // for marking some piece of info unavailable
      // (unavailable if `ships.length` === 0)
      const unavailable = wSubject => ({
        wSubject, name: null, ships: []})

      const rstIdArrayToShips = rstIdArr => {
        const ships = []
        rstIdArr.map(rstId => {
          if (typeof rstId !== 'number' || rstId <= 0)
            return
          const ship = shipsInfo[rstId]
          if (typeof ship !== 'undefined')
            ships.push(ship)
        })
        return ships
      }

      const buildFromWSubject = WSubject.destruct({
        fleet: (fleetId, wSubject) => {
          const fleetInfo =
            fleets.find(d => d.api_id === fleetId)
          if (typeof fleetInfo === 'undefined')
            return unavailable(wSubject)
          const ships = rstIdArrayToShips(fleetInfo.api_ship)
          return {
            wSubject,
            name: fleetInfo.api_name,
            ships,
          }
        },
        preset: (presetNo, wSubject) => {
          if (presetDeck === null)
            return unavailable(wSubject)
          const presetInfo = presetDeck.api_deck[presetNo]
          if (typeof presetInfo === 'undefined')
            return unavailable(wSubject)
          const ships = rstIdArrayToShips(presetInfo.api_ship)
          return {
            wSubject,
            name: presetInfo.api_name,
            ships,
          }
        },
        custom: (_id, name, rstIds, wSubject) => {
          const ships = rstIdArrayToShips(rstIds)
          return {
            wSubject,
            name,
            ships,
          }
        },
      })

      return watchlist.map(buildFromWSubject)
    })

const stypeInfoSelector =
  createSelector(
    constSelector,
    ({$shipTypes}) =>
      Object.entries($shipTypes).map(([stypeStr,typeInfo]) =>
        ({ stype: parseInt(stypeStr,10), name: typeInfo.api_name })))

const fleetMoraleListSelector =
  createSelector(
    shipsInfoSelector,
    moraleListSelector,
    presetDeckMaxSelector,
    presetDeckSelector,
    fleetsSelector,
    (
      shipsInfo, moraleList, presetDeckMax,
      presetDeck,fleets) => {
      // those missing in morale list
      const availableTargets = []

      for (let fleetId = 1; fleetId <= 4; ++fleetId) {
        if (
          moraleList.findIndex(m =>
            m.wSubject.type === 'fleet' &&
            m.wSubject.fleetId === fleetId) === -1) {
          availableTargets.push({type: 'fleet',fleetId})
        }
      }

      for (let presetNo = 1; presetNo <= presetDeckMax; ++ presetNo) {
        if (
          moraleList.findIndex(m =>
            m.wSubject.type === 'preset' &&
            m.wSubject.presetNo === presetNo) === -1) {
          availableTargets.push({type: 'preset',presetNo})
        }
      }

      return {
        moraleList,
        availableTargets,
      }
    }
  )

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

const moraleMonitorSelector =
  createSelector(
    admiralIdSelector,
    fleetMoraleListSelector,
    shipMoraleListSelector,
    (admiralId, fleetMoraleListData, shipMoraleListData) => ({
      admiralId,
      ...fleetMoraleListData,
      ...shipMoraleListData,
    })
  )

export {
  moraleMonitorSelector,
}
