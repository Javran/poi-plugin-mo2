import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

import { emptyConfig } from './config'

const initState = {
  ...emptyConfig,
  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mo2@ConfigReplace') {
    const {config} = action
    return {
      ...state,
      ...config,
    }
  }

  // prevent any modification if state is not ready
  if (! state.ready)
    return state

  if (action.type === '@poi-plugin-mo2@ConfigModify') {
    const {modifier} = action
    return modifier(state)

    /* TODO rework saving
    const { admiralId, saveAdmiralConfig, ...config } = state
    // TODO

    const { modifier } = action
    const newConfig = modifier(config)
    saveAdmiralConfig(newConfig)
    return {
      ...state,
      ...newConfig,
    }
    */
  }

  return state
}

const actionCreator = {
  configReplace: config => ({
    type: '@poi-plugin-mo2@ConfigReplace',
    config,
  }),
  configModify: modifier => ({
    type: '@poi-plugin-mo2@ConfigModify',
    modifier,
  }),
  configInvalidate: () =>
    actionCreator.configReplace({ready: false}),
  configLoaded: config =>
    actionCreator.configReplace({
      ...config,
      ready: true,
    }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const boundActionCreator =
  mapDispatchToProps(store.dispatch)

const asyncBoundActionCreator = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    func(boundActionCreator)))

export {
  reducer,
  mapDispatchToProps,
  boundActionCreator,
  asyncBoundActionCreator,
}
