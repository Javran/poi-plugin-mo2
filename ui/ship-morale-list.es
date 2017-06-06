import React, { Component } from 'react'
import { DropdownButton, MenuItem, ButtonGroup } from 'react-bootstrap'

import { PTyp } from '../ptyp'

class ShipMoraleList extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,

    shipsInfo: PTyp.objectOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  render() {
    const { stypeInfo, visible } = this.props
    return (
      <div
          style={visible ? {} : {display: "none"}}
      >
        <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
        >
          <ButtonGroup
              style={{width: "49%"}}
              justified>
            <DropdownButton
                title="Type" id="dropdown-stype">
              {
                stypeInfo.map( ({stype, name}) => (
                  <MenuItem key={stype} eventKey={stype}>
                    {`${name} (${stype})`}
                  </MenuItem>
                ))
              }
            </DropdownButton>
          </ButtonGroup>
          <ButtonGroup
              style={{width: "49%"}}
              justified>

            <DropdownButton
                title="Morale" id="dropdown-stype">
              <MenuItem eventKey="all">All</MenuItem>
              {
                [50,53,85,100].map( m => (
                  <MenuItem key={m} eventKey={`lt-${m}`}>
                    {`< ${m}`}
                  </MenuItem>
                ))
              }
            </DropdownButton>
          </ButtonGroup>
        </div>
        <div>TableArea</div>
      </div>
    )
  }
}

export {
  ShipMoraleList,
}
