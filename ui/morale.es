import React, { Component } from 'react'

import { PTyp } from '../ptyp'

class Morale extends Component {
  static propTypes = {
    morale: PTyp.number,
    isDarkTheme: PTyp.bool,
    style: PTyp.object,
  }

  static defaultProps = {
    morale: null,
    isDarkTheme: true,
    style: {},
  }

  render() {
    const { morale, isDarkTheme, style } = this.props
    const moraleStyle =
      morale === null ? {} :
        morale <= 48 ? {} :
        morale === 49 ? {textShadow: "white 0 0 7px"} :
        {textShadow: "#ffee00 0 0 7px"}

    const moraleClasses =
      morale === null ? "" :
      morale <= 19 ? "poi-ship-cond-0" :
      morale <= 29 ? "poi-ship-cond-20" :
      morale <= 39 ? "poi-ship-cond-30" :
      morale <= 48 ? "poi-ship-cond-40" :
      morale === 49 ? "poi-ship-cond-49" :
      morale <= 52 ? "poi-ship-cond-50" :
      "poi-ship-cond-53"

    const darkOrLight = isDarkTheme ? 'dark' : 'light'

    const moraleText = morale === null ? '-' : String(morale)

    return (
      <div
          className={`${moraleClasses} ${darkOrLight}`}
          style={{
            ...moraleStyle,
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            ...style,
          }}
      >
        {moraleText}
      </div>
    )
  }
}

export { Morale }
