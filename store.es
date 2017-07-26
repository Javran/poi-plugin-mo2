import { loadConfig, saveConfig } from './config'

const initState = {
  admiralId: null,
  // we should keep "saveAdmiralConfig" always sync with admiralId.
  saveAdmiralConfig: saveConfig(null),
  watchlist: [],
  filterSType: 2,
  filterMorale: 'all',
  sortMethod: 'level',
  sortReverse: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mo2@Init') {
    const { admiralId } = action
    const {
      presetDeck: _ignored,
      ...config
    } = loadConfig(admiralId)

    return {
      ...state,
      admiralId,
      saveAdmiralConfig: saveConfig(admiralId),
      ...config,
    }
  }

  if (action.type === '@poi-plugin-mo2@ModifyConfig') {
    const { admiralId, saveAdmiralConfig, ...config } = state

    if (admiralId === null) {
      console.error("Trying to modify a config when admiral id is not available")
      return state
    }

    const { modifier } = action
    const newConfig = modifier(config)
    saveAdmiralConfig(newConfig)
    return {
      ...state,
      ...newConfig,
    }
  }

  return state
}

const mapDispatchToProps = dispatch => ({
  onInitialize: admiralId =>
    dispatch({
      type: '@poi-plugin-mo2@Init',
      admiralId,
    }),
  onModifyConfig: modifier =>
    dispatch({
      type: '@poi-plugin-mo2@ModifyConfig',
      modifier,
    }),
})

export {
  reducer,
  mapDispatchToProps,
}
