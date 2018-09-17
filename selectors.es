import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  shipsSelector as poiShipsSelector,
  basicSelector,
  constSelector,
  fleetsSelector as poiFleetsSelector,
  shipRemodelInfoSelector,
} from 'views/utils/selectors'

import { initState } from './store/common'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-mo2'),
  extStore =>
    _.isEmpty(extStore) ? initState : extStore
)

const fleetsSelector = createSelector(
  extSelector,
  ext => ext.fleets
)

const shipsSelector = createSelector(
  extSelector,
  ext => ext.ships
)

const tabSelector = createSelector(
  extSelector,
  ext => ext.tab
)

const readySelector = createSelector(
  extSelector,
  ext => ext.ready
)

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
    poiShipsSelector,
    constSelector,
    poiFleetsSelector,
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
          const sortNo = masterInfo.api_sort_id
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

const filterMethodsSelector = createSelector(
  extSelector,
  ext => ext.ships.filter.methods
)

/*
   derive the list of available ship types from store const

   a ship type is available if ally ships of that category exists
 */
const availableShipTypesSelector = createSelector(
  constSelector,
  ({$ships}) =>
    _.sortedUniq(
      _.sortBy(
        _.flatMap(
          _.values($ships),
          x => x.api_id <= 1500 && _.isInteger(x.api_id) ? [x.api_stype] : []
        ),
        _.identity
      )
    )
)

/*
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmhmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddddddddmmmmdommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhsoo+++++ooosyyhshmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmyo++++++/++++++++oosyyyyydmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmms+o+++++o+++++++ooooooosyyysyhmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmh/+ooooooosoooooosooooooossyhhhhydmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmysooosssssysssssoyssssssssssshhhhdddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmhyssssssssyssssssyhssssyssssyyyhhddddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhyyyyyyyyyhyyyyssdyyysyhyyysyyyhdddddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdyyyyyyyyydyyyyyyhhyyyyhyyyyshyohdddddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmdmmmmmmmmmmmmmmmmmmmmmhhhyyyyyyddyyyyysmhhyyyhyyyyyho:hdddddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmdhmmmmmmmmmmmmmmmmmmmmdhyyyyyyhhmhyyyyyhdhyyyyyyyyyhh+-oddddddmNmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmdommmmmmmmmmmmmmmmmmdhyyyyyyyhhmmyyyyyyddyyyy+hyyyydy-`/ddddddmNmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmhhdmmmmmmmmmmmmddhhyyyyyyhhdmmmmyyyyyydyyyyosyyyyym/``-hdmddmmNNmmmmmmmmmmmddmmmmmmmmmmmm
mmmmmmmmmmmmmdhhhhhhhhhhhyyyyyhhhddmmmddsohyyyyyyhsss+:ssssyys``.-ydmddmmmNmmmmmmmmmmmmsmdmmmmmmmmmm
mmmmmmmmmmmmmmmmmddhhhhhhhdddmmmmddhhhy///syyyyyyysyysosossss.````ohdhdmmmmmmmmmmmmmmmmy+ymmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhhhhhmy-::syyyysyhhydh+ooooo.```:+shhhddNmmmmmdhdmmmmmy+smmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhhhhmNNN/::syyyyssysoy-`.:++.``.ohh+hhhmdNmmmmmmmmmmmyooymmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmhhhdmmNNNNhoyyyyyys:://````..```/oy-/odmmNNmmmmmmmmmho/+ymmmmdmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhhdmmmNNNNNNmyyyyys..-..````````-::.:yNNNNNNmmmmmmdso/+ymmmmmdmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmhhmmmmmNNNNNNNyhyyyy.`````````````...-dNNNNNNmmmmmyy+s+ymmmmmmmhmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmdhddmNNNNNNNNNNhhyyyy-```````````````./NNNNNNNmmmdhy+y+ymmmmmmmmhmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmhdddmmNNNNNNNNdhyyyy-.``..`````````.+mNNNNmmmmmhdsysyymmmmmmmmmdmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmddddddmmNNNNNNNhhyyy/:.`````.```.:ohNNNNNmmmmmmhhyhshmmmmmmmmmmmdmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhhdddddds:+sydyyy+:/:-.``.-+ydNNNNNNNmmmdddhsddyhmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdyooooyh-`.:+dyyyo::/:::shmNNmmmNmmmmmmddddddhhdmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmy-``.-::oo+ohyhhsss::/::/mmhss//+sdoosdmdhhhmmdmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm.     `--+hhmmmhoo+/::/:/+hmd+:.shhd+/+sdyhmdmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmy        ``yhhmmmy+/+::/:://hmmh+dmNNm+/+sshmdmmmmmmmmmmmmmmm//mmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmms         `oyyhmmmy//+:/::///dmmmhdmmmmo+osmmmmmmmmmmmmmmmmmmysmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm+          -yyyyhmmy//o//+s+./mmmmmdhddNs+ymmmmmmmmmmmmmmmmmmddmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmms   ``     `/hyssshhh+ss////::ymmmmmhhhhs/ymmmmmmmmmmmmmmmmmyhmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmd.    `.    -dhooo+oshysy: `-.-dddmmmsysoysmmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmdho      .-.`.ss-/o/::/ssyo: ...yhsooyyosoo+mmmmmmmmmmmmmmmmmmmmmmmmmmm
mmmmmmmmmmmmmmmmmdddddddmmmmdyhd.       .:/// `shs:-:++y+:.--/s+ooossy+/:hmmmmmmmddmmmmmmmmmmmmmmmmm
mmmmmmmmmmmyyhNNdmNNddmmmdmmyhmN/`     ```.:s+ossdds:-oyyys:.:ssyhhdds//:/mmmmmmdmymmymmmmmdhmmmmmmm
mmmmmmmmmmhooshdNNNdmMNddNmdhymms.       .-:+/-.../shs-sdhhh//dhddddo/+/:ommmmmmsyhmmhhhyshdmmmmmmmm
mmmmmmmmmmysoydhhdmmNNNmmNddhdmdm..        /:`     `.+s/sddmmsmhyhhs///+/smmmmmmhss++yodmmmmmmmmmmmm
mmmmmmmmmmdyoymNNmdhydNdddhddmdmN+-.    `. /` .````````.:os/:/++++:``:+/+smmmdhhsosshmhdmmmmmmmmmmmm
mmmmmmmmmmmmmdNNNNdysymdhyhhmdmmds-:-...` `/  -`  `:/-` . .- `:/+:-.``/++odhhhysyyymdmmmmmmmmmmmmmmm
mmmmmmmmmmmmmhNNmNNmddmmhhddmmmdm+.       -:  --//++/  ``  /yyhh+++++//o+ommdyydmmdmhmmmmmmmmmmmmmmm
 */
