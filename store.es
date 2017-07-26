import { loadConfig, saveConfig } from './config'

const initState = {
  admiralId: null,
  // we should keep "saveAdmiralConfig" always sync with admiralId.
  saveAdmiralConfig: saveConfig(null),
  watchlist: [],
  presetDeck: null,
  filterSType: 2,
  filterMorale: 'all',
  sortMethod: 'level',
  sortReverse: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@@Response/kcsapi/api_get_member/preset_deck') {
    const presetDeck = action.body
    const { admiralId, saveAdmiralConfig, ...config } = state
    if (admiralId !== null) {
      saveAdmiralConfig(config)
    }

    return {
      ...state,
      presetDeck,
    }
  }

  if (action.type === '@@Response/kcsapi/api_req_hensei/preset_register') {
    const deck = action.body
    const { admiralId, saveAdmiralConfig, ...config } = state
    const { presetDeck } = config
    if (admiralId !== null && presetDeck !== null) {
      const newPresetDeck = {
        ...presetDeck,
        api_deck: {
          ...presetDeck.api_deck,
          [deck.api_preset_no]: deck,
        },
      }

      saveAdmiralConfig({...config, presetDeck: newPresetDeck})
      return {
        ...state,
        presetDeck: newPresetDeck,
      }
    } else {
      return state
    }
  }

  if (action.type === '@@Response/kcsapi/api_req_hensei/preset_delete') {
    const targetStr = action.postBody.api_preset_no
    const { admiralId, saveAdmiralConfig, ...config } = state
    const { presetDeck } = config
    if (admiralId !== null && presetDeck !== null) {
      const newDecks = {...presetDeck.api_deck}
      if (typeof newDecks[targetStr] !== 'undefined')
        delete newDecks[targetStr]
      const newPresetDeck = {
        ...presetDeck,
        api_deck: newDecks,
      }
      saveAdmiralConfig({
        ...config,
        presetDeck: newPresetDeck,
      })
      return {
        ...state,
        presetDeck: newPresetDeck,
      }
    } else {
      return state
    }
  }

  if (action.type === '@poi-plugin-mo2@Init') {
    const { admiralId } = action
    const config = loadConfig(admiralId)

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
