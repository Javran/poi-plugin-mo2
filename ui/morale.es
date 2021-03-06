import React, { Component } from 'react'

import { PTyp } from '../ptyp'

class Morale extends Component {
  static propTypes = {
    morale: PTyp.number,
    style: PTyp.object,
  }

  static defaultProps = {
    morale: null,
    style: {},
  }

  render() {
    const { morale, style } = this.props

    /* eslint-disable indent */
    // TODO: deal with light theme.
    const moraleStyle =
      morale === null ? {} :
      morale <= 48 ? {} :
      morale === 49 ? {textShadow: 'white 0 0 7px'} :
      {textShadow: '#ffee00 0 0 7px'}

    const moraleClasses =
      morale === null ? '' :
      morale <= 19 ? 'poi-ship-cond-0' :
      morale <= 29 ? 'poi-ship-cond-20' :
      morale <= 39 ? 'poi-ship-cond-30' :
      morale <= 48 ? 'poi-ship-cond-40' :
      morale === 49 ? 'poi-ship-cond-49' :
      morale <= 52 ? 'poi-ship-cond-50' :
      'poi-ship-cond-53'
    /* eslint-enable indent */
    const moraleText = morale === null ? '-' : String(morale)

    return (
      <div
        className={`${moraleClasses} dark`}
        style={{
          ...moraleStyle,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          ...style,
        }}
      >
        {moraleText}
      </div>
    )
  }
}

export { Morale }
