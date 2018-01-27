import { Nullable } from 'subtender'
import { canEquipDLC } from 'subtender/kc'

/* TODO: deprecate canEquipDLC, parametrize to have stuff working from selectors */

const SType = {
  DE: 1, DD: 2, CL: 3, CLT: 4,
  CA: 5, CAV: 6, CVL: 7, FBB: 8,
  BB: 9, BBV: 10, CV: 11, XBB: 12,
  SS: 13, SSV: 14, AP: 15, AV: 16,
  LHA: 17, CVB: 18, AR: 19, AS: 20,
  CT: 21, AO: 22,
}

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

// special ship type categories
// defined as a Map so that insertion order can be preserved
const specialFilters = new Map()

// define special filters in the following code block and nowhere else.
{
  /*

     - id: a unique string that identifies the filter being defined
     - desc: a string that describes what this filter does in human language
     - func: the actual filtering function that accepts a ShipInfo structure

   */
  const defineSpecialFilter = (id, desc, func) =>
    specialFilters.set(id, Object.freeze({id, desc, func}))

  const isOneOfSType = (...stypes) => s => isOneOf(stypes)(s.stype)

  const {
    DD, CL, CV, CVL, AV, CVB,
    BB, FBB, BBV, XBB,
    SS, SSV, CT, CLT,
  } = SType

  defineSpecialFilter(
    'dd-cl', 'DD / CL',
    isOneOfSType(DD,CL))

  const canShipEquipDLC = ({stype, mstId}) =>
    canEquipDLC(stype, mstId)

  defineSpecialFilter(
    'dlc', 'DLC-capable',
    canShipEquipDLC)

  defineSpecialFilter(
    'dlc-dd', 'DLC-capable (DD only)',
    predAnd(s => s.stype === DD , canShipEquipDLC))

  defineSpecialFilter(
    'dlc-dd-cl', 'DLC-capable (DD / CL only)',
    predAnd(isOneOfSType(DD,CL), canShipEquipDLC))

  defineSpecialFilter(
    'cv-cvl-av', 'CV / CVL / AV',
    isOneOfSType(CV,CVL,AV))

  defineSpecialFilter(
    'cv-cvl-cvb', 'CV / CVL / CVB',
    isOneOfSType(CV,CVL,CVB))

  defineSpecialFilter(
    'battleship', 'Battleships',
    isOneOfSType(BB,FBB,BBV,XBB))

  defineSpecialFilter(
    'sub', 'Submarines',
    isOneOfSType(SS,SSV))

  defineSpecialFilter(
    'cl-clt-ct', 'CL / CLT / CT',
    isOneOfSType(CL,CLT,CT))

  Object.freeze(specialFilters)
}

class ShipFilter {
  static specialFilters = specialFilters

  static destruct = ({stypeIdFilter, specialFilter}) => stypeExt => {
    if (specialFilters.has(stypeExt)) {
      return specialFilter(specialFilters.get(stypeExt))
    }

    return Nullable.destruct({
      one: ([_ignored,stypeStr]) => {
        const stype = Number(stypeStr)
        return stypeIdFilter(stype)
      },
      none: () => {
        // when RE has failed
        console.error(`Unknown filter: ${stypeExt}`)
        return () => false
      },
    })(/^stype-(\d+)$/.exec(stypeExt))
  }

  static prepareShipTypePredicate = ShipFilter.destruct({
    stypeIdFilter: stypeId => s => s.stype === stypeId,
    specialFilter: filterInfo => filterInfo.func,
  })

  static display = (stypeInfo=[], __=null) => ShipFilter.destruct({
    stypeIdFilter: stypeId => {
      const typeInfo =
        stypeInfo.find(x => x.stype === stypeId)
      if (typeInfo !== 'undefined') {
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
  canEquipDLC,
  ShipFilter,
  SType,
}
