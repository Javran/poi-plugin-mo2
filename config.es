import _ from 'lodash'
import { modifyObject } from 'subtender'
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

// TODO
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
  configVersion: '0.4.0',
}

const updateConfig = (admiralId, oldConfig) => {
  // not containing a 'configVersion' prop is considered to be
  // a legacy config from <0.4.0 versions
  if (! ('configVersion' in oldConfig)) {
    const stypeExt = typeof oldConfig.filterSType === 'number' ?
      `stype-${oldConfig.filterSType}` :
      oldConfig.filterSType

    const config = _.flow([
      // walk fleets
      modifyObject(
        'fleets',
        modifyObject(
          // copying watchlist
          'watchlist', () => oldConfig.watchlist
        )
      ),
      // walk ships
      modifyObject(
        'ships', _.flow([
          // walk sort
          modifyObject(
            'sort', _.flow([
              modifyObject('method', () => oldConfig.sortMethod),
              modifyObject('reversed', () => oldConfig.sortReverse),
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
                  stypeExt, () => oldConfig.filterMorale
                )
              ),
            ])
          ),
        ])
      ),
    ])(emptyConfig)
    // TODO: save
    return config
  }

  throw new Error(`cannot update current config`)
}

// config file is located under directory "$APPDATA_PATH/morale-monitor"
// with admiral id being the name and ".json" extension.
const getConfigFilePath = admiralId => {
  const configPath = join(APPDATA_PATH,'morale-monitor')
  ensureDirSync(configPath)
  return join(configPath,`${admiralId}.json`)
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
  return emptyConfig
}

const extStateToConfig = state => {
  const keys = Object.keys(emptyConfig)
  return _.fromPairs(
    keys.map(key => [
      key,
      _.get(state, key, emptyConfig[key]),
    ]))
}

// saveConfig(admiralId,config) saves the config
const saveConfig = (admiralId, config) => {
  const path = getConfigFilePath(admiralId)
  try {
    writeJsonSync(path,config)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

export {
  loadConfig,
  saveConfig,
  emptyConfig,
  extStateToConfig,
}