const isKingOfWhalesSelector = createSelector(
  shipsInfoSelector,
  shipRemodelInfoSelector,
  (shipsInfo, {remodelChains}) => {
    // Taigei = 184
    const whaleMstIds = (184 in remodelChains)? remodelChains[184] : []
    // selector only from all locked ships
    const whales = _.values(shipsInfo).filter(s =>
      whaleMstIds.includes(s.mstId) && s.locked
    )

    const whaleGroups = _.toPairs(_.groupBy(whales, 'mstId'))
    // any of the following requirement will qualify

    /*
       Requirement #1:

       - must have at least 3 different mstIds
       - and for each mstId, must have one whose Lv. >= 60

     */
    if (
      whaleGroups.filter(([_mstIdStr, ws]) =>
        ws.some(w => w.level >= 60)
      ).length >= 3
    ) {
      return true
    }
    /*
       Requirement #2:

       - At least 5 whales in total
       - Level sum >= 300

     */
    if (
      whales.length >= 5 &&
      _.sumBy(whales, 'level') >= 300
    ) {
      return true
    }
    /*
       Requirement #3:

       - At least 2 whales with each level >= 99

     */
    if (
      whales.filter(w => w.level >= 99).length >= 2
    ) {
      return true
    }
    /*
       Requirement #4:

       - At least 10 whales

     */
    if (whales.length >= 10) {
      return true
    }

    return false
  }
)

export {
  extSelector,
  fleetsSelector,
  shipsSelector,
  tabSelector,
  readySelector,

  shipsInfoSelector,
  admiralIdSelector,
  filterMethodsSelector,
  availableShipTypesSelector,

  isKingOfWhalesSelector,
}
