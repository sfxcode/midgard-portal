import DiceBox from '@3d-dice/dice-box'
import type { DiceRoll } from '~/types'

interface RollOptions {
  theme?: string
  newStartPoint?: boolean
}

type RollObject = { qty?: number, sides: number | string, [key: string]: unknown }
type DiceNotation = string | RollObject | Array<string | RollObject>

interface RollGroup {
  value: number
  qty: number
  rolls: DiceRoll[]
  [key: string]: unknown
}

interface DiceBoxInstance {
  init: () => Promise<void>
  roll: (notation: DiceNotation, options?: RollOptions) => Promise<DiceRoll[]>
  add: (notation: DiceNotation, options?: RollOptions) => Promise<DiceRoll[]>
  reroll: (notation: DiceNotation, options?: RollOptions) => Promise<DiceRoll[]>
  remove: (notation: DiceNotation, options?: RollOptions) => Promise<DiceRoll[]>
  clear: () => void
  hide: (className?: string) => void
  show: () => void
  getRollResults: () => RollGroup[]
  updateConfig: (config: Record<string, unknown>) => void
}

export function useDiceBox() {
  let diceBox: DiceBoxInstance

  async function initDiceBox(container: string, scale: number = 8, onRollComplete?: (groups: RollGroup[]) => void, options: { theme?: string, themeColor?: string } = {}) {
    diceBox = new DiceBox({
      container,
      assetPath: '/dice-box/',
      scale,
      theme: options.theme ?? 'rock',
      ...(options.themeColor ? { themeColor: options.themeColor } : {}),
      settleTimeout: 3000,
      onRollComplete
    })
    await diceBox.init()
    return diceBox
  }

  function roll(notation: DiceNotation, options?: RollOptions) {
    return diceBox.roll(notation, options)
  }

  function add(notation: DiceNotation, options?: RollOptions) {
    return diceBox.add(notation, options)
  }

  function reroll(notation: DiceNotation, options?: RollOptions) {
    return diceBox.reroll(notation, options)
  }

  function remove(notation: DiceNotation, options?: RollOptions) {
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

  function updateConfig(config: Record<string, unknown>) {
    diceBox?.updateConfig(config)
  }

  return { initDiceBox, roll, add, reroll, remove, clear, hide, show, getRollResults, updateConfig }
}
