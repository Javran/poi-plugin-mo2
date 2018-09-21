import React, { PureComponent } from 'react'
import { join } from 'path-extra'
import { PTyp } from '../../../ptyp'

import { LbasActionLabel } from './lbas-action-label'

/* eslint-disable indent */
const condToClassName = cond =>
  cond === 1 ? 'poi-ship-cond-49' :
  cond === 2 ? 'poi-ship-cond-20' :
  cond === 3 ? 'poi-ship-cond-0' :
  ''
/* eslint-enable indent */

const impText = imp => {
  if (imp === 0)
    return '★+0'
  if (imp === 10)
    return '★Mx'
  return `★+${imp}`
}

class LbasSquadronView extends PureComponent {
  static propTypes = {
    info: PTyp.object.isRequired,
  }

  render() {
    const {info} = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          key="name"
          className={condToClassName(info.cond)}
          style={{
            minWidth: 1,
            textAlign: 'center',
            fontSize: '1.5em',
            fontWeight: 'bold',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {info.name}
        </div>
        <LbasActionLabel
          actionKind={info.actionKind}
          style={{
            alignSelf: 'center',
            width: '6em',
          }}
        />
        {
          info.planeInfo.map(pi => pi ? (
            <div
              key={pi.rId}
              style={{
                display: 'flex',
                marginTop: 4,
                ...(pi.state === 2 ? {opacity: 0.4} : {}),
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '.2em',
                  minWidth: 1,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    minWidth: 1,
                  }}
                  className={condToClassName(pi.cond)}
                >
                  {pi.name}
                </div>
                {
                  (pi.improve > 0) && (
                    <div style={{color: '#45a9a5'}}>
                      {impText(pi.improve)}
                    </div>
                  )
                }
              </div>
              <img
                style={{
                  height: '1.2em',
                  /*
                     assuming alvX.png are all of the same dimension size,
                     we want ace to take space without actually showing it,
                   */
                 ...(pi.ace === 0 ? {visibility: 'hidden'} : null),
                }}
                alt={`ace-${info.ace}`}
                src={join('assets', 'img', 'airplane', `alv${pi.ace > 0 ? pi.ace : 1}.png`)}
              />
              <div
                style={{
                  width: '3.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{fontSize: '110%', fontWeight: 'bold'}}
                  className={pi.count.now !== pi.count.max ? 'poi-ship-cond-20' : ''}
                >
                  {pi.state === 2 ? '-' : pi.count.now}
                </div>
                <div
                  className="text-muted"
                  style={{fontSize: '80%', marginLeft: '.2em'}}
                >
                  /{pi.state === 2 ? '-' : pi.count.max}
                </div>
              </div>
            </div>
          ) : (
            <div style={{textAlign: 'center', fontSize: '1.2em'}}>
              -
            </div>
          )
          )
        }
      </div>
    )
  }
}

export { LbasSquadronView }
