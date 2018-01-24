import { enumFromTo } from 'subtender'
import { assert, spec } from '../common'
import {
  IntPredRep,
  intPredRepsFromUserInput,
  intPredRepsToUserInput,
} from '../../structs/int-pred-rep'

describe('IntPredRep', () => {
  // assuming consts are correct
  const repConsts = IntPredRep.consts

  /*
     we test one specific pred rep here just to see that args are given in correct order
   */
  spec('toPredicate (sanity)', () => {
    /* eslint-disable no-self-compare */
    {
      const f = IntPredRep.toPredicate({type: 'lessThan', value: 1})
      assert.equal(f(2), 2 < 1)
    }
    {
      const f = IntPredRep.toPredicate({type: 'lessThan', value: 2})
      assert.equal(f(2), 2 < 2)
    }
    {
      const f = IntPredRep.toPredicate({type: 'lessThan', value: 3})
      assert.equal(f(2), 2 < 3)
    }
    /* eslint-enable no-self-compare */
  })

  spec('toPredicate (regular types)', () =>
    repConsts.map(({type, binary}) =>
      enumFromTo(-2,2).map(value => {
        const pred = IntPredRep.toPredicate({type, value})
        assert(typeof pred === 'function')
        enumFromTo(-2,2).map(input =>
          assert.equal(pred(input), binary(value)(input))
        )
      })
    )
  )

  spec('toPredicate (type "all")', () =>
    enumFromTo(-2,2).map(input =>
      assert.equal(IntPredRep.toPredicate({type: 'all'})(input), true)
    )
  )

  spec('toId (sanity)', () => {
    assert.equal(IntPredRep.toId({type: 'all'}), 'all')
    assert.equal(
      IntPredRep.toId({type: 'greaterOrEqual', value: 65535}),
      'greaterOrEqual-65535'
    )
  })

  describe('inputParser', () => {
    const {inputParser} = IntPredRep

    const mkSpec = (raw, expectedStruct) =>
      spec(`raw: "${raw}"`, () =>
        assert.deepEqual(
          inputParser.parse(raw),
          {status: true, value: expectedStruct}
        )
      )

    mkSpec('<20', {type: 'lessThan', value: 20})
    mkSpec('<    40', {type: 'lessThan', value: 40})
    mkSpec('> 1', {type: 'greaterThan', value: 1})
    mkSpec('>= 3', {type: 'greaterOrEqual', value: 3})
    mkSpec('<= 2', {type: 'lessOrEqual', value: 2})
    mkSpec('=4', {type: 'equal', value: 4})
    mkSpec('=5    ', {type: 'equal', value: 5})
  })

  describe('intPredRepsFromUserInput & intPredRepsToUserInput ', () => {
    const mkSpec = (raw, expectedVal) =>
      spec(`raw: "${raw}"`, () =>
        assert.deepEqual(
          intPredRepsFromUserInput(raw),
          expectedVal
        )
      )

    const val =
      [
        {type: 'lessThan', value: 1},
        {type: 'greaterOrEqual', value: 2},
        {type: 'lessOrEqual', value: 3},
        {type: 'equal', value: 4},
        {type: 'greaterThan', value: 5},
      ]

    mkSpec('  <1, >=  \t 2, <= 3, = 4\v\v, > 5   ', val)
    mkSpec(
      '>1,>2,<=3,>1,<=4,=4,=4,<=3',
      [
        {type: 'greaterThan', value: 1},
        {type: 'greaterThan', value: 2},
        {type: 'lessOrEqual', value: 3},
        {type: 'lessOrEqual', value: 4},
        {type: 'equal', value: 4},
      ]
    )

    spec('intPredRepsToUserInput', () =>
      assert.equal(intPredRepsToUserInput(val), '<1,>=2,<=3,=4,>5')
    )
  })
})
