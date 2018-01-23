import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

import { initState } from './common'

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-mo2@PStateReplace') {
    const {pState} = action
    return {
      ...state,
      ...pState,
    }
  }

  // prevent any modification if state is not ready
  if (!state.ready)
    return state

  if (action.type === '@poi-plugin-mo2@PStateModify') {
    const {modifier} = action
    return modifier(state)
  }

  return state
}

const actionCreators = {
  pStateReplace: pState => ({
    type: '@poi-plugin-mo2@PStateReplace',
    pState,
  }),
  pStateModify: modifier => ({
    type: '@poi-plugin-mo2@PStateModify',
    modifier,
  }),
  pStateInvalidate: () =>
    actionCreators.pStateReplace({ready: false}),
  pStateLoaded: pState =>
    actionCreators.pStateReplace({
      ...(pState || {}),
      ready: true,
    }),
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

const boundActionCreators =
  mapDispatchToProps(store.dispatch)

export * from './common'

export {
  reducer,
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
}
