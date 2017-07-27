import _ from 'lodash'
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
import {
  lessThanArrSelector,
} from '../../selectors'
import {
  shipMoraleListSelector,
} from './selectors'

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

const headerSpecs = []
{
  const defineHeader =
    (name, method, width, asc = true /* whether it's ascending by default */) =>
      headerSpecs.push({name, method, width, asc})

  defineHeader('ID','rid','14%')
  defineHeader(__('ShipList.Type'),'stype','20%')
  defineHeader(__('ShipList.Name'),'name','auto')
  defineHeader(__('ShipList.Level'),'level','14%',false)
  defineHeader(__('ShipList.Morale'),'morale',`14%`)
}

const destructFitlerMorale = ({all, lt}) => x => {
  if (x === 'all')
    return all()
  const reResult = /^lt-(\d+)$/.exec(x)
  if (! reResult)
    return console.error(`unexpected filter morale: ${x}`)

  const rawNum = reResult[1]
  const num = Number(rawNum)
  return lt(num)
}

class ShipMoraleListImpl extends Component {
  static propTypes = {
    shipList: PTyp.arrayOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,
    layout: PTyp.Layout.isRequired,

    stypeExt: PTyp.string.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,
    lessThanArr: PTyp.arrayOf(PTyp.number).isRequired,

    configModify: PTyp.func.isRequired,
  }

  modifyShipsConfig = modifier => this.props.configModify(
    modifyObject('ships', modifier)
  )

  displaySTypeExt = () => {
    const { stypeExt, stypeInfo } = this.props
    const text = ShipFilter.display(stypeInfo,__)(stypeExt)
    return `${__('ShipList.Type')}: ${text}`
  }

  displayFilterMorale = () => {
    const { filterMorale } = this.props
    const moraleValueText = destructFitlerMorale({
      all: () => __('ShipList.All'),
      lt: n => `< ${n}`,
    })(filterMorale)
    return `${__('ShipList.Morale')}: ${moraleValueText}`
  }

  handleSTypeExtChange = stypeExt =>
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
      lessThanArr, filterMorale,
    } = this.props

    const actualLessThanArr = destructFitlerMorale({
      all: () => lessThanArr,
      lt: n => _.uniq([...lessThanArr,n]).sort((x,y) => x-y),
    })(filterMorale)

    const prepareSTypeText = ShipFilter.display(stypeInfo,__)

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <ButtonGroup
              style={{width: "49%"}}
              justified>
            <DropdownButton
              onSelect={this.handleSTypeExtChange}
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 300,
              }}
              title={this.displaySTypeExt()} id="mo2-dropdown-stype">
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
                stypeInfo.map(({stype}) =>
                  // hiding some ship types:
                  // - XBB: no ship of this type is ever implemented
                  // - AP: only used by abyssal ships, plus there's AO
                  //     which shares the same ship type name, we'd better hide AP
                  //     to avoid confusion.
                  [SType.XBB, SType.AP].indexOf(stype) === -1 &&
                  (
                  <MenuItem key={stype} eventKey={`stype-${stype}`}>
                    {
                      prepareSTypeText(`stype-${stype}`)
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
                id="mo2-dropdown-morale">
              <MenuItem eventKey="all">{__('ShipList.All')}</MenuItem>
              {
                actualLessThanArr.map( m => (
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
                  headerSpecs.map( ({name, method, width, asc}) => {
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
  state => {
    const props = shipMoraleListSelector(state)
    const lessThanArr = lessThanArrSelector(state)
    return {
      ...props,
      lessThanArr,
    }
  },
  mapDispatchToProps
)(ShipMoraleListImpl)

export {
  ShipMoraleList,
}
