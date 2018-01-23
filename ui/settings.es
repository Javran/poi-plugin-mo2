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
  Button,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'
import { initState, mapDispatchToProps } from '../store'
import { lessThanArrSelector } from '../selectors'
import { PTyp } from '../ptyp'
import { __ } from '../tr'

const parseRawLessThanArr = s => {
  const splitted = s.trim().split(',').map(x => x.trim())
  if (splitted.some(x => !x))
    return null
  const parsed = splitted.map(Number)
  if (! parsed.every(x => _.isInteger(x) && x >= 0 && x <= 100))
    return null
  return _.uniq(parsed).sort((x,y) => x-y)
}

class SettingsImpl extends Component {
  static propTypes = {
    lessThanArr: PTyp.arrayOf(PTyp.number).isRequired,
    pStateModify: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      lessThanArrStr: props.lessThanArr.join(','),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lessThanArrStr: nextProps.lessThanArr.join(','),
    })
  }

  replaceLessThanArr = lessThanArr =>
    this.props.pStateModify(
      modifyObject(
        'ships',
        modifyObject(
          'filter',
          modifyObject(
            'lessThanArr', () => lessThanArr
          )
        )
      )
    )

  handleLessThanArrStrChange = e => {
    const lessThanArrStr = e.target.value
    this.setState({lessThanArrStr})
  }

  handleLessThanArrReset = () =>
    this.setState({
      lessThanArrStr: this.props.lessThanArr.join(','),
    })

  handleLessThanArrResetToDefault = () => {
    const defLessThanArr =
      initState.ships.filter.lessThanArr
    this.replaceLessThanArr(defLessThanArr)
    this.setState({lessThanArrStr: defLessThanArr.join(',')})
  }

  handleLessThanArrSave = () => {
    const parsed = parseRawLessThanArr(this.state.lessThanArrStr)
    if (!parsed)
      return
    this.replaceLessThanArr(parsed)
  }

  render() {
    const isInputValid =
      parseRawLessThanArr(this.state.lessThanArrStr) !== null
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
              onClick={this.handleLessThanArrResetToDefault}
              bsSize="small">
              <FontAwesome name="undo" />
            </Button>
            <FormControl
              style={{marginLeft: '.4em', marginRight: '.4em'}}
              onChange={this.handleLessThanArrStrChange}
              value={this.state.lessThanArrStr}
              type="text"
            />
            <Button
              bsStyle={isInputValid ? 'default' : 'danger'}
              disabled={!isInputValid}
              onClick={this.handleLessThanArrSave}
              bsSize="small"
            >
              <FontAwesome name="save" />
            </Button>
            <Button
              onClick={this.handleLessThanArrReset}
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
    lessThanArr: lessThanArrSelector,
  }),
  mapDispatchToProps
)(SettingsImpl)

export { Settings }
