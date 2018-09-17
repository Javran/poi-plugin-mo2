import { expectObject, reportTypeError } from './common'

class WSubject {
  /* eslint-disable indent */
  static destruct = ({fleet,preset,custom,lbas}) => expectObject(obj =>
    obj.type === 'fleet' ? fleet(obj.fleetId,obj) :
    obj.type === 'preset' ? preset(obj.presetNo, obj) :
    obj.type === 'custom' ? custom(obj.id, obj.name, obj.ships, obj) :
    obj.type === 'lbas' ? lbas(obj.world, obj) :
    reportTypeError(WSubject,obj.type))
  /* eslint-enable indent */

  static id = WSubject.destruct({
    fleet: fleetId => `fleet-${fleetId}`,
    preset: presetNo => `preset-${presetNo}`,
    custom: id => `custom-${id}`,
    lbas: id => `lbas-${id}`,
  })
}

export * from './int-pred-rep'
export {
  WSubject,
}
