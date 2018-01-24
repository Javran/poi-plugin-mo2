import _ from 'lodash'
import P from 'parsimmon'

import { expectObject, reportTypeError } from './common'

// note the flip of args, which is intended as we are giving rhs first.
const intPredRepConsts = [
  {
    type: 'lessThan',
    binary: value => input => input < value,
    symbol: '<',
    userInputSymbol: '<',
  },
  {
    type: 'lessOrEqual',
    binary: value => input => input <= value,
    symbol: '≤',
    userInputSymbol: '<=',
  },
  {
    type: 'greaterThan',
    binary: value => input => input > value,
    symbol: '>',
    userInputSymbol: '>',
  },
  {
    type: 'greaterOrEqual',
    binary: value => input => input >= value,
    symbol: '≥',
    userInputSymbol: '>=',
  },
  {
    type: 'equal',
    binary: value => input => input === value,
    symbol: '=',
    userInputSymbol: '=',
  },
]


// assumes a non-space starting point
let inputParser
{
  const mkParser = (prefix, type) =>
    P.string(prefix).then(
      P.optWhitespace
    ).then(
      P.regexp(/[0-9]+/).map(Number)
    ).map(
      value => ({type, value})
    ).skip(
      P.optWhitespace
    )

  inputParser = P.alt(
    ...[
      /*
         making long prefix (without ambiguity) go first
       */
      ['>=', 'greaterOrEqual'],
      ['<=', 'lessOrEqual'],
      ['>', 'greaterThan'],
      ['<', 'lessThan'],
      ['=', 'equal'],
    ].map(
      ([prefix, type]) => mkParser(prefix, type)
    )
  )
}

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

  // toString = IntPredRep.mkToString([i18n translator])
  static mkToString = tr /* i18n */ => {
    let allStr
    if (!tr) {
      allStr = 'All'
    } else if (typeof tr !== 'function') {
      console.warn(`expect tr to be function while getting ${tr}`)
      allStr = 'all'
    } else {
      allStr = tr('ShipList.All')
    }

    return IntPredRep.destruct(
      _.fromPairs(
        [
          ...intPredRepConsts.map(({type, symbol}) =>
            [type, value => `${symbol} ${value}`]
          ),
          ['all', _obj => allStr],
        ]
      )
    )
  }

  static toUserInput = IntPredRep.destruct(
    _.fromPairs(
      [
        ...intPredRepConsts.map(({type,userInputSymbol}) =>
          [type, value => `${userInputSymbol}${value}`]
        ),
        ['all', _obj => console.error(`cannot convert "all" to user input`)],
      ]
    )
  )

  static inputParser = inputParser
}

// NOTE: {type: 'all'} is not allowed
const intPredRepsToUserInput =
  xs => xs.map(IntPredRep.toUserInput).join(',')

const rawInputParser =
  inputParser.sepBy(
    /* comma with optional spaces */
    P.regexp(/,\s*/)
  ).trim(
    P.optWhitespace
  )

const intPredRepsFromUserInput = raw => {
  const pResult = rawInputParser.parse(raw)
  return pResult.status ? pResult.value : null
}

export {
  IntPredRep,
  intPredRepsToUserInput,
  intPredRepsFromUserInput,
}
