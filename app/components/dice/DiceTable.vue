<script setup lang="ts">
import { useDiceBox } from '~/composables/tools/useDiceBox'
import type { DiceRoll } from '~/types'

// a type alias (not an interface) so it is assignable to dice-box's open-ended roll object
type DieSpec = { qty: number, sides: number }

const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100]
const DEFAULT_EXPRESSION = 'W100 + W20 + W6'
const MAX_DICE = 12

const { initDiceBox, roll } = useDiceBox()
const boxId = `dice-box-${useId()}`
const container = useTemplateRef<HTMLElement>('container')
const { width: containerWidth } = useElementSize(container)

// The 3D scene sizes its canvas from the container when it is created, so create it only once the
// container is actually visible (the drawer's copy is mounted while hidden at 0x0)
let boxReady: Promise<unknown> | undefined
const { history, addEntry, clearHistory } = useDiceHistory()

const result = ref<DiceRoll[]>()
const rolling = ref(false)
const customExpression = ref('')
const errorMessage = ref('')
const modifier = ref(0)
let currentExpression = DEFAULT_EXPRESSION

// "3W6+2", "w100 + w20 + w6", "2d20-1" -> dice list plus a flat modifier; null when it is not a dice expression
function parseExpression(text: string): { dice: DieSpec[], modifier: number } | null {
  const parts = text.replace(/\s+/g, '').toLowerCase().match(/[+-]?[^+-]+/g)
  if (!parts) return null
  const dice: DieSpec[] = []
  let flat = 0
  for (const part of parts) {
    const sign = part.startsWith('-') ? -1 : 1
    const body = part.replace(/^[+-]/, '')
    const diceMatch = body.match(/^(\d*)[wd](\d+)$/)
    if (diceMatch) {
      const qty = diceMatch[1] ? Number(diceMatch[1]) : 1
      const sides = Number(diceMatch[2])
      if (sign < 0 || qty < 1 || sides < 2) return null
      dice.push({ qty, sides })
    } else if (/^\d+$/.test(body)) {
      flat += sign * Number(body)
    } else {
      return null
    }
  }
  const count = dice.reduce((sum, die) => sum + die.qty, 0)
  return dice.length > 0 && count <= MAX_DICE ? { dice, modifier: flat } : null
}

async function rollExpression(expression: string) {
  if (!boxReady) return
  const parsed = parseExpression(expression)
  if (!parsed) {
    errorMessage.value = `Ungültiger Wurf. Beispiele: W20, 3W6+2, W100 + W20 (höchstens ${MAX_DICE} Würfel).`
    return
  }
  errorMessage.value = ''
  currentExpression = expression
  modifier.value = parsed.modifier
  rolling.value = true
  try {
    await boxReady
    await roll(parsed.dice)
  } finally {
    rolling.value = false
  }
}

function labelOf(expression: string) {
  return expression.replace(/\s+/g, '').toUpperCase().replace(/D(?=\d)/g, 'W').replace(/\+/g, ' + ').replace(/-/g, ' - ')
}

function rollCustom() {
  if (customExpression.value.trim()) {
    rollExpression(customExpression.value)
  }
}

function onRollComplete(groups: { rolls: DiceRoll[] }[]) {
  const rolls = groups.flatMap(group => group.rolls)
  result.value = rolls
  const counted = rolls.filter(r => !r.drop && !r.reroll && typeof r.value === 'number')
  const total = counted.reduce((sum, r) => sum + (r.value as number), 0) + modifier.value
  const detail = rolls.map(r => `W${r.die ?? r.sides}: ${r.value}`).join(' · ')
  addEntry({ expression: currentExpression, total, detail })
}

// Debounced so the scene is built from the settled layout width, not a transitional one
watchDebounced(containerWidth, (width) => {
  if (width > 0 && !boxReady) {
    boxReady = initDiceBox(`#${boxId}`, 8, onRollComplete, { theme: 'smooth', themeColor: '#EFE3C2', size: 7.2 })
  }
}, { debounce: 300, immediate: true })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-1.5">
      <UButton
        v-for="sides in QUICK_DICE"
        :key="sides"
        :label="`W${sides}`"
        size="xs"
        color="neutral"
        variant="subtle"
        :disabled="rolling"
        @click="rollExpression(`W${sides}`)"
      />
      <UButton
        label="Standard"
        size="xs"
        color="neutral"
        variant="outline"
        :disabled="rolling"
        title="W100 + W20 + W6"
        @click="rollExpression(DEFAULT_EXPRESSION)"
      />
    </div>

    <form class="flex gap-2" @submit.prevent="rollCustom">
      <UInput
        v-model="customExpression"
        icon="i-game-icons-rolling-dices"
        placeholder="Eigener Wurf, z. B. 3W6+2"
        class="flex-1"
        aria-label="Eigener Wurf"
      />
      <UButton
        type="submit"
        label="Würfeln"
        icon="i-game-icons-rolling-dices"
        :loading="rolling"
        :disabled="!customExpression.trim()"
      />
    </form>
    <p v-if="errorMessage" class="text-sm text-error" role="alert">
      {{ errorMessage }}
    </p>

    <div class="min-h-9" aria-live="polite">
      <DiceResultDisplay
        v-if="result"
        :results="result"
        labeled
        :modifier="modifier"
      />
    </div>

    <div class="relative">
      <div
        :id="boxId"
        ref="container"
        class="rpg-tray h-80 w-full"
        @click="rollExpression(currentExpression)"
      />
      <div
        v-if="!result"
        class="pointer-events-none absolute inset-x-0 bottom-9 flex flex-col items-center gap-0.5 text-center text-[#EFE3C2]"
      >
        <p class="font-display tracking-wide">
          Tippe auf den Tisch, um zu würfeln
        </p>
        <p class="text-xs opacity-80">
          Standard: {{ DEFAULT_EXPRESSION }}
        </p>
      </div>
    </div>

    <div v-if="history.length" class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <p class="rpg-section-title flex-1">
          Letzte Würfe
        </p>
        <UButton
          label="Leeren"
          size="xs"
          color="neutral"
          variant="link"
          @click="clearHistory"
        />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <UButton
          v-for="entry in history"
          :key="entry.id"
          size="xs"
          color="neutral"
          variant="subtle"
          :title="`${entry.detail} – erneut würfeln`"
          :disabled="rolling"
          @click="rollExpression(entry.expression)"
        >
          <span class="text-muted">{{ labelOf(entry.expression) }}</span>
          <span class="font-semibold text-highlighted">= {{ entry.total }}</span>
        </UButton>
      </div>
    </div>
  </div>
</template>

<style>
.dice-box-canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
