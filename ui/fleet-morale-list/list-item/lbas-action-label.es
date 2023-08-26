import React, { PureComponent } from 'react'
import { Tag, Intent } from '@blueprintjs/core'
import { translate } from 'react-i18next'

import { PTyp } from '../../../ptyp'

const actions = (() => {
  const m = new Map()
  const def = (actionKind, desc, intent) => {
    m.set(actionKind, {desc, intent})
  }

  // 行動指示 0=待機, 1=出撃, 2=防空, 3=退避, 4=休息
  def(0, 'main:Standby', Intent.NONE)
  def(1, 'main:Sortie', Intent.DANGER)
  def(2, 'main:Defense', Intent.WARNING)
  def(3, 'main:Retreat', Intent.PRIMARY)
  def(4, 'main:Rest', Intent.SUCCESS)

  return m
})()

@translate(['main'])
class LbasActionLabel extends PureComponent {
  static propTypes = {
    actionKind: PTyp.number.isRequired,
    style: PTyp.object.isRequired,

    t: PTyp.func.isRequired,
  }

  render() {
    const {actionKind, style, t} = this.props
    let intent
    let content
    if (actions.has(actionKind)) {
      const {intent: i, desc} = actions.get(actionKind)
      intent = i
      content = t(desc)
    } else {
      intent = Intent.NONE
      content = `Unknown(${actionKind})`
    }

    return (
      <Tag intent={intent} style={style}>
        <div style={{textAlign: 'center'}}>
          {content}
        </div>
      </Tag>
    )
  }
}

export { LbasActionLabel }
