import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Nav, NavItem } from 'react-bootstrap'

import {
  mapDispatchToProps,
} from '../store'
import { moraleMonitorSelector } from '../selectors'

import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { FleetMoraleList } from './fleet-morale-list'
import { ShipMoraleList } from './ship-morale-list'

class MoraleMonitorImpl extends Component {
  static propTypes = {
    moraleList: PTyp.array.isRequired,
    availableTargets: PTyp.array.isRequired,
    shipList: PTyp.array.isRequired,
    stypeInfo: PTyp.array.isRequired,
    layout: PTyp.Layout.isRequired,

    filterSType: PTyp.FilterSType.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'fleet',
    }
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
          <NavItem eventKey="fleet">{__('Tab.Fleet')}</NavItem>
          <NavItem eventKey="ship">{__('Tab.Ship')}</NavItem>
        </Nav>
        <FleetMoraleList
            visible={activeTab === 'fleet'}
            moraleList={this.props.moraleList}
            availableTargets={this.props.availableTargets}
        />
        <ShipMoraleList
            visible={activeTab === 'ship'}
            layout={this.props.layout}
            stypeInfo={this.props.stypeInfo}
            shipList={this.props.shipList}
            filterMorale={this.props.filterMorale}
            filterSType={this.props.filterSType}
            sortMethod={this.props.sortMethod}
            sortReverse={this.props.sortReverse}
        />
      </div>
    )
  }
}

const MoraleMonitor = connect(
  moraleMonitorSelector,
  mapDispatchToProps,
)(MoraleMonitorImpl)

export { MoraleMonitor }