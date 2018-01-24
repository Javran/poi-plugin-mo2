import { enumFromTo } from 'subtender'
import { assert, spec } from '../common'
import { IntPredRep } from '../../structs'

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
})
