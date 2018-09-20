import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  stateSelector as poiStateSelector,
  constSelector,
  equipsSelector,
} from 'views/utils/selectors'

const rawAirbaseSelector = createSelector(
  poiStateSelector,
  state => _.get(state, ['info', 'airbase'], [])
)

const lbasWorldsSelector = createSelector(
  rawAirbaseSelector,
  rawAirbase => _.uniq(rawAirbase.map(x => x.api_area_id))
)

/*
   return a function that returns plane info for an equipment roster id:

   {
     rId: int,
     mstId: int,
     name: string,
     improve: 0~10,
     ace: 0~7,
   }
 */
const getPlaneInfoFuncSelector = createSelector(
  constSelector,
  equipsSelector,
  (gameConst, equips) => rId => {
    if (_.isEmpty(equips) || !(rId in equips)) {
      return null
    }
    const equip = equips[rId]
    const mstId = equip.api_slotitem_id
    const ace = equip.api_alv || 0
    const improve = equip.api_level || 0
    const $equip = _.get(gameConst, ['$equips', mstId])
    if (_.isEmpty($equip))
      return null
    const name = $equip.api_name
    return {
      rId,
      mstId,
      name,
      improve,
      ace,
    }
  }
)

const getLbasInfoFuncSelector = createSelector(
  rawAirbaseSelector,
  getPlaneInfoFuncSelector,
  (rawAirbase, getPlaneInfo) => (world, sqId) => {
    const ind = rawAirbase.findIndex(x =>
      x.api_area_id === world && x.api_rid === sqId
    )
    if (ind === -1)
      return null

    const rawSqInfo = rawAirbase[ind]
    const rawPlaneInfo = rawSqInfo.api_plane_info
    console.assert(Array.isArray(rawPlaneInfo) && rawPlaneInfo.length <= 4)
    const validPlanes = rawPlaneInfo.filter(x => x.api_state !== 0)
    const cond = validPlanes.length === 0 ? null : (
      Math.max(...validPlanes.map(x => x.api_cond))
    )

    const planeInfo = [0,1,2,3].map(pInd => {
      const infoRaw = rawPlaneInfo[pInd]
      if (_.isEmpty(infoRaw) || infoRaw.api_state === 0) {
        return null
      }
      const rId = infoRaw.api_slotid
      const planeEqInfo = getPlaneInfo(rId)
      if (planeEqInfo === null)
        return null

      const pCond = infoRaw.api_cond
      const count = {
        now: infoRaw.api_count,
        max: infoRaw.api_max_count,
      }
      const state = infoRaw.api_state

      return {
        ...planeEqInfo,
        cond: pCond,
        count,
        state,
      }
    })

    if (planeInfo.every(pi => pi === null))
      return null

    return {
      world,
      sqId,
      name: rawSqInfo.api_name,
      actionKind: rawSqInfo.api_action_kind,
      cond,
      planeInfo,
    }
  }
)

const getWorldLbasInfoFuncSelector = createSelector(
  getLbasInfoFuncSelector,
  getLbasInfo => world => {
    const list = [];
    [1,2,3].forEach(sqId => {
      const ret = getLbasInfo(world, sqId)
      if (ret !== null) {
        list.push(ret)
      }
    })
    return list.length === 0 ? null : list
  }
)

export {
  lbasWorldsSelector,
  getLbasInfoFuncSelector,
  getWorldLbasInfoFuncSelector,
}
