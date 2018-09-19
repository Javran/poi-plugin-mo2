import React, { PureComponent } from 'react'
import {
  FormControl,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { __ } from '../../../tr'
import { WSubject } from '../../../structs'
import { Morale } from '../../morale'

class FleetView extends PureComponent {
  static propTypes = {
    moraleInfo: PTyp.object.isRequired,

    editing: PTyp.bool.isRequired,
    nameText: PTyp.string.isRequired,
    handleEditingName: PTyp.func.isRequired,
  }

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

      editing,
      nameText,
      handleEditingName,
    } = this.props
    const { name, ships } = moraleInfo

    const minMorale =
      ships.length > 0 ?
        Math.min(...ships.map(s => s.morale)) :
        null

    const fsDesc =
      ships.length > 0 ?
        `${ships[0].name} Lv.${ships[0].level} (${ships[0].rstId})` :
        "-"

    return (
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
            editing ? (
              <FormControl
                onChange={handleEditingName}
                value={nameText}
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
    )
  }
}

export { FleetView }
