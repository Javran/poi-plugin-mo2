import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Nav, NavItem } from 'react-bootstrap'

import {
  reducer,
  mapDispatchToProps,
} from './reducer'
import { moraleMonitorSelector } from './selectors'

import { PTyp } from './ptyp'
import { FleetMoraleList } from './ui/fleet-morale-list'
import { ShipMoraleList } from './ui/ship-morale-list'

class MoraleMonitor extends Component {
  static propTypes = {
    admiralId: PTyp.number,
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.array.isRequired,
    shipsInfo: PTyp.object.isRequired,
    stypeInfo: PTyp.array.isRequired,

    onInitialize: PTyp.func.isRequired,
    onModifyConfig: PTyp.func.isRequired,
  }

  static defaultProps = {
    admiralId: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'ship',
    }
  }

  componentWillMount() {
    const { onInitialize, admiralId } = this.props
    onInitialize(admiralId)
  }

  handleTabSwitch = activeTab =>
    this.setState({ activeTab })

  render() {
    const { activeTab } = this.state
    return (
      <div
          style={{
            margin: "8px",
          }}
      >
        <Nav
            bsStyle="tabs"
            activeKey={activeTab}
            onSelect={this.handleTabSwitch}
            style={{marginBottom: "6px"}}
            justified className="main-nav">
          <NavItem eventKey="fleet">Fleets</NavItem>
          <NavItem eventKey="ship">Ships</NavItem>
        </Nav>
        <FleetMoraleList
            visible={activeTab === 'fleet'}
            moraleList={this.props.moraleList}
            availableTargets={this.props.availableTargets}
            onModifyConfig={this.props.onModifyConfig}
        />
        <ShipMoraleList
            visible={activeTab === 'ship'}
            shipsInfo={this.props.shipsInfo}
            stypeInfo={this.props.stypeInfo}
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
