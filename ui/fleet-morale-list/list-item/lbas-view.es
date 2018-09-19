import React, { PureComponent } from 'react'

import { PTyp } from '../../../ptyp'

class LbasView extends PureComponent {
  static propTypes = {
    moraleInfo: PTyp.object.isRequired,
  }

  render() {
    const {
      moraleInfo,
    } = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: 6,
            display: 'flex',
            flexDirection: 'column',
            marginTop: 5,
            marginLeft: 5,
            paddingBottom: 2,
          }}
        >
          {
            JSON.stringify(moraleInfo)
          }
        </div>
      </div>
    )
  }
}

export { LbasView }
