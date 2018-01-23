import _ from 'lodash'
import { modifyObject } from 'subtender'
import { createSelector } from 'reselect'
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import {
  fleetsSelector,
  shipsSelector,
  tabSelector,
} from './selectors'

const { APPDATA_PATH } = window

const latestVersion = '0.4.0'

const pStateSelector = createSelector(
  fleetsSelector,
  shipsSelector,
  tabSelector,
  (fleets, ships, tab) => ({fleets, ships, tab})
)

// pState file is located under directory "$APPDATA_PATH/morale-monitor"
// with admiral id being the name and ".json" extension.
const getPStateFilePath = admiralId => {
  const pStatePath = join(APPDATA_PATH,'morale-monitor')
  ensureDirSync(pStatePath)
  return join(pStatePath,`${admiralId}.json`)
}

// saves the pState
const savePState = (admiralId, pState) => {
  const path = getPStateFilePath(admiralId)
  try {
    const pStateWithVer = {
      ...pState,
      configVersion: latestVersion,
    }
    writeJsonSync(path, pStateWithVer)
  } catch (err) {
    console.error('Error while writing to pState file', err)
  }
}

const updatePState = (admiralId, oldPState) => {
  let currentPState = oldPState

  // not containing a 'configVersion' prop is considered to be
  // a legacy pState from <0.4.0 versions
  if (!('configVersion' in currentPState)) {
    // emptyPState for 0.4.0
    const emptyPState = {
      fleets: {
        watchlist: [
          /* WSubject */
        ],
      },
      ships: {
        sort: {
          method: 'level',
          reversed: false,
        },
        filter: {
          // must be sorted
          lessThanArr: [50,53,76,85,100],
          // current selected stype (Ext for extended)
          stypeExt: 'stype-2',
          moraleFilters: {
            /*
               if not empty:

               'stype-2': 'all',
               'stype-20': 'lt-50',
               ...

             */
          },
        },
      },
      tab: 'fleet', // fleet / ship
    }

    const stypeExt = typeof currentPState.filterSType === 'number' ?
      `stype-${currentPState.filterSType}` :
      currentPState.filterSType

    const newPState = _.flow([
      // walk fleets
      modifyObject(
        'fleets',
        modifyObject(
          // copying watchlist
          'watchlist', () => currentPState.watchlist
        )
      ),
      // walk ships
      modifyObject(
        'ships', _.flow([
          // walk sort
          modifyObject(
            'sort', _.flow([
              modifyObject('method', () => currentPState.sortMethod),
              modifyObject('reversed', () => currentPState.sortReverse),
            ])
          ),
          // walk filter
          modifyObject(
            'filter', _.flow([
              modifyObject(
                'stypeExt', () => stypeExt
              ),
              modifyObject(
                'moraleFilters',
                /*
                   now that morale is indexed by stypeExt,
                   we preserve the current one
                   leaving all the others default values.
                 */
                modifyObject(
                  stypeExt, () => currentPState.filterMorale
                )
              ),
            ])
          ),
        ])
      ),
    ])(emptyPState)

    currentPState = newPState
  }

  if (currentPState.configVersion === latestVersion) {
    if (currentPState && oldPState === currentPState) {
      /*
         schedule a save due to having some part of the pState is update
         this is not necessary but it avoids repeated work of updating
       */
      setTimeout(() => savePState(admiralId,currentPState))
    }

    const {configVersion: _ignored, ...realPState} = currentPState
    return realPState
  }

  console.error(`cannot update current p-state`)
  return null
}

// loadPState(admiralId) loads the corresponding pState
const loadPState = admiralId => {
  try {
    return updatePState(
      admiralId,
      readJsonSync(getPStateFilePath(admiralId))
    )
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading p-state', err)
    }
  }
  return null
}

export {
  loadPState,
  savePState,
  pStateSelector,
}