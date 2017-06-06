import React, { Component } from 'react'
import {
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { WSubject } from '../structs'

import { MoraleListItem } from './morale-list-item'

class MoraleList extends Component {
  static propTypes = {
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.arrayOf(PTyp.WSubject).isRequired,

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

  render() {
    return (
      <ListGroup
          style={{
            marginBottom: "30px",
          }}
      >
        {
          this.props.moraleList.map( moraleInfo => (
            <MoraleListItem
                key={WSubject.id(moraleInfo.wSubject)}
                moraleInfo={moraleInfo}
                onRemoveItem={this.handleRemoveItem(moraleInfo)}
                onCloneItem={this.handleCloneItem(moraleInfo)}
            />
          ))
        }
        <ListGroupItem
            style={{
              padding: "5px",
            }}
            key="availables"
        >
          <ButtonGroup justified>
            <DropdownButton
                onSelect={this.handleAddNewTarget}
                title="Add ..."
                id="dropdown-add-new-target">
              {
                this.props.availableTargets.map( ws => (
                  <MenuItem
                      eventKey={ws}
                      key={WSubject.id(ws)}>
                    {
                      JSON.stringify(ws)
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
  MoraleList,
}
