import React, { Component } from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../../ptyp'
import { __ } from '../../../tr'

import { WSubject } from '../../../structs'

import { FleetView } from './fleet-view'
import { LbasView } from './lbas-view'

class ListItem extends Component {
  static propTypes = {
    moraleInfo: PTyp.MoraleInfo.isRequired,

    onRemoveItem: PTyp.func.isRequired,
    onCloneItem: PTyp.func.isRequired,
    onChangeItemName: PTyp.func.isRequired,
    onMoveUp: PTyp.func,
    onMoveDown: PTyp.func,
  }

  static defaultProps = {
    onMoveUp: null,
    onMoveDown: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      removalConfirming: false,
      nameText: "",
    }
  }

  handleToggleEditing = () => {
    if (this.state.editing) {
      const { onChangeItemName } = this.props
      // finish editing
      this.setState({editing: false})

      onChangeItemName(this.state.nameText)
    } else {
      // start editing
      this.setState({
        editing: true,
        nameText: this.props.moraleInfo.name,
      })
    }
  }

  handleEditingName = e =>
    this.setState({nameText: e.target.value})

  render() {
    const {
      moraleInfo,
      onRemoveItem,
      onCloneItem,
      onMoveUp,
      onMoveDown,
    } = this.props
    const { wSubject } = moraleInfo

    const title = WSubject.destruct({
      fleet: fleetId => `${__('FleetList.Fleet')} #${fleetId}`,
      preset: presetNo => `${__('FleetList.Preset')} #${presetNo}`,
      custom: id => `${__('FleetList.Custom')} #${id}`,
      lbas: world => `${__('FleetList.Lbas', world)}`,
    })(wSubject)

    const isLbasItem = wSubject.type === 'lbas'
    const isCustom = wSubject.type === 'custom'

    const xButtonStyle = {
      paddingTop: 0,
      marginLeft: 16,
    }
    return (
      <ListGroupItem
        style={{
          padding: 0,
          marginBottom: 5,
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '2px 4px 5px',
            backgroundColor: '#424242',
          }}
        >
          <div
            style={{
              fontSize: 14,
              width: 'auto',
              flex: 1,
            }}
          >
            {title}
          </div>
          <Button
            bsSize="xsmall"
            disabled={typeof onMoveUp !== 'function'}
            style={xButtonStyle}
            onClick={onMoveUp}
          >
            <FontAwesome name="arrow-up" />
          </Button>
          <Button
            bsSize="xsmall"
            disabled={typeof onMoveDown !== 'function'}
            style={xButtonStyle}
            onClick={onMoveDown}
          >
            <FontAwesome name="arrow-down" />
          </Button>
          <Button
            bsSize="xsmall"
            style={
              {
                ...xButtonStyle,
                ...(isLbasItem ? {visibility: 'hidden'} : null),
              }
            }
            disabled={isLbasItem || moraleInfo.ships.length === 0}
            onClick={isCustom ? this.handleToggleEditing : onCloneItem}
          >
            <FontAwesome
              name={isCustom ? (this.state.editing ? 'check' : 'pencil') : 'save'}
            />
          </Button>
          {
            !this.state.removalConfirming && (
              <Button
                bsSize="xsmall"
                style={xButtonStyle}
                onClick={() => this.setState({removalConfirming: true})}
              >
                <FontAwesome name="close" />
              </Button>
            )
          }
          {
            this.state.removalConfirming && (
              <Button
                bsSize="xsmall"
                bsStyle="danger"
                style={xButtonStyle}
                onClick={onRemoveItem}
              >
                <FontAwesome name="trash" />
              </Button>
            )
          }
          {
            this.state.removalConfirming && (
              <Button
                bsSize="xsmall"
                style={xButtonStyle}
                onClick={() => this.setState({removalConfirming: false})}
              >
                <FontAwesome name="undo" />
              </Button>
            )
          }
        </div>
        {
          wSubject.type === 'lbas' ?
            (<LbasView moraleInfo={moraleInfo} />) :
            (
              <FleetView
                moraleInfo={moraleInfo}
                editing={this.state.editing}
                nameText={this.state.nameText}
                handleEditingName={this.handleEditingName}
              />
            )
        }
      </ListGroupItem>
    )
  }
}

export {
  ListItem,
}
