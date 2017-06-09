import React, { Component } from 'react'
import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { FleetMarker } from './fleet-marker'
import { Morale } from './morale'

const { isDarkTheme } = window

const WrappedTd = ({content}) => (
  <td>
    <div style={{
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'}}>
      {content}
    </div>
  </td>)
WrappedTd.propTypes = PTyp.node.isRequired

class ShipMoraleListItem extends Component {
  static propTypes = {
    ship: PTyp.ShipInfo.isRequired,
  }

  render() {
    const { ship } = this.props
    return (
      <tr
        key={ship.rstId}
      >
        <WrappedTd content={ship.rstId} />
        <WrappedTd content={ship.typeName} />
        <WrappedTd content={
          <span>
            {ship.name}
            <FleetMarker
              style={{marginLeft: 5}}
                    fleet={ship.fleet}
                    formatter={x => `/${x}`}
            />
          </span>
        } />

        <WrappedTd content={ship.level} />
        <td>
          <Morale
            style={{
              fontSize: 14,
            }}
            morale={ship.morale}
            isDarkTheme={isDarkTheme}
          />
        </td>
      </tr>
    )
  }
}

export {
  ShipMoraleListItem,
}
