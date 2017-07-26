import { PropTypes } from 'prop-types'

import { ShipFilter } from './ship-filters'

const allRequired = shapeObj => {
  const ret = {}
  Object.keys(shapeObj).map(k => {
    const original = shapeObj[k]
    ret[k] = typeof original.isRequired !== 'undefined'
      ? original.isRequired
      : PropTypes.oneOfType([original]).isRequired
  })
  return ret
}

const ShipInfo = PropTypes.shape({
  ...allRequired({
    rstId: PropTypes.number,
    mstId: PropTypes.number,
    name: PropTypes.string,
    stype: PropTypes.number,
    typeName: PropTypes.string,
    level: PropTypes.number,
    morale: PropTypes.number,
    sortNo: PropTypes.number,
  }),
  fleet: PropTypes.number,
})

const WSubjectAlts = {
  Fleet: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['fleet']),
    fleetId: PropTypes.oneOf([1,2,3,4]),
  })),
  Preset: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['preset']),
    presetNo: PropTypes.number,
  })),
  Custom: PropTypes.shape(allRequired({
    type: PropTypes.oneOf(['custom']),
    id: PropTypes.number,
    name: PropTypes.string,
    ships: PropTypes.arrayOf(PropTypes.number),
  })),
}

const WSubject = PropTypes.oneOfType([
  WSubjectAlts.Fleet,
  WSubjectAlts.Preset,
  WSubjectAlts.Custom,
])

const MoraleInfo = PropTypes.shape({
  wSubject: WSubject.isRequired,
  name: PropTypes.string,
  ships: PropTypes.arrayOf(ShipInfo).isRequired,
})

const STypeInfo = PropTypes.shape(allRequired({
  name: PropTypes.string,
  stype: PropTypes.number,
}))

const SortMethod = PropTypes.oneOf([
  'rid','name','stype','level','morale'])

const FilterSType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf(
    [...ShipFilter.specialFilters.keys()]),
])

const Layout = PropTypes.oneOf([
  'horizontal', 'vertical'])

const Tab = PropTypes.oneOf(['fleet', 'ship'])

const PTyp = {
  ...PropTypes,

  ShipInfo,
  MoraleInfo,

  STypeInfo,

  SortMethod,
  FilterSType,
  Layout,
  Tab,
}

export { PTyp }
