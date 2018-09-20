import React, { PureComponent } from 'react'

import { PTyp } from '../../../ptyp'
import { LbasSquadronView } from './lbas-squadron-view'

class LbasView extends PureComponent {
  static propTypes = {
    moraleInfo: PTyp.object.isRequired,
  }

  render() {
    const {
      moraleInfo: {info},
    } = this.props
    if (info === null) {
      return (
        <div
          style={{
            textAlign: 'center',
            lineHeight: '2em',
            height: '2em',
            fontSize: '1.2em',
          }}
        >
          -
        </div>
      )
    }
    const colW = Math.round(98 / info.length)
    return (
      <div
        style={{
          margin: '5px 10px',
          paddingRight: 10,
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: info.map(() => `${colW}%`).join(' '),
          gridColumnGap: 10,
        }}
      >
        {
          info.map(sqInfo => (<LbasSquadronView key={sqInfo.x} info={sqInfo} />))
        }
      </div>
    )
  }
}

export { LbasView }
