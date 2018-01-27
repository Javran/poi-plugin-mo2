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
import { IntPredRep } from '../../structs'
import { SType, ShipFilter } from '../../ship-filters'
import { ListItem } from './list-item'
import { mapDispatchToProps } from '../../store'
import {
  filterMethodsSelector,
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
  defineHeader(__('ShipList.Morale'),'morale',`16%`)
}

class ShipMoraleListImpl extends Component {
  static propTypes = {
    shipList: PTyp.arrayOf(PTyp.ShipInfo).isRequired,
    stypeInfo: PTyp.arrayOf(PTyp.STypeInfo).isRequired,

    stypeExt: PTyp.string.isRequired,
    moraleFilter: PTyp.object.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,

    filterMethods: PTyp.arrayOf(PTyp.object).isRequired,

    pStateModify: PTyp.func.isRequired,
  }

  modifyShipsPState = modifier => this.props.pStateModify(
    modifyObject('ships', modifier)
  )

  displaySTypeExt = () => {
    const { stypeExt, stypeInfo } = this.props
    const text = ShipFilter.display(stypeInfo,__)(stypeExt)
    return `${__('ShipList.Type')}: ${text}`
  }

  displayMoraleFilter = () => {
    const {moraleFilter} = this.props
    const toString = IntPredRep.mkToString(__)
    const moraleValueText = toString(moraleFilter)
    return `${__('ShipList.Morale')}: ${moraleValueText}`
  }

  handleSTypeExtChange = stypeExt =>
    this.modifyShipsPState(
      modifyObject(
        'filter',
        modifyObject('stypeExt', () => stypeExt)
      )
    )

  handleMoraleFilterChange = predRep =>
    this.modifyShipsPState(
      modifyObject(
        'filter',
        filterPState => modifyObject(
          'moraleFilters',
          modifyObject(
            filterPState.stypeExt,
            () => predRep
          )
        )(filterPState)
      )
    )

  handleClickHeader = method => () => this.modifyShipsPState(
    modifyObject('sort', sortPState => {
      if (sortPState.method === method) {
        return {
          ...sortPState,
          reversed: !sortPState.reversed,
        }
      } else {
        return {
          ...sortPState,
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
      sortMethod, sortReverse,
      filterMethods,
    } = this.props

    const toString = IntPredRep.mkToString(__)
    const prepareSTypeText = ShipFilter.display(stypeInfo,__)

    return (
      <div
        style={{
          flex: 1,
          height: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
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
            justified
          >
            <DropdownButton
              onSelect={this.handleSTypeExtChange}
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 300,
              }}
              title={this.displaySTypeExt()}
              id="mo2-dropdown-stype"
            >
              {
                [...ShipFilter.specialFilters.entries()].map(([id]) =>
                  (
                    <MenuItem key={id} eventKey={id}>
                      {
                        prepareSTypeText(id)
                      }
                    </MenuItem>
                  )
                )
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
                      {prepareSTypeText(`stype-${stype}`)}
                    </MenuItem>
                  )
                )
              }
            </DropdownButton>
          </ButtonGroup>
          <ButtonGroup
            style={{width: "49%"}}
            justified
          >
            <DropdownButton
              onSelect={this.handleMoraleFilterChange}
              title={this.displayMoraleFilter()}
              id="mo2-dropdown-morale"
            >
              {
                filterMethods.map(predRep => (
                  <MenuItem
                    key={IntPredRep.toId(predRep)}
                    eventKey={predRep}
                  >
                    {toString(predRep)}
                  </MenuItem>
                ))
              }
            </DropdownButton>
          </ButtonGroup>
        </div>
        <div
          style={{
            marginTop: '8px',
            flex: 1,
            overflowY: 'scroll',
          }}
        >
          <Table
            style={{tableLayout: 'fixed'}}
            striped bordered condensed hover
          >
            <thead>
              <tr>
                {
                  headerSpecs.map(({name, method, width, asc}) => {
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
            <tbody>
              {
                shipList.map(ship => (
                  <ListItem ship={ship} key={ship.rstId} />
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
    const filterMethods = filterMethodsSelector(state)
    const actualFilterMethods = [
      {type: 'all'},
      ...filterMethods,
    ]

    return {
      ...props,
      filterMethods: actualFilterMethods,
    }
  },
  mapDispatchToProps
)(ShipMoraleListImpl)

export {
  ShipMoraleList,
}
