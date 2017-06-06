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
