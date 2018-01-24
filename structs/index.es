import _ from 'lodash'

// "expectObject(f,err)(x)" acts like "f(x)" given that "x" is indeed an object
// error will be reported through console.error otherwise.
const expectObject = f => x =>
  typeof x === 'object'
    ? f(x)
    : console.error(`Expecting an Object while value of type ${typeof x} is received`)

const reportTypeError = (cls,actualType) =>
  console.error(`Invalid ${cls.name} type: ${actualType}`)

class WSubject {
  /* eslint-disable indent */
  static destruct = ({fleet,preset,custom}) => expectObject(obj =>
    obj.type === 'fleet' ? fleet(obj.fleetId,obj) :
    obj.type === 'preset' ? preset(obj.presetNo, obj) :
    obj.type === 'custom' ? custom(obj.id, obj.name, obj.ships, obj) :
    reportTypeError(WSubject,obj.type))
  /* eslint-enable indent */

  static id = WSubject.destruct({
    fleet: fleetId => `fleet-${fleetId}`,
    preset: presetNo => `preset-${presetNo}`,
    custom: id => `custom-${id}`,
  })
}

// note the flip of args, which is intended as we are giving rhs first.
const intPredRepConsts = [
  {
    type: 'lessThan',
    binary: value => input => input < value,
  },
  {
    type: 'lessOrEqual',
    binary: value => input => input <= value,
  },
  {
    type: 'greaterThan',
    binary: value => input => input > value,
  },
  {
    type: 'greaterOrEqual',
    binary: value => input => input >= value,
  },
  {
    type: 'equal',
    binary: value => input => input === value,
  },
]

/*
   a representation of simple predicates on integers:

   {
     type: <see 'intPredRepConsts'>
     value: an integer
   }

   additionally, the following structure is also accepted:

   {
     type: 'all'
   }

   which always return true

 */
class IntPredRep {
  static consts = intPredRepConsts

  static destruct = callbacks => expectObject(obj => {
    if (obj.type === 'all') {
      return callbacks['all'](obj)
    }
    const tyInd = intPredRepConsts.findIndex(c => c.type === obj.type)
    if (tyInd === -1) {
      return reportTypeError(IntPredRep, obj.type)
    } else {
      const {type} = obj
      const {
        [type]: callback,
      } = callbacks
      return callback(obj.value, obj)
    }
  })

  static toPredicate = IntPredRep.destruct(
    _.fromPairs(
      [
        ...intPredRepConsts.map(({type, binary}) => {
          // ignoring 2nd arg (obj)
          const callback = value => binary(value)
          return [type, callback]
        }),
        ['all', _obj => _input => true],
      ]
    )
  )

  static toId = IntPredRep.destruct(
    _.fromPairs(
      [
        ...intPredRepConsts.map(({type}) =>
          [type, value => `${type}-${value}`]
        ),
        ['all', _obj => 'all'],
      ]
    )
  )
}

export {
  WSubject,
  IntPredRep,
}
