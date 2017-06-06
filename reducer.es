import { loadConfig, saveConfig } from './config'

const initState = {
  admiralId: null,
  // we should keep "saveAdmiralConfig" always sync with admiralId.
  saveAdmiralConfig: saveConfig(null),
  watchlist: [],
  presetDeck: null,
}

const reducer = (state = initState, action) => {
  if (action.type === '@@Response/kcsapi/api_get_member/preset_deck') {
    const presetDeck = action.body
    const { admiralId, saveAdmiralConfig, watchlist } = state
    if (admiralId !== null) {
      saveAdmiralConfig({watchlist, presetDeck})
    }

    return {
      ...state,
      presetDeck,
    }
  }

  if (action.type === '@poi-plugin-mo2@Init') {
    const { admiralId } = action
    const { watchlist, presetDeck } = loadConfig(admiralId)

    return {
      ...state,
      admiralId,
      saveAdmiralConfig: saveConfig(admiralId),
      watchlist,
      presetDeck,
    }
  }

  if (action.type === '@poi-plugin-mo2@ModifyConfig') {
    const {
      watchlist,
      presetDeck,
      admiralId,
      saveAdmiralConfig,
    } = state

    if (admiralId === null) {
      console.error("Trying to modify a config when admiral id is not available")
      return state
    }

    const { modifier } = action
    const modifiedConfig = modifier({watchlist, presetDeck})
    // to ensure that only fields we are interested in are stored.
    const newConfig = {
      watchlist: modifiedConfig.watchlist,
      presetDeck: modifiedConfig.presetDeck,
    }
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
