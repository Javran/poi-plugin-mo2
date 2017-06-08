import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
  Table,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { ShipFilter } from '../ship-filters'
import { FleetMarker } from './fleet-marker'
import { DivMorale } from './div-morale'

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

class ShipMoraleList extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,

    shipList: PTyp.arrayOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,
    layout: PTyp.Layout.isRequired,

    filterSType: PTyp.FilterSType.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  static defineHeader =
    (name, method, width, asc = true /* whether it's ascending by default */) => ({
      name, method, width, asc,
    })

  static headerSpecs = [
    ShipMoraleList.defineHeader('ID','rid','14%'),
    ShipMoraleList.defineHeader('Type','stype','20%'),
    ShipMoraleList.defineHeader('Name','name','auto'),
    ShipMoraleList.defineHeader('Level','level','14%',false),
    ShipMoraleList.defineHeader('Morale','morale',`14%`),
  ]

  displayFilterSType = () => {
    const { filterSType, stypeInfo } = this.props
    const text = ShipFilter.display(stypeInfo)(filterSType)
    return `Type: ${text}`
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

    const prepareSTypeText = ShipFilter.display(stypeInfo)

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
                [...ShipFilter.specialFilters.entries()].map( ([id]) =>
                  (
                    <MenuItem key={id} eventKey={id}>
                      {
                        prepareSTypeText(id)
                      }
                    </MenuItem>
                  ))
              }
              {
                stypeInfo.map( ({stype}) => (
                  <MenuItem key={stype} eventKey={stype}>
                    {
                      prepareSTypeText(stype)
                    }
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
                [50,53,76,85,100].map( m => (
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
            style={{tableLayout: 'fixed'}}
            striped bordered condensed hover>
            <thead
            >
              <tr>
                {
                  ShipMoraleList.headerSpecs.map( ({name, method, width, asc}) => {
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
                        style={{width}}
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
                      <DivMorale
                        style={{
                          fontSize: 14,
                        }}
                        morale={ship.morale}
                        isDarkTheme={isDarkTheme}
                        />
                    </td>
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
