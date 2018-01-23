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

const configSelector = createSelector(
  fleetsSelector,
  shipsSelector,
  tabSelector,
  (fleets, ships, tab) => ({fleets, ships, tab})
)

// config file is located under directory "$APPDATA_PATH/morale-monitor"
// with admiral id being the name and ".json" extension.
const getConfigFilePath = admiralId => {
  const configPath = join(APPDATA_PATH,'morale-monitor')
  ensureDirSync(configPath)
  return join(configPath,`${admiralId}.json`)
}

// saves the config
const saveConfig = (admiralId, config) => {
  const path = getConfigFilePath(admiralId)
  try {
    const configWithVer = {
      ...config,
      configVersion: latestVersion,
    }
    writeJsonSync(path, configWithVer)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

const updateConfig = (admiralId, oldConfig) => {
  let currentConfig = oldConfig

  // not containing a 'configVersion' prop is considered to be
  // a legacy config from <0.4.0 versions
  if (!('configVersion' in currentConfig)) {
    // emptyConfig for 0.4.0
    const emptyConfig = {
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

    const stypeExt = typeof currentConfig.filterSType === 'number' ?
      `stype-${currentConfig.filterSType}` :
      currentConfig.filterSType

    const newConfig = _.flow([
      // walk fleets
      modifyObject(
        'fleets',
        modifyObject(
          // copying watchlist
          'watchlist', () => currentConfig.watchlist
        )
      ),
      // walk ships
      modifyObject(
        'ships', _.flow([
          // walk sort
          modifyObject(
            'sort', _.flow([
              modifyObject('method', () => currentConfig.sortMethod),
              modifyObject('reversed', () => currentConfig.sortReverse),
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
                  stypeExt, () => currentConfig.filterMorale
                )
              ),
            ])
          ),
        ])
      ),
    ])(emptyConfig)

    currentConfig = newConfig
  }

  if (currentConfig.configVersion === latestVersion) {
    if (currentConfig && oldConfig === currentConfig) {
      /*
         schedule a save due to having some part of the config is update
         this is not necessary but it avoids repeated work of updating
       */
      setTimeout(() => saveConfig(admiralId,currentConfig))
    }

    const {configVersion: _ignored, ...realConfig} = currentConfig
    return realConfig
  }

  console.error(`cannot update current config`)
  return null
}

// loadConfig(admiralId) loads the corresponding config
const loadConfig = admiralId => {
  try {
    return updateConfig(
      admiralId,
      readJsonSync(getConfigFilePath(admiralId))
    )
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading config', err)
    }
  }
  return null
}

export {
  loadConfig,
  saveConfig,
  configSelector,
}
