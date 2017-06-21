import React, { Component } from 'react'
import {
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { WSubject } from '../structs'

import { FleetMoraleListItem } from './fleet-morale-list-item'

class FleetMoraleList extends Component {
  static propTypes = {
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.arrayOf(PTyp.WSubject).isRequired,
    visible: PTyp.bool.isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  handleAddNewTarget = ws => {
    const { onModifyConfig } = this.props
    onModifyConfig( config => ({
      ...config,
      watchlist: [...config.watchlist, ws],
    }))
  }

  handleRemoveItem = moraleInfo => () => {
    const ws = moraleInfo.wSubject
    const id = WSubject.id(ws)
    const { onModifyConfig } = this.props
    onModifyConfig(config => ({
      ...config,
      watchlist:
        config.watchlist.filter(w => WSubject.id(w) !== id),
    }))
  }

  handleCloneItem = moraleInfo => () => {
    const { name } = moraleInfo
    const ships = moraleInfo.ships.map(s => s.rstId)
    const { onModifyConfig } = this.props

    onModifyConfig(config => {
      const { watchlist } = config
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

      return {
        ...config,
        watchlist: [...watchlist, newWS],
      }
    })
  }

  handleSwapItem = (ind1, ind2) => () => {
    const { onModifyConfig } = this.props
    onModifyConfig(config => {
      const { watchlist } = config

      const item1 = watchlist[ind1]
      const item2 = watchlist[ind2]

      const newWatchlist = [...watchlist]
      newWatchlist[ind1] = item2
      newWatchlist[ind2] = item1

      return {
        ...config,
        watchlist: newWatchlist,
      }
    })
  }

  handleChangeItemName = moraleInfo => newName => {
    const { onModifyConfig } = this.props
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
    onModifyConfig(config => ({
      ...config,
      watchlist: config.watchlist.map(modifyRelated),
    }))
  }

  renderMenuItemContent = ws => {
    const basicText =
      ws.type === 'fleet' ? `${__('FleetList.Fleet')} #${ws.fleetId}` :
      ws.type === 'preset' ? `${__('FleetList.Preset')} #${ws.presetNo}` :
      console.error(`Unexpected WSubject type: ${ws.type}`)

    const { fsName, shipCount } = ws
    if (typeof fsName !== 'undefined' && typeof shipCount !== 'undefined') {
      return [
        basicText,
        `${__('FleetList.Flagship')}: ${fsName}`,
        `${__('FleetList.ShipCount')}: ${shipCount}`,
      ].join(', ')
    } else {
      return basicText
    }
  }

  render() {
    const { moraleList } = this.props
    return (
      <ListGroup
          style={{
            marginBottom: "30px",
            ...(this.props.visible ? {} : {display: "none"} ),
          }}
      >
        {
          moraleList.map( (moraleInfo,ind) => {
            // only swapping custom items are allowed
            const canMoveUp =
              ind-1 >= 0 &&
              moraleList[ind-1].wSubject.type === 'custom'

            const canMoveDown =
              ind+1 < moraleList.length

            return (
              <FleetMoraleListItem
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
              padding: "5px",
            }}
            key="availables"
        >
          <ButtonGroup justified>
            <DropdownButton
                style={{marginTop: 0}}
                onSelect={this.handleAddNewTarget}
                title={__("FleetList.Add")}
                id="dropdown-add-new-target">
              {
                this.props.availableTargets.map( ws => (
                  <MenuItem
                      eventKey={ws}
                      key={WSubject.id(ws)}>
                    {
                      this.renderMenuItemContent(ws)
                    }
                  </MenuItem>
                ))
              }
            </DropdownButton>
          </ButtonGroup>
        </ListGroupItem>
      </ListGroup>
    )
  }
}

export {
  FleetMoraleList,
}
