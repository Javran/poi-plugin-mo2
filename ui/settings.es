import _ from 'lodash'
import React, { Component } from 'react'
import {
  createStructuredSelector,
} from 'reselect'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Tooltip, OverlayTrigger,
  Button,
} from 'react-bootstrap'
import Markdown from 'react-remarkable'
import { modifyObject } from 'subtender'

import { initState, mapDispatchToProps } from '../store'
import { filterMethodsSelector } from '../selectors'
import { PTyp } from '../ptyp'
import { __ } from '../tr'
import { intPredRepsFromUserInput, intPredRepsToUserInput } from '../structs'

class SettingsImpl extends Component {
  static propTypes = {
    filterMethods: PTyp.arrayOf(PTyp.object).isRequired,
    pStateModify: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      filterMethodsStr: intPredRepsToUserInput(props.filterMethods),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filterMethodsStr: intPredRepsToUserInput(nextProps.filterMethods),
    })
  }

  replaceFilterMethods = filterMethods =>
    this.props.pStateModify(
      modifyObject(
        'ships',
        modifyObject(
          'filter',
          modifyObject(
            'methods', () => filterMethods
          )
        )
      )
    )

  handleFilterMethodsStrChange = e => {
    const filterMethodsStr = e.target.value
    this.setState({filterMethodsStr})
  }

  handleFilterMethodsReset = () =>
    this.setState({
      filterMethodsStr: intPredRepsToUserInput(this.props.filterMethods),
    })

  handleFilterMethodsResetToDefault = () => {
    const defFilterMethods =
      initState.ships.filter.methods
    this.replaceFilterMethods(defFilterMethods)
    this.setState({
      filterMethodsStr: intPredRepsToUserInput(defFilterMethods),
    })
  }

  handleFilterMethodsSave = parsed => () =>
    this.replaceFilterMethods(parsed)

  render() {
    const parsed = intPredRepsFromUserInput(this.state.filterMethodsStr)
    const isInputValid = Boolean(parsed)
    return (
      <div
        style={{marginBottom: '1.8em'}}
      >
        <FormGroup>
          <ControlLabel>{__('CustomMoraleFilters')}</ControlLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <Button
              onClick={this.handleFilterMethodsResetToDefault}
              bsSize="small">
              <FontAwesome name="undo" />
            </Button>
            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip
                    className="mo2-pop"
                    id="mo2-settings-morale-filter-syntax-tooltip">
                    <Markdown
                      source={
                        _.join(__('CustomMoraleFiltersTooltipMD'),'\n')
                      }
                    />
                  </Tooltip>
                )
              }
            >
              <FormControl
                style={{marginLeft: '.4em', marginRight: '.4em'}}
                onChange={this.handleFilterMethodsStrChange}
                value={this.state.filterMethodsStr}
                type="text"
              />
            </OverlayTrigger>
            <Button
              bsStyle={isInputValid ? 'default' : 'danger'}
              disabled={!isInputValid}
              onClick={this.handleFilterMethodsSave(parsed)}
              bsSize="small"
            >
              <FontAwesome name="save" />
            </Button>
            <Button
              onClick={this.handleFilterMethodsReset}
              bsSize="small"
            >
              <FontAwesome name="close" />
            </Button>
          </div>
        </FormGroup>
      </div>
    )
  }
}

const Settings = connect(
  createStructuredSelector({
    filterMethods: filterMethodsSelector,
  }),
  mapDispatchToProps
)(SettingsImpl)

export { Settings }
