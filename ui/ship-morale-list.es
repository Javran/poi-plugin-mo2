import React, { Component } from 'react'
import { DropdownButton, MenuItem, ButtonGroup } from 'react-bootstrap'

import { PTyp } from '../ptyp'

class ShipMoraleList extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,

    shipsInfo: PTyp.objectOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,

    filterSType: PTyp.number.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.oneOf(['rid','name','type','level','morale']).isRequired,
    sortReverse: PTyp.bool.isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  displayFilterSType = () => {
    const { filterSType } = this.props
    const typeInfo =
      this.props.stypeInfo.find(x => x.stype === filterSType)
    return `Type: ${typeInfo.name} (${filterSType})`
  }

  displayFilterMorale = () => {
    const { filterMorale } = this.props
    const moraleValueText = (() => {
      if (filterMorale === 'all')
        return 'All'
      const rawNum = /^lt-(\d+)$/.exec(filterMorale)[1]
      const num = parseInt(rawNum,10)
      return `< ${num}`
    })()
    return `Morale: ${moraleValueText}`
  }

  handleFilterSTypeChange = stype => {
    const { onModifyConfig } = this.props
    onModifyConfig(config => ({
      ...config,
      filterSType: stype,
    }))
  }

  handleFilterMoraleChange = morale => {
    const { onModifyConfig } = this.props
    onModifyConfig(config => ({
      ...config,
      filterMorale: morale,
    }))
  }

  render() {
    const {
      stypeInfo, visible,
    } = this.props

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
                onSelect={this.handleFilterSTypeChange}
                title={this.displayFilterSType()} id="dropdown-stype">
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
                onSelect={this.handleFilterMoraleChange}
                title={this.displayFilterMorale()}
                id="dropdown-morale">
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
