import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
  Table,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { FleetMarker } from './fleet-marker'

class ShipMoraleList extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,

    shipList: PTyp.arrayOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,
    layout: PTyp.Layout.isRequired,

    filterSType: PTyp.number.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  static defineSortableHeader =
    (name, method, asc = true /* whether it's ascending by default */) => ({
      name, method, asc,
    })

  static headerSpecs = [
    ShipMoraleList.defineSortableHeader('ID','rid'),
    ShipMoraleList.defineSortableHeader('Type','stype'),
    ShipMoraleList.defineSortableHeader('Name','name'),
    ShipMoraleList.defineSortableHeader('Level','level',false),
    ShipMoraleList.defineSortableHeader('Morale','morale'),
  ]

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

  handleClickHeader = method => () => {
    const { onModifyConfig } = this.props
    onModifyConfig(config => {
      const { sortMethod } = config
      if (sortMethod === method) {
        return {
          ...config,
          sortReverse: !config.sortReverse,
        }
      } else {
        return {
          ...config,
          sortMethod: method,
          sortReverse: false,
        }
      }
    })
  }

  render() {
    const {
      shipList,
      stypeInfo, visible,
      layout,
      sortMethod, sortReverse,
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
        <div
            style={{
              marginTop: '8px',
              height: layout === 'vertical' ? '48vh' : '85vh',
              overflowY: 'scroll',
            }}>
          <Table
              striped bordered condensed hover>
            <thead
            >
              <tr>
                {
                  ShipMoraleList.headerSpecs.map( ({name, method, asc}) => {
                    const isActive = sortMethod === method
                    // using name instead of method, as some doesn't have the latter
                    const key = name
                    let content
                    if (isActive) {
                      const dir = sortReverse ? (asc ? '▼' : '▲') : (asc ? '▲' : '▼')
                      content = `${name} ${dir}`
                    } else {
                      content = name
                    }
                    return (
                      <th
                          className={isActive ? "text-primary" : ""}
                          onClick={this.handleClickHeader(method)}
                          key={key}>
                        {content}
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody
            >
              {
                shipList.map(ship => (
                  <tr
                      key={ship.rstId}
                  >
                    <td>{ship.rstId}</td>
                    <td>{ship.typeName}</td>
                    <td>
                      {ship.name}
                      <FleetMarker
                        style={{marginLeft: 5}}
                        fleet={ship.fleet}
                        formatter={x => `/${x}`}
                      />
                    </td>
                    <td>{ship.level}</td>
                    <td>{ship.morale}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export {
  ShipMoraleList,
}
