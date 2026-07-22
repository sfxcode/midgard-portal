import DiceBox from '@3d-dice/dice-box'

interface RollOptions {
  theme?: string
  newStartPoint?: boolean
}

export function useDiceBox() {
  let diceBox: any

  async function initDiceBox(container: string, scale: number = 8, onRollComplete?: (groups: any[]) => void) {
    diceBox = new DiceBox({
      container,
      assetPath: '/dice-box/',
      scale,
      theme: 'rock',
      settleTimeout: 3000,
      onRollComplete
    })
    await diceBox.init()
    return diceBox
  }

  function roll(notation: any, options?: RollOptions) {
    return diceBox.roll(notation, options)
  }

  function add(notation: any, options?: RollOptions) {
    return diceBox.add(notation, options)
  }

  function reroll(notation: any, options?: RollOptions) {
    return diceBox.reroll(notation, options)
  }

  function remove(notation: any, options?: RollOptions) {
    return diceBox.remove(notation, options)
  }

  function clear() {
    diceBox?.clear()
  }

  function hide(className?: string) {
    diceBox?.hide(className)
  }

  function show() {
    diceBox?.show()
  }

  function getRollResults() {
    return diceBox?.getRollResults()
  }

  function updateConfig(config: Record<string, any>) {
    diceBox?.updateConfig(config)
  }

  return { initDiceBox, roll, add, reroll, remove, clear, hide, show, getRollResults, updateConfig }
}
