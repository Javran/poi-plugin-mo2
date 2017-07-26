import { join } from 'path-extra'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { modifyObject } from 'subtender'
import {
  mapDispatchToProps,
} from '../store'
import {
  tabSelector,
  moraleMonitorSelector,
} from '../selectors'

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
    tab: PTyp.Tab.isRequired,

    filterSType: PTyp.FilterSType.isRequired,
    filterMorale: PTyp.string.isRequired,
    sortMethod: PTyp.SortMethod.isRequired,
    sortReverse: PTyp.bool.isRequired,

    configModify: PTyp.func.isRequired,
  }

  handleSelectTab = tab =>
    this.props.configModify(
      modifyObject('tab', () => tab))

  render() {
    const { tab } = this.props
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
            <FleetMoraleList
              moraleList={this.props.moraleList}
              availableTargets={this.props.availableTargets}
            />
          </Tab>
          <Tab eventKey="ship" title={__('Tab.Ship')}>
            <ShipMoraleList
              layout={this.props.layout}
              stypeInfo={this.props.stypeInfo}
              shipList={this.props.shipList}
              filterMorale={this.props.filterMorale}
              filterSType={this.props.filterSType}
              sortMethod={this.props.sortMethod}
              sortReverse={this.props.sortReverse} />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const MoraleMonitor = connect(
  state => {
    const props = moraleMonitorSelector(state)
    const tab = tabSelector(state)
    return {
      ...props,
      tab,
    }
  },
  mapDispatchToProps,
)(MoraleMonitorImpl)

export { MoraleMonitor }
