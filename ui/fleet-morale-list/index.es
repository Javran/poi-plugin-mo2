import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import {
  Button,
  Menu,
  MenuItem,
  Position,
  ButtonGroup as ButtonGroup2,
  Classes,
} from '@blueprintjs/core'
import { Popover } from 'views/components/etc/overlay'
import styled from 'styled-components'

import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { WSubject } from '../../structs'
import { mapDispatchToProps } from '../../store'
import { CompatClasses } from '../compat'
import { fleetMoraleListSelector } from './selectors'

import { ListItem } from './list-item'

const FPopover = styled(Popover)`
  & > span.${Classes.POPOVER_TARGET}, &.${CompatClasses.POPOVER_TARGET} {
    width: 100%
  }
`

@connect(
  fleetMoraleListSelector,
  mapDispatchToProps
)
class FleetMoraleList extends Component {
  static propTypes = {
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.arrayOf(PTyp.WSubject).isRequired,

    pStateModify: PTyp.func.isRequired,
  }

  modifyWatchlist = modifier => this.props.pStateModify(
    modifyObject(
      'fleets',
      modifyObject('watchlist', modifier)
    )
  )

  handleAddNewTarget = ws => () =>
    this.modifyWatchlist(watchlist =>
      [...watchlist, ws])

  handleRemoveItem = moraleInfo => () => {
    const ws = moraleInfo.wSubject
    const id = WSubject.id(ws)
    this.modifyWatchlist(watchlist =>
      watchlist.filter(w => WSubject.id(w) !== id)
    )
  }

  handleCloneItem = moraleInfo => () => {
    const { name } = moraleInfo
    const ships = moraleInfo.ships.map(s => s.rstId)
    this.modifyWatchlist(watchlist => {
      const customIds = watchlist
        .filter(w => w.type === 'custom')
        .map(w => w.id)
      const newId =
        customIds.length === 0 ? 1 :
        Math.max(...customIds) + 1

      const newWS = {
        type: 'custom',
        id: newId,
        name, ships,
      }

      return [...watchlist, newWS]
    })
  }

  handleSwapItem = (ind1, ind2) => () =>
    this.modifyWatchlist(watchlist => {
      const item1 = watchlist[ind1]
      const item2 = watchlist[ind2]

      const newWatchlist = [...watchlist]
      newWatchlist[ind1] = item2
      newWatchlist[ind2] = item1

      return newWatchlist
    })

  handleChangeItemName = moraleInfo => newName => {
    const { wSubject } = moraleInfo
    const modifyRelated = ws => {
      if (ws.type !== 'custom' ||
          ws.id !== wSubject.id)
        return ws
      return {
        ...ws,
        name: newName,
      }
    }
    this.modifyWatchlist(watchlist =>
      watchlist.map(modifyRelated))
  }

  renderMenuItemContent = ws => {
    /* eslint-disable indent */
    const basicText =
      ws.type === 'fleet' ? `${__('FleetList.Fleet')} #${ws.fleetId}` :
      ws.type === 'preset' ? `${__('FleetList.Preset')} #${ws.presetNo}` :
      ws.type === 'lbas' ? `${__('FleetList.Lbas', ws.world)}` :
      console.error(`Unexpected WSubject type: ${ws.type}`)
    /* eslint-enable indent */

    const { fsName, shipCount } = ws
    if (typeof fsName !== 'undefined' && typeof shipCount !== 'undefined') {
      return [
        basicText,
        `${fsName}`,
        `${shipCount} ${__('FleetList.NShips')}`,
      ].join(', ')
    } else {
      return basicText
    }
  }

  render() {
    const { moraleList } = this.props
    const fleetSelectionMenuContent = (
      <Menu>
        {
          this.props.availableTargets.map( ws => (
            <MenuItem
              key={WSubject.id(ws)}
              text={this.renderMenuItemContent(ws)}
              onClick={this.handleAddNewTarget(ws)}
            />
          ))
        }
      </Menu>
    )

    return (
      <ListGroup style={{marginBottom: 30}}>
        {
          moraleList.map((moraleInfo,ind) => {
            const canMoveUp = ind-1 >= 0
            const canMoveDown = ind+1 < moraleList.length
            return (
              <ListItem
                key={WSubject.id(moraleInfo.wSubject)}
                moraleInfo={moraleInfo}
                onMoveUp={canMoveUp ? this.handleSwapItem(ind,ind-1) : null}
                onMoveDown={canMoveDown ? this.handleSwapItem(ind,ind+1) : null}
                onRemoveItem={this.handleRemoveItem(moraleInfo)}
                onCloneItem={this.handleCloneItem(moraleInfo)}
                onChangeItemName={this.handleChangeItemName(moraleInfo)}
              />
            )
          })
        }
        <ListGroupItem
          style={{
            padding: 5,
          }}
          key="availables"
        >
          <FPopover
            content={fleetSelectionMenuContent}
            position={Position.BOTTOM}
            style={{width: '100%'}}
          >
            <ButtonGroup2
              fill
            >
              <Button>
                {__("FleetList.Add")}
              </Button>
            </ButtonGroup2>
          </FPopover>
        </ListGroupItem>
      </ListGroup>
    )
  }
}


export {
  FleetMoraleList,
}
