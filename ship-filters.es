import { Nullable } from 'subtender'
import {
  SType,
  canEquipDLCFuncSelector,
} from 'subtender/poi'

import {
  allCVEIdsSelector,
  shipRemodelInfoSelector,
} from 'views/utils/selectors'

const isOneOf = xs => x => xs.indexOf(x) !== -1

// predAnd(p1,p2,...)(x)
// => p1(x) && p2(x) && ...
const predAnd = (...predicates) => x => {
  if (predicates.length === 0)
    return true

  let ret
  for (let i=0; i<predicates.length; ++i) {
    ret = predicates[i](x)
    if (!ret) return ret
  }
  return ret
}

/*
   TODO:

   - whale filter

 */

// special ship type categories
// defined as a Map so that insertion order can be preserved
const specialFilters = new Map()

// define special filters in the following code block and nowhere else.
{
  /*

     - id: a unique string that identifies the filter being defined
     - desc: a string that describes what this filter does in human language
     - func: the actual filtering function:

         func(<minStore>)(<ShipInfo>) : bool

     the function is curried in this way to allow using info from some other sources
     to do the filtering.

     minStore is a slice of interest from poi Store - as most of the time
     we don't need the whole store to be available to us.

     in our case the shape of minStore should be just {wctf, const},
     where:
     - wctf is used in subtender selector canEquipDLCFuncSelector.
     - const is used for allCVEIdsSelector from poi main app

   */
  const defineSpecialFilter = (id, desc, func) =>
    specialFilters.set(id, {id, desc, func})

  const isOneOfSType = (...stypes) => s => isOneOf(stypes)(s.stype)

  const {
    DD, CL, CV, CVL, AV, CVB,
    BB, FBB, BBV, XBB,
    SS, SSV, CT, CLT,
  } = SType

  defineSpecialFilter(
    'dd-cl', 'DD / CL',
    _store => isOneOfSType(DD,CL)
  )

  defineSpecialFilter(
    'dlc', 'DLC-capable',
    store => ({mstId}) =>
      canEquipDLCFuncSelector(store)(mstId)
  )

  defineSpecialFilter(
    'dlc-dd', 'DLC-capable (DD only)',
    store => predAnd(
      s => s.stype === DD,
      ({mstId}) => canEquipDLCFuncSelector(store)(mstId)
    )
  )

  defineSpecialFilter(
    'dlc-dd-cl', 'DLC-capable (DD / CL only)',
    store =>
      predAnd(
        isOneOfSType(DD,CL),
        ({mstId}) => canEquipDLCFuncSelector(store)(mstId)
      )
  )

  defineSpecialFilter(
    'cv-cvl-av', 'CV / CVL / AV',
    _store =>
      isOneOfSType(CV,CVL,AV)
  )

  defineSpecialFilter(
    'cv-cvl-cvb', 'CV / CVL / CVB',
    _store =>
      isOneOfSType(CV,CVL,CVB)
  )

  defineSpecialFilter(
    'cve', 'CVE',
    store => {
      const allCVEIds = allCVEIdsSelector(store)
      return shipInfo => allCVEIds.includes(shipInfo.mstId)
    }
  )

  defineSpecialFilter(
    'battleship', 'Battleships',
    _store =>
      isOneOfSType(BB,FBB,BBV,XBB)
  )

  defineSpecialFilter(
    'sub', 'Submarines',
    _store =>
      isOneOfSType(SS,SSV)
  )

  defineSpecialFilter(
    'cl-clt-ct', 'CL / CLT / CT',
    _store =>
      isOneOfSType(CL,CLT,CT)
  )

  defineSpecialFilter(
    'whales', 'Whales',
    store => {
      const {remodelChains} = shipRemodelInfoSelector(store)
      // TODO: unify with selector.
      // Taigei = 184, Jingei = 634
      const taigeiMstIds = (184 in remodelChains) ? remodelChains[184] : []
      const jingeiMstIds = (634 in remodelChains) ? remodelChains[634] : []
      const whaleMstIds = [...taigeiMstIds, ...jingeiMstIds]
      if (184 in remodelChains) {
        return shipInfo => whaleMstIds.includes(shipInfo.mstId)
      } else {
        return () => false
      }
    }
  )
}

class ShipFilter {
  static specialFilters = specialFilters

  static destruct = ({stypeIdFilter, specialFilter}) => stypeExt => {
    // a specialFilter callback expects the first argument being one registered above.
    if (specialFilters.has(stypeExt)) {
      return specialFilter(specialFilters.get(stypeExt))
    }

    return Nullable.destruct({
      one: ([_ignored,stypeStr]) => {
        const stype = Number(stypeStr)
        // a regular stype filter gets the number back
        return stypeIdFilter(stype)
      },
      none: () =>
        /*
           when RE has failed, this means the filter isn't valid
         */
        console.error(`Unknown filter: ${stypeExt}`),
    })(/^stype-(\d+)$/.exec(stypeExt))
  }

  static prepareShipTypePredicate = store =>
    ShipFilter.destruct({
      stypeIdFilter: stypeId => s => s.stype === stypeId,
      specialFilter: filterInfo => filterInfo.func(store),
    })

  static display = (stypeInfo=[], __=null) => ShipFilter.destruct({
    stypeIdFilter: stypeId => {
      const typeInfo =
        stypeInfo.find(x => x.stype === stypeId)
      if (typeof typeInfo !== 'undefined') {
        return `${typeInfo.name} (${stypeId})`
      } else {
        return `stype: ${stypeId}`
      }
    },
    specialFilter: filterInfo => {
      if (typeof __ === 'function') {
        return __(`SpecialFilters.${filterInfo.id}`)
      } else {
        return filterInfo.desc
      }
    },
  })
}

export {
  ShipFilter,
  SType,
}
