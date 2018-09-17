import React, { Component } from 'react'
import {
  ListGroupItem,
  Button,
  FormControl,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'

import { WSubject } from '../../structs'
import { Morale } from '../morale'

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

  makeTooltip = () => {
    const { moraleInfo } = this.props
    const ttId = `mo2-tooltip-${WSubject.id(moraleInfo.wSubject)}`
    return (
      <Tooltip id={ttId}>
        {
          moraleInfo.ships.map(({rstId,name,level,morale}) => (
            <div key={rstId} style={{display: 'flex'}}>
              <div style={{flex: 1, marginRight: 4}}>
                {
                  `${name} Lv.${level}`
                }
              </div>
              <Morale
                style={{fontSize: 'auto'}}
                morale={morale}
              />
            </div>
          ))
        }
      </Tooltip>
    )
  }

  render() {
    const {
      moraleInfo,
      onRemoveItem,
      onCloneItem,
      onMoveUp,
      onMoveDown,
    } = this.props
    const { wSubject, name, ships } = moraleInfo
    const title = WSubject.destruct({
      fleet: fleetId => `${__('FleetList.Fleet')} #${fleetId}`,
      preset: presetNo => `${__('FleetList.Preset')} #${presetNo}`,
      custom: id => `${__('FleetList.Custom')} #${id}`,
      lbas: world => `${__('FleetList.Lbas')} #${world}`,
    })(wSubject)

    // TODO
    if (wSubject.type === 'lbas') {
      return (
        <div>
          {JSON.stringify(wSubject)}
        </div>
      )
    }

    const minMorale =
      ships.length > 0 ?
        Math.min(...ships.map(s => s.morale)) :
        null

    const fsDesc =
      ships.length > 0 ?
        `${ships[0].name} Lv.${ships[0].level} (${ships[0].rstId})` :
        "-"
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
            style={xButtonStyle}
            disabled={moraleInfo.ships.length === 0}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 6,
              display: 'flex',
              flexDirection: 'column',
              marginTop: 5,
              marginLeft: 5,
              paddingBottom: 2,
            }}
          >
            {
              this.state.editing ? (
                <FormControl
                  onChange={this.handleEditingName}
                  value={this.state.nameText}
                />
              ) : (
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {name}
                </div>
              )
            }
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              <div
                style={{
                  flex: 3,
                  fontSize: 15,
                }}
              >
                {__('FleetList.Flagship')}: {fsDesc}
              </div>
              <div
                style={{
                  flex: 2,
                  fontSize: 15,
                }}
              >
                {__('FleetList.ShipCount')}: {ships.length}
              </div>
            </div>
          </div>
          {
            moraleInfo.ships.length > 0 ? (
              <OverlayTrigger placement="left" overlay={this.makeTooltip()}>
                <div style={{flex: 1}} >
                  <Morale morale={minMorale} />
                </div>
              </OverlayTrigger>
            ) : (
              <Morale
                style={{flex: 1}}
                morale={minMorale}
              />
            )
          }
        </div>
      </ListGroupItem>
    )
  }
}

export {
  ListItem,
}
