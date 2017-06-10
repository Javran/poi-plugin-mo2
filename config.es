import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const emptyConfig = {
  watchlist: [],
  presetDeck: null,
  filterSType: 2, // DD
  filterMorale: 'all',
  filterDLC: 'all',
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

const updateConfig = config => {
  // already updated.
  if (typeof config.filterDLC !== 'undefined')
    return config

  const { filterSType } = config

  // dlc => no longer support dlc without a ship type
  // reset filterSType, and set dlc to true.
  if (filterSType === 'dlc') {
    return {
      ...config,
      filterSType: emptyConfig.filterSType,
      filterDLC: true,
    }
  }

  // for this filter we can still do the same,
  // which is setting dlc to true and them use 'dd-cl' filter.
  if (filterSType === 'dlc-dd-cl') {
    return {
      ...config,
      filterSType: 'dd-cl',
      filterDLC: true,
    }
  }

  // otherwise the config needs just the extra field
  // with default value
  return {
    ...config,
    filterDLC: emptyConfig.filterDLC,
  }
}

// loadConfig(admiralId) loads the corresponding config
const loadConfig = admiralId => {
  if (admiralId === null)
    return emptyConfig
  try {
    return updateConfig(
      readJsonSync(getConfigFilePath(admiralId))
    )
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading config', err)
    }
  }
  return emptyConfig
}

// saveConfig(admiralId)(config) saves the config
const saveConfig = admiralId => {
  if (admiralId === null) {
    // no operation when trying to save an empty config
    return () => {}
  }

  const path = getConfigFilePath(admiralId)
  return config => {
    try {
      writeJsonSync(path,config)
    } catch (err) {
      console.error('Error while writing to config file', err)
    }
  }
}

export {
  loadConfig,
  saveConfig,
}
