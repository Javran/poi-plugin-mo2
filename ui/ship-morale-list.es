import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
  Table,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { ShipFilter } from '../ship-filters'
import { ShipMoraleListItem } from './ship-morale-list-item'

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
    ShipMoraleList.defineHeader(__('ShipList.Type'),'stype','20%'),
    ShipMoraleList.defineHeader(__('ShipList.Name'),'name','auto'),
    ShipMoraleList.defineHeader(__('ShipList.Level'),'level','14%',false),
    ShipMoraleList.defineHeader(__('ShipList.Morale'),'morale',`14%`),
  ]

  displayFilterSType = () => {
    const { filterSType, stypeInfo } = this.props
    const text = ShipFilter.display(stypeInfo,__)(filterSType)
    return `${__('ShipList.Type')}: ${text}`
  }

  displayFilterMorale = () => {
    const { filterMorale } = this.props
    const moraleValueText = (() => {
      if (filterMorale === 'all')
        return __('ShipList.All')
      const rawNum = /^lt-(\d+)$/.exec(filterMorale)[1]
      const num = parseInt(rawNum,10)
      return `< ${num}`
    })()
    return `${__('ShipList.Morale')}: ${moraleValueText}`
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

    const prepareSTypeText = ShipFilter.display(stypeInfo,__)

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
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 300,
              }}
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
              <MenuItem eventKey="all">{__('ShipList.All')}</MenuItem>
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
                    const key = method
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
                  <ShipMoraleListItem ship={ship} />
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
