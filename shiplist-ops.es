import _ from 'lodash'
import { IntPredRep } from './structs'
import { ShipFilter } from './ship-filters'

// composing multiple comparators into one by
// trying comparators from left to right, and return first non-zero value.
// if no comparator is provided or all comparator has return 0
// the resulting comparator returns 0 as well.
const chainComparators = (...cmps) => (x,y) => {
  for (let i=0; i<cmps.length; ++i) {
    const result = cmps[i](x,y)
    if (result !== 0)
      return result
  }
  return 0
}

const flipComparator = cmp => (x,y) => cmp(y,x)

// create a comparator assuming the getter projects a numeric value from elements
const getter2Comparator = getter => (x,y) => getter(x)-getter(y)

const rosterIdComparator = getter2Comparator(x => x.rstId)

// when supplied to sort function, the result will be like
// sorting by ship levels in game.
const inGameLevelComparator =
  chainComparators(
    flipComparator(getter2Comparator(x => x.level)),
    getter2Comparator(x => x.sortNo),
    rosterIdComparator)

// when supplied to sort function, the result will be like
// sorting by ship types in game.
const inGameShipTypeComparator =
  chainComparators(
    flipComparator(getter2Comparator(x => x.stype)),
    getter2Comparator(x => x.sortNo),
    flipComparator(getter2Comparator(x => x.level)),
    rosterIdComparator)

const applyOptions = (options,removeUnlocked=true) => {
  const {
    stypeExt, moraleFilter,
    sortMethod, sortReverse,
  } = options

  const lockFilter = removeUnlocked ? xs => xs.filter(s => s.locked) : xs => xs

  const stypeFilter = xs => xs.filter(
    ShipFilter.prepareShipTypePredicate(stypeExt))

  const moraleFilterFunc = (() => {
    if (moraleFilter.type === 'all')
      return _.identity
    const pred = IntPredRep.toPredicate(moraleFilter)
    return xs => xs.filter(x => pred(x.morale))
  })()

  /* eslint-disable indent */
  const comparator =
    sortMethod === 'rid' ? rosterIdComparator :
    sortMethod === 'name' ? getter2Comparator(x => x.name) :
    sortMethod === 'stype' ? inGameShipTypeComparator :
    sortMethod === 'level' ? inGameLevelComparator :
    sortMethod === 'morale' ? getter2Comparator(x => x.morale) :
      console.error(`Unknown sorting method: ${sortMethod}`)
  /* eslint-enable indent */

  // as every ship has a unique rosterId
  // we use this as the final resolver if necessary
  // so that the compare result is always non-zero unless we are comparing the same ship
  const comparatorResolved = chainComparators(comparator,rosterIdComparator)
  // we literally just reverse the array if necessary, rather than flipping the comparator.

  const sort = xs => xs.sort(comparatorResolved)

  const reverseOrNot =
    sortReverse ? xs => [...xs].reverse() : xs => xs

  return _.flow([
    lockFilter,
    stypeFilter,
    moraleFilterFunc,
    sort,
    reverseOrNot,
  ])
}

export {
  applyOptions,
}
