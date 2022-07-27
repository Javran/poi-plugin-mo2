import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Table,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'

import {
  Button,
  Menu,
  MenuItem,
  Position,
  ButtonGroup,
} from '@blueprintjs/core'
import { Popover } from 'views/components/etc/overlay'
import styled from 'styled-components'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { IntPredRep } from '../../structs'
import { ShipFilter } from '../../ship-filters'
import { ListItem } from './list-item'
import { mapDispatchToProps } from '../../store'
import {
  filterMethodsSelector,
  isKingOfWhalesSelector,
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
  </td>
)
WrappedTd.propTypes = PTyp.node.isRequired

const CompactMenu = styled(Menu)`
  & .bp4-menu-item {
    padding: 2px 6px
  }
`

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
    isKingOfWhales: PTyp.bool.isRequired,

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

  handleSTypeExtChange = stypeExt => () =>
    this.modifyShipsPState(
      modifyObject(
        'filter',
        modifyObject('stypeExt', () => stypeExt)
      )
    )

  handleMoraleFilterChange = predRep => () =>
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
      isKingOfWhales,
      filterMethods,
    } = this.props
    const toString = IntPredRep.mkToString(__)
    const prepareSTypeText = ShipFilter.display(stypeInfo,__)

    const specialFilterEntries = [
      ...ShipFilter.specialFilters.entries(),
    ].filter(([_k, v]) => v.id !== 'whales' || isKingOfWhales)


    const stypeMenuContent = (
      <CompactMenu>
        {
          specialFilterEntries.map(([id]) =>
            (
              <MenuItem
                key={id}
                text={prepareSTypeText(id)}
                onClick={this.handleSTypeExtChange(id)}
                style={{fontWeight: '50%'}}
              />
            )
          )
        }
        {
          stypeInfo.map(({stype}) => (
            <MenuItem
              key={stype}
              text={prepareSTypeText(`stype-${stype}`)}
              onClick={this.handleSTypeExtChange(`stype-${stype}`)}
            />
          ))
        }
      </CompactMenu>
    )

    const moraleMenuContent = (
      <Menu>
        {
          filterMethods.map(predRep => (
            <MenuItem
              key={IntPredRep.toId(predRep)}
              text={toString(predRep)}
              onClick={this.handleMoraleFilterChange(predRep)}
            />
          ))
        }
      </Menu>
    )

    return (
      <div
        style={{
          flex: 1,
          height: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ButtonGroup fill>
          <Popover
            content={stypeMenuContent}
            position={Position.BOTTOM}
          >
            <Button>
              {this.displaySTypeExt()}
            </Button>
          </Popover>
          <Popover
            content={moraleMenuContent}
            position={Position.BOTTOM}
          >
            <Button>
              {this.displayMoraleFilter()}
            </Button>
          </Popover>
        </ButtonGroup>
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
    const isKingOfWhales = isKingOfWhalesSelector(state)
    const actualFilterMethods = [
      {type: 'all'},
      ...filterMethods,
    ]

    return {
      ...props,
      filterMethods: actualFilterMethods,
      isKingOfWhales,
    }
  },
  mapDispatchToProps
)(ShipMoraleListImpl)

export {
  ShipMoraleList,
}
