import DiceBox from '@3d-dice/dice-box'

export function useDiceBox() {
  let diceBox: any

  async function initDiceBox(container: string, scale: number = 8) {
    diceBox = new DiceBox({
      container,
      assetPath: '/dice-box/',
      scale,
      theme: 'rock',
      settleTimeout: 3000
    })
    await diceBox.init()
    return diceBox
  }

  async function roll(notation: any) {
    return diceBox.roll(notation)
  }

  function clear() {
    diceBox?.clear()
  }

  return { initDiceBox, roll, clear }
}
