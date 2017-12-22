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

export {
  WSubject,
}
