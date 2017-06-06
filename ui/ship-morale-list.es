import React, { Component } from 'react'

import { PTyp } from '../ptyp'

class ShipMoraleList extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
  }

  render() {
    return (<div>Excited!</div>)
  }
}

export {
  ShipMoraleList,
}
