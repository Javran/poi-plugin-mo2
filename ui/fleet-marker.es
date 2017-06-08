import React, { Component } from 'react'

import { PTyp } from '../ptyp'

class FleetMarker extends Component {
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

  static style = {
    fontWeight: "bolder",
    color: "white",
    fontFamily: "serif",
    textShadow: [
      "-1px -1px 0 lightseagreen",
      "1px -1px 0 lightseagreen",
      "-1px 1px 0 lightseagreen",
      "1px 1px 0 lightseagreen"].join(","),
    WebkitFontSmoothing: "antialiased",
  }

  render() {
    const { fleet, formatter, style } = this.props
    if (fleet === null)
      return false
    return (
      <span
        style={{
          ...FleetMarker.style,
          ...style,
        }}
      >
        {formatter(fleet)}
      </span>
    )
  }
}

export { FleetMarker }
