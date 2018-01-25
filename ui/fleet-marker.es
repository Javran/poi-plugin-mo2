import React, { PureComponent } from 'react'

import { PTyp } from '../ptyp'

const componentStyle = {
  fontWeight: 'bolder',
  color: 'white',
  fontFamily: 'serif',
  textShadow: [
    '-1px -1px 0 lightseagreen',
    '1px -1px 0 lightseagreen',
    '-1px 1px 0 lightseagreen',
    '1px 1px 0 lightseagreen',
  ].join(','),
  WebkitFontSmoothing: 'antialiased',
}

class FleetMarker extends PureComponent {
  static propTypes = {
    fleet: PTyp.number,
    formatter: PTyp.func,
    style: PTyp.object,
  }

  static defaultProps = {
    fleet: null,
    formatter: x => x,
    style: {},
  }

  render() {
    const {fleet, formatter, style} = this.props
    if (fleet === null)
      return (<span style={{display: 'none'}} />)
    return (
      <span
        style={{
          ...componentStyle,
          ...style,
        }}
      >
        {formatter(fleet)}
      </span>
    )
  }
}

export { FleetMarker }
