import _ from 'lodash'
import {
  chainComparators,
  projectorToComparator,
  flipComparator,
} from 'subtender'
import { IntPredRep } from './structs'
import { ShipFilter } from './ship-filters'

const rosterIdComparator = projectorToComparator(x => x.rstId)

// when supplied to sort function, the result will be like
// sorting by ship levels in game.
const inGameLevelComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.level)),
    projectorToComparator(x => x.sortNo),
    rosterIdComparator
  )

// when supplied to sort function, the result will be like
// sorting by ship types in game.
const inGameShipTypeComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.stype)),
    projectorToComparator(x => x.sortNo),
    flipComparator(projectorToComparator(x => x.level)),
    rosterIdComparator
  )

const removeUnlocked = true
const applyOptions = (options, wctf={}, constData={}) => {
  const {
    stypeExt, moraleFilter,
    sortMethod, sortReverse,
  } = options

  const lockFilter = removeUnlocked ? xs => xs.filter(s => s.locked) : xs => xs
  const minStore = {wctf, const: constData}

  const stypeFilter = xs => xs.filter(
    ShipFilter.prepareShipTypePredicate(minStore)(stypeExt)
  )

  const moraleFilterFunc = (() => {
    if (moraleFilter.type === 'all')
      return _.identity
    const pred = IntPredRep.toPredicate(moraleFilter)
    return xs => xs.filter(x => pred(x.morale))
  })()

  /* eslint-disable indent */
  const comparator =
    sortMethod === 'rid' ? rosterIdComparator :
    sortMethod === 'name' ? projectorToComparator(x => x.name) :
    sortMethod === 'stype' ? inGameShipTypeComparator :
    sortMethod === 'level' ? inGameLevelComparator :
    sortMethod === 'morale' ? projectorToComparator(x => x.morale) :
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
