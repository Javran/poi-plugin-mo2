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
  }

  return state
}

const actionCreators = {
  configReplace: config => ({
    type: '@poi-plugin-mo2@ConfigReplace',
    config,
  }),
  configModify: modifier => ({
    type: '@poi-plugin-mo2@ConfigModify',
    modifier,
  }),
  configInvalidate: () =>
    actionCreators.configReplace({ready: false}),
  configLoaded: config =>
    actionCreators.configReplace({
      ...config,
      ready: true,
    }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

const boundActionCreators =
  mapDispatchToProps(store.dispatch)

const asyncBoundActionCreators = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    func(boundActionCreators)))

export {
  initState,
  reducer,
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
  asyncBoundActionCreators,
}
