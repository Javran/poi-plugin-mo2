import React, { PureComponent } from 'react'
import { Label } from 'react-bootstrap'
import { translate } from 'react-i18next'

import { PTyp } from '../../../ptyp'

const actions = new Map();

(() => {
  const def = (actionKind, desc, bsStyle) => {
    actions.set(actionKind, {desc, bsStyle})
  }

  // 行動指示 0=待機, 1=出撃, 2=防空, 3=退避, 4=休息
  def(0, 'main:Standby', 'default')
  def(1, 'main:Sortie', 'danger')
  def(2, 'main:Defense', 'warning')
  def(3, 'main:Retreat', 'primary')
  def(4, 'main:Rest', 'success')
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
    let bsStyle
    let content
    if (actions.has(actionKind)) {
      const info = actions.get(actionKind);
      ({bsStyle} = info)
      content = t(info.desc)
    } else {
      bsStyle = 'default'
      content = `Unknown(${actionKind})`
    }

    return (
      <Label bsStyle={bsStyle} style={style}>{content}</Label>
    )
  }
}

export { LbasActionLabel }
