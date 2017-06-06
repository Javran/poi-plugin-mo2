import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
  reducer,
  mapDispatchToProps,
} from './reducer'
import { moraleMonitorSelector } from './selectors'

import { PTyp } from './ptyp'
import { MoraleList } from './ui/morale-list'

class MoraleMonitor extends Component {
  static propTypes = {
    admiralId: PTyp.number,
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.array.isRequired,

    onInitialize: PTyp.func.isRequired,
    onModifyConfig: PTyp.func.isRequired,
  }

  static defaultProps = {
    admiralId: null,
  }

  componentWillMount() {
    const { onInitialize, admiralId } = this.props
    onInitialize(admiralId)
  }

  render() {
    return (
      <div
          style={{
            margin: "8px",
          }}
      >
        <MoraleList
            moraleList={this.props.moraleList}
            availableTargets={this.props.availableTargets}
            onModifyConfig={this.props.onModifyConfig}
        />
      </div>
    )
  }
}

const reactClass = connect(
  moraleMonitorSelector,
  mapDispatchToProps,
)(MoraleMonitor)

export {
  reactClass,
  reducer,
}
