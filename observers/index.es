import { observe } from 'redux-observers'
import { store } from 'views/create-store'
import { configLoader } from './config-loader'
import { configSaver } from './config-saver'

let unsubscribe = null

const globalSubscribe = () => {
  if (unsubscribe !== null) {
    console.warn('expecting "unsubscribe" to be null')
    if (typeof unsubscribe === 'function')
      unsubscribe()
    unsubscribe = null
  }

  unsubscribe = observe(
    store,
    [
      configLoader,
      configSaver,
    ]
  )
}

const globalUnsubscribe = () => {
  if (typeof unsubscribe !== 'function') {
    console.warn('unsubscribe is not a function')
  } else {
    unsubscribe()
  }
  unsubscribe = null
}

export {
  globalSubscribe,
  globalUnsubscribe,
}
