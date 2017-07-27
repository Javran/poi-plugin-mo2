import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  DropdownButton,
  MenuItem,
  ButtonGroup,
  Table,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { SType, ShipFilter } from '../../ship-filters'
import { ListItem } from './list-item'
import { mapDispatchToProps } from '../../store'
import { shipMoraleListSelector } from './selectors'

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

class ShipMoraleListImpl extends Component {
  static propTypes = {
    shipList: PTyp.arrayOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,
    layout: PTyp.Layout.isRequired,

    filterSType: PTyp.FilterSType.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,

    configModify: PTyp.func.isRequired,
  }

  static defineHeader =
    (name, method, width, asc = true /* whether it's ascending by default */) => ({
      name, method, width, asc,
    })

  static headerSpecs = [
    ShipMoraleListImpl.defineHeader('ID','rid','14%'),
    ShipMoraleListImpl.defineHeader(__('ShipList.Type'),'stype','20%'),
    ShipMoraleListImpl.defineHeader(__('ShipList.Name'),'name','auto'),
    ShipMoraleListImpl.defineHeader(__('ShipList.Level'),'level','14%',false),
    ShipMoraleListImpl.defineHeader(__('ShipList.Morale'),'morale',`14%`),
  ]

  modifyShipsConfig = modifier => this.props.configModify(
    modifyObject('ships', modifier)
  )

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

  handleFilterSTypeChange = stypeExt =>
    this.modifyShipsConfig(modifyObject(
      'filter',
      modifyObject('stypeExt', () => stypeExt))
    )

  handleFilterMoraleChange = morale =>
    this.modifyShipsConfig(modifyObject(
      'filter',
      filterConfig => modifyObject(
        'moraleFilters',
        modifyObject(
          filterConfig.stypeExt,
          () => morale)
      )(filterConfig)))

  handleClickHeader = method => () => this.modifyShipsConfig(
    modifyObject('sort', sortConfig => {
      if (sortConfig.method === method) {
        return {
          ...sortConfig,
          reversed: !sortConfig.reversed,
        }
      } else {
        return {
          ...sortConfig,
          method,
          reversed: false,
        }
      }
    })
  )

  render() {
    const {
      shipList,
      stypeInfo,
      layout,
      sortMethod, sortReverse,
    } = this.props

    const prepareSTypeText = ShipFilter.display(stypeInfo,__)

    return (
      <div>
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
                stypeInfo.map( ({stype}) =>
                  // hiding some ship types:
                  // - XBB: no ship of this type is ever implemented
                  // - AP: only used by abyssal ships, plus there's AO
                  //     which shares the same ship type name, we'd better hide AP
                  //     to avoid confusion.
                  [SType.XBB, SType.AP].indexOf(stype) === -1 &&
                  (
                  <MenuItem key={stype} eventKey={`stype-${stype}`}>
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
                  ShipMoraleListImpl.headerSpecs.map( ({name, method, width, asc}) => {
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
                  <ListItem ship={ship} />
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

const ShipMoraleList = connect(
  shipMoraleListSelector,
  mapDispatchToProps
)(ShipMoraleListImpl)

export {
  ShipMoraleList,
}
