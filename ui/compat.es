import { Classes } from '@blueprintjs/core'

const usingBp5 = Classes.POPOVER_TARGET === 'bp5-popover-target'

const CompatClasses =
  usingBp5 ?
    {
      POPOVER_TARGET: Classes.POPOVER_TARGET,
      POPOVER_DISMISS: Classes.POPOVER_DISMISS,
    } :
    {
      POPOVER_TARGET: 'bp4-popover2-target',
      POPOVER_DISMISS: 'bp4-popover2-dismiss',
    }

export {
  usingBp5,
  CompatClasses,
}
