export interface DiceRoll {
  sides?: number | string
  die?: number | string
  value?: number | string | string[]
  success?: boolean | null
  failures?: number
  critical?: 'success' | 'failure'
  drop?: boolean
  reroll?: boolean
  explode?: boolean
}
