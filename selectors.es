import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  stateSelector as poiStateSelector,
  extensionSelectorFactory,
  shipsSelector,
  basicSelector,
  constSelector,
  fleetsSelector,
  configLayoutSelector,
} from 'views/utils/selectors'

import { WSubject } from './structs'
import { applyOptions } from './shiplist-ops'
import { reducer } from './store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mo2'),
  extStore =>
    _.isEmpty(extStore) ?
      reducer(undefined, {type: 'INIT'}) :
      extStore)

const presetDeckSelector = createSelector(
  poiStateSelector,
  s => s.info.presets)

const presetDeckMaxSelector = createSelector(
  presetDeckSelector,
  presetDeck => presetDeck.api_max_num)

const tabSelector = createSelector(
  extSelector,
  ext => ext.tab)

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

const watchlistSelector =
  createSelector(
    extSelector,
    s => s.fleets.watchlist)

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

const rstIdArrayToShipsWith = shipsInfo => rstIdArr => {
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

      const rstIdArrayToShips = rstIdArrayToShipsWith(shipsInfo)

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
      presetDeck,fleets
    ) => {
      // those missing in morale list
      const availableTargets = []
      const rstIdArrayToShips = rstIdArrayToShipsWith(shipsInfo)
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

      // try filling some extra info for a target if possible.
      const fillInfo = target => {
        if (target.type === 'fleet') {
          const fleet = fleets[target.fleetId-1]
          if (typeof fleet === 'undefined')
            return target
          const ships = rstIdArrayToShips(fleet.api_ship)
          return ships.length === 0 ?
            target :
            ({
              ...target,
              shipCount: ships.length,
              fsName: ships[0].name,
            })
        }

        if (target.type === 'preset') {
          if (presetDeck === null)
            return target
          const deck = presetDeck.api_deck[target.presetNo]
          if (typeof deck === 'undefined')
            return target
          const ships = rstIdArrayToShips(deck.api_ship)
          return ships.length === 0 ?
            target :
            ({
              ...target,
              shipCount: ships.length,
              fsName: ships[0].name,
            })
        }
        return target
      }

      return {
        moraleList,
        availableTargets: availableTargets.map(fillInfo),
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

export {
  extSelector,
  tabSelector,
  fleetMoraleListSelector,
  shipMoraleListSelector,
  admiralIdSelector,
}
