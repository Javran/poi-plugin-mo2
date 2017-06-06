import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const emptyConfig = {
  watchlist: [],
  presetDeck: null,
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
  if (admiralId === null)
    return emptyConfig
  try {
    return readJsonSync(getConfigFilePath(admiralId))
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
