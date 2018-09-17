import { join } from 'path-extra'
import { modifyObject } from 'subtender'

import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import {
  mapDispatchToProps,
} from '../store'
import {
  tabSelector,
} from '../selectors'

import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { FleetMoraleList } from './fleet-morale-list'
import { ShipMoraleList } from './ship-morale-list'

class MoraleMonitorImpl extends Component {
  static propTypes = {
    tab: PTyp.Tab.isRequired,
    pStateModify: PTyp.func.isRequired,
  }

  handleSelectTab = tab =>
    this.props.pStateModify(
      modifyObject('tab', () => tab)
    )

  render() {
    const {tab} = this.props
    return (
      <div
        style={{
          margin: 8, flex: 1, height: 0,
          display: 'flex', flexDirection: 'column',
        }}
      >
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'mo2.css')}
        />
        <Tabs
          activeKey={tab}
          onSelect={this.handleSelectTab}
          style={{
            flex: 1, height: 0,
            display: 'flex', flexDirection: 'column',
          }}
          animation={false}
          id="mo2-tabs">
          <Tab eventKey="fleet" title={__('Tab.Fleet')}>
            <FleetMoraleList />
          </Tab>
          <Tab eventKey="ship" title={__('Tab.Ship')}>
            <ShipMoraleList />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const MoraleMonitor = connect(
  createStructuredSelector(
    {
      tab: tabSelector,
    }
  ),
  mapDispatchToProps,
)(MoraleMonitorImpl)

export { MoraleMonitor }
