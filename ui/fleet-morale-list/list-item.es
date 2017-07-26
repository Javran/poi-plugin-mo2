import React, { Component } from 'react'
import {
  ListGroupItem,
  Button,
  FormControl,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'

import { WSubject } from '../../structs'

import { Morale } from '../morale'

const { FontAwesome, isDarkTheme } = window

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
      nameText: "",
    }
  }

  componentWillUpdate(_nextProps, nextState) {
    // start editing
    if (! this.state.editing && nextState.editing) {
      this.setState({nameText: this.props.moraleInfo.name})
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
      this.setState({editing: true})
    }
  }

  handleEditingName = e =>
    this.setState({nameText: e.target.value})

  makeTooltip = () => {
    const { moraleInfo } = this.props
    const ttId = `tooltip-mo2-${WSubject.id(moraleInfo.wSubject)}`
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
                isDarkTheme={isDarkTheme}
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
    })(wSubject)

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
            marginBottom: "5px",
            borderRadius: "5px",
            overflow: "hidden",
          }}
      >
        <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "2px 4px 5px",
              backgroundColor:
                isDarkTheme ? "#424242" : "#f5f5f5",
            }}
        >
          <div
              style={{
                fontSize: "14px",
                width: "auto",
                flex: 1,
              }}
          >
            {title}
          </div>
          {
            isCustom && (
              <Button
                bsSize="xsmall"
                disabled={typeof onMoveUp !== 'function'}
                style={xButtonStyle}
                onClick={onMoveUp}
                >
                <FontAwesome
                  name="arrow-up" />
              </Button>
            )
          }
          {
            isCustom && (
              <Button
                bsSize="xsmall"
                disabled={typeof onMoveDown !== 'function'}
                style={xButtonStyle}
                onClick={onMoveDown}
                >
                <FontAwesome
                  name="arrow-down" />
              </Button>
            )
          }
          <Button
              bsSize="xsmall"
              style={xButtonStyle}
              disabled={moraleInfo.ships.length === 0}
              onClick={isCustom ? this.handleToggleEditing : onCloneItem}
          >
            <FontAwesome
              name={isCustom ? (this.state.editing ? "check" : "pencil") : "save"} />
          </Button>
          <Button
              bsSize="xsmall"
              style={xButtonStyle}
              onClick={onRemoveItem}
          >
            <FontAwesome name="close" />
          </Button>
        </div>
        <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
        >
          <div
              style={{
                flex: 6,
                display: "flex",
                flexDirection: "column",
                marginTop: "5px",
                marginLeft: "5px",
                paddingBottom: "2px",
              }}
          >
            {
              this.state.editing ?
              (<FormControl
                   onChange={this.handleEditingName}
                   value={this.state.nameText}
               />) :
              (<div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
              >
                {name}
              </div>)
            }
            <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                }}
            >
              <div
                  style={{
                    flex: 3,
                    fontSize: "15px",
                  }}
              >{__('FleetList.Flagship')}: {fsDesc}</div>
              <div
                  style={{
                    flex: 2,
                    fontSize: "15px",
                  }}
              >{__('FleetList.ShipCount')}: {ships.length}</div>
            </div>
          </div>
          {
            moraleInfo.ships.length > 0 ?
            (<OverlayTrigger placement="left" overlay={this.makeTooltip()}>
              <div style={{flex: 1}} >
                <Morale
                  morale={minMorale}
                  isDarkTheme={isDarkTheme}
                />
              </div>
            </OverlayTrigger>) :
            (<Morale
               style={{flex: 1}}
               morale={minMorale}
               isDarkTheme={isDarkTheme}
            />)
          }
        </div>
      </ListGroupItem>
    )
  }
}

export {
  ListItem,
}