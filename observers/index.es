import { observe } from 'redux-observers'
import { store } from 'views/create-store'
import { configLoader } from './config-loader'
import { configSaver } from './config-saver'

const observeAll = () =>
  observe(store, [
    configLoader,
    configSaver,
  ])

export { observeAll }
