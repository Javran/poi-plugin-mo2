const getRandomInt = (minR, maxR) => {
  const min = Math.ceil(minR)
  const max = Math.floor(maxR)
  return Math.floor(Math.random() * (max - min)) + min
}

const getOneOf = xs => xs[getRandomInt(0,xs.length)]

const genRandomMorale = () => {
  const type = getOneOf(["red","orange","yellow","white","normal","green","gold"])
  return type === 'red' ? getRandomInt(0,19+1) :
    type === 'orange' ? getRandomInt(20,29+1) :
    type === 'yellow' ? getRandomInt(30,39+1) :
    type === 'white' ? getRandomInt(40,48+1) :
    type === 'normal' ? 49 :
    type === 'gold' ? getRandomInt(50,100+1) :
    100
}

export {
  genRandomMorale,
}
