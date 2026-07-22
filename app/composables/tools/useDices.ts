import { DiceRoll } from '@dice-roller/rpg-dice-roller'

export function useDices() {
  function diceRollResult(notation: string): DiceRoll {
    const replacedNotation = notation.toLowerCase().replace('w', 'd')
    return new DiceRoll(replacedNotation)
  }

  return { diceRollResult }
}
