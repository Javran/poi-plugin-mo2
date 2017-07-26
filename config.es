import _ from 'lodash'
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const emptyConfig = {
  watchlist: [],
  filterSType: 2, // DD
  filterMorale: 'all',
  sortMethod: 'level',
  sortReverse: false,
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
    return readJsonSync(getConfigFilePath(admiralId))
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
