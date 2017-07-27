import { join } from 'path-extra'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { modifyObject } from 'subtender'
import {
  mapDispatchToProps,
} from '../store'
import {
  extSelector,
} from '../selectors'

import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { FleetMoraleList } from './fleet-morale-list'
import { ShipMoraleList } from './ship-morale-list'

class MoraleMonitorImpl extends Component {
  static propTypes = {
    tab: PTyp.Tab.isRequired,
    configModify: PTyp.func.isRequired,
  }

  handleSelectTab = tab =>
    this.props.configModify(
      modifyObject('tab', () => tab))

  render() {
    const {tab} = this.props
    return (
      <div
        style={{margin: 8}}
      >
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'mo2.css')}
        />
        <Tabs
          activeKey={tab}
          onSelect={this.handleSelectTab}
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
  state => ({
    tab: extSelector(state).tab,
  }),
  mapDispatchToProps,
)(MoraleMonitorImpl)

export { MoraleMonitor }
