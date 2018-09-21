import React, { PureComponent } from 'react'
import {
  FormControl,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap'

import FontAwesome from 'react-fontawesome'

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

    const isEmpty = ships.length === 0
    const minMorale = isEmpty ? null : Math.min(...ships.map(s => s.morale))
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '5px 10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '85%',
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
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
                >
                {name}
              </div>
            )
          }
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              fontSize: '120%',
            }}
          >
            {
              isEmpty ? (
                <div style={{flex: 1}} />
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    minWidth: 0,
                  }}
                >
                  <FontAwesome
                    name="flag"
                    style={{
                      height: '1em',
                      alignSelf: 'center',
                    }}
                  />
                  <div
                    style={{
                      marginLeft: '.2em',
                      minWidth: 1,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      fontSize: 'bold',
                    }}
                  >
                    {ships[0].name}
                  </div>
                  <div
                    style={{
                      fontSize: '70%',
                      marginLeft: '.2em',
                    }}
                  >
                    ({ships[0].rstId})
                  </div>
                </div>
              )
            }
            <div
              style={{
                width: '4.8em',
                paddingRight: '.2em',
                textAlign: 'right',
              }}
            >
              {ships.length} ship(s)
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
              style={{width: '15%'}}
              morale={minMorale}
            />
          )
        }
      </div>
    )
  }
}

export { FleetView }
