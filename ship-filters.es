const SType = {
  DE: 1, DD: 2, CL: 3, CLT: 4,
  CA: 5, CAV: 6, CVL: 7, FBB: 8,
  BB: 9, BBV: 10, CV: 11, XBB: 12,
  SS: 13, SSV: 14, AP: 15, AV: 16,
  LHA: 17, CVB: 18, AR: 19, AS: 20,
  CT: 21, AO: 22,
}

const isOneOf = xs => x => xs.indexOf(x) !== -1

// predAnd(p1,p2,...)(x)
// => p1(x) && p2(x) && ...
const predAnd = (...predicates) => x => {
  if (predicates.length === 0)
    return true

  let ret
  for (let i=0; i<predicates.length; ++i) {
    ret = predicates[i](x)
    if (!ret) return ret
  }
  return ret
}

/*
   check whether a ship is capable of Daihatsu Landing Craft (DLC for short)

   extracted and refactored from:
     https://github.com/KC3Kai/KC3Kai/blob/master/src/library/objects/Ship.js
 */
const canEquipDLC = (stype, masterId) => {
  const {DD, CL, BB, AV, LHA, AO} = SType
  // some DD / CL / BB are capable of equipping DLC,
  // we deal with this by whitelisting.
  if (isOneOf([DD,CL,BB])(stype)) {
    return isOneOf(
      [
        // Light cruisers
        200, // Abukuma K2
        487, // Kinu K2

        // Destroyers
        418, // Satsuki K2
        434, // Mutsuki K2
        435, // Kisaragi K2
        464, // Kasumi K2
        470, // Kasumi K2B
        199, // Ooshio K2
        468, // Asashio K2D
        490, // Arashio K2
        147, // Verniy
        469, // Kawakaze K2

        // Battleships
        // Nagato K2(541)
        541,
      ])(masterId)
  }

  // most of AV / LHA / AO are capable of equipping DLC,
  // we deal with this by blacklisting those incapables
  if (isOneOf([AV,LHA,AO])(stype)) {
    return !isOneOf(
      [
        445, // Akitsushima
        460, // Hayasui
        491, // Commandant Teste
        162, // Kamoi
      ])(masterId)
  }
}

// special ship type categories
// defined as a Map so that insertion order can be preserved
const specialFilters = new Map()

// define special filters in the following code block and nowhere else.
{
  /*

     - id: a unique string that identifies the filter being defined
     - desc: a string that describes what this filter does in human language
     - func: the actual filtering function that accepts a ShipInfo structure

   */
  const defineSpecialFilter = (id, desc, func) =>
    specialFilters.set(id, Object.freeze({id, desc, func}))

  const isOneOfSType = (...stypes) => s => isOneOf(stypes)(s.stype)

  const {
    DD, CL, CV, CVL, AV, CVB,
    BB, FBB, BBV, XBB,
    SS, SSV, CT, CLT,
  } = SType

  defineSpecialFilter(
    'dd-cl', 'DD / CL',
    isOneOfSType(DD,CL))

  const canShipEquipDLC = ({stype, mstId}) =>
    canEquipDLC(stype, mstId)

  defineSpecialFilter(
    'dlc', 'DLC-capable',
    canShipEquipDLC)

  defineSpecialFilter(
    'dlc-dd-cl', 'DLC-capable (DD / CL only)',
    predAnd(isOneOfSType(DD,CL), canShipEquipDLC))

  defineSpecialFilter(
    'cv-cvl-av', 'CV / CVL / AV',
    isOneOfSType(CV,CVL,AV))

  defineSpecialFilter(
    'cv-cvl-cvb', 'CV / CVL / CVB',
    isOneOfSType(CL,CVL,CVB))

  defineSpecialFilter(
    'battleship', 'Battleships',
    isOneOfSType(BB,FBB,BBV,XBB))

  defineSpecialFilter(
    'sub', 'Submarines',
    isOneOfSType(SS,SSV))

  defineSpecialFilter(
    'cl-clt-ct', 'CL / CLT / CT',
    isOneOfSType(CL,CLT,CT))

  Object.freeze(specialFilters)
}

class ShipFilter {
  static specialFilters = specialFilters
  static prepareShipTypePredicate = x =>
    typeof x === 'number' ? s => s.stype === x :
    specialFilters.has(x) ? specialFilters.get(x).func :
    console.error(`Unknown filter: ${x}`)
}

export {
  canEquipDLC,
  ShipFilter,
}
