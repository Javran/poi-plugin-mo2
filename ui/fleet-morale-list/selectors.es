import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  stateSelector as poiStateSelector,
  fleetsSelector,
} from 'views/utils/selectors'

import { WSubject } from '../../structs'
import {
  extSelector,
  shipsInfoSelector,
} from '../../selectors'

const presetDeckSelector = createSelector(
  poiStateSelector,
  s => s.info.presets)

const presetDeckMaxSelector = createSelector(
  presetDeckSelector,
  presetDeck => presetDeck.api_max_num)

const watchlistSelector =
  createSelector(
    extSelector,
    s => s.fleets.watchlist)

const rstIdArrayToShipsWith = shipsInfo => rstIdArr => _.compact(
  rstIdArr.map(rstId => {
    if (! _.isInteger(rstId) || rstId <= 0)
      return null
    return shipsInfo[rstId]
  })
)

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

export { fleetMoraleListSelector }
