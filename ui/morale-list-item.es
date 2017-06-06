import React, { Component } from 'react'
import {
  ListGroupItem,
  Button,
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { WSubject } from '../structs'

// import { genRandomMorale } from '../gen'

const { FontAwesome, isDarkTheme } = window

class MoraleListItem extends Component {
  static propTypes = {
    moraleInfo: PTyp.MoraleInfo.isRequired,

    onRemoveItem: PTyp.func.isRequired,
    onCloneItem: PTyp.func.isRequired,
    onChangeItemName: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      nameText: "",
    }
  }

  componentWillUpdate(nextProps, nextState) {
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

  render() {
    const {
      moraleInfo,
      onRemoveItem,
      onCloneItem,
    } = this.props
    const { wSubject, name, ships } = moraleInfo
    const title = WSubject.destruct({
      fleet: fleetId => `Fleet #${fleetId}`,
      preset: presetNo => `Preset #${presetNo}`,
      custom: id => `Custom #${id}`,
    })(wSubject)


    const minMorale =
      ships.length > 0 ?
        Math.min(...ships.map(s => s.morale)) :
        null
    // const minMorale = genRandomMorale()

    const minMoraleText = minMorale === null ? '-' : String(minMorale)

    const moraleStyle =
      minMorale === null ? {} :
        minMorale <= 48 ? {} :
        minMorale === 49 ? {textShadow: "white 0 0 7px"} :
        {textShadow: "#ffee00 0 0 7px"}

    const moraleClasses =
      minMorale === null ? "" :
      minMorale <= 19 ? "poi-ship-cond-0" :
      minMorale <= 29 ? "poi-ship-cond-20" :
      minMorale <= 39 ? "poi-ship-cond-30" :
      minMorale <= 48 ? "poi-ship-cond-40" :
      minMorale === 49 ? "poi-ship-cond-49" :
      minMorale <= 52 ? "poi-ship-cond-50" :
      "poi-ship-cond-53"

    const fsDesc =
      ships.length > 0 ?
        `${ships[0].name} Lv.${ships[0].level} (${ships[0].rstId})` :
        "-"

    const isCustom = wSubject.type === 'custom'
    const darkOrLight = isDarkTheme ? 'dark' : 'light'
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
          <Button
              bsSize="xsmall"
              style={{
                paddingTop: 0,
              }}
              onClick={isCustom ? this.handleToggleEditing : onCloneItem}
          >
            <FontAwesome name={isCustom ? (this.state.editing ? "check" : "pencil") : "save"} />
          </Button>
          <Button
              bsSize="xsmall"
              style={{
                paddingTop: 0,
                marginLeft: "20px",
              }}
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
              >Flagship: {fsDesc}</div>
              <div
                  style={{
                    flex: 2,
                    fontSize: "15px",
                  }}
              >Ship Count: {ships.length}</div>
            </div>
          </div>
          <div
              className={`${moraleClasses} ${darkOrLight}`}
              style={{
                flex: 1,
                textAlign: "center",
                ...moraleStyle,
                fontSize: "20px",
                fontWeight: "bold",
              }}
          >
            {minMoraleText}
          </div>
        </div>
      </ListGroupItem>
    )
  }
}

export {
  MoraleListItem,
}
