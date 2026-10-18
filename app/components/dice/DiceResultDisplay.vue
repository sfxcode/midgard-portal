<script setup lang="ts">
import type { DiceRoll } from '~/types'

const props = defineProps<{
  results: DiceRoll[]
  /** Authoritative total (e.g. from a dice-parser-interface result). Falls back to summing `results` when omitted. */
  total?: number | string
  /** Group the dice by die size ("W100 22 · W20 10 ...") and add a flat `modifier` to the total. */
  labeled?: boolean
  modifier?: number
}>()

function sides(roll: DiceRoll) {
  return roll.die ?? roll.sides ?? 'fate'
}

function isCritSuccess(roll: DiceRoll) {
  if (roll.critical === 'success')
    return true
  const s = sides(roll)
  if (s === 'fate')
    return roll.value === 1
  return typeof roll.value === 'number' && roll.value === s
}

function isCritFailure(roll: DiceRoll) {
  if (roll.critical === 'failure')
    return true
  const s = sides(roll)
  if (s === 'fate')
    return roll.value === -1
  return roll.success === null && typeof roll.value === 'number' && roll.value <= 1
}

function dieClass(roll: DiceRoll) {
  return {
    'text-success': isCritSuccess(roll),
    'text-error': isCritFailure(roll),
    'line-through opacity-40': roll.drop || roll.reroll
  }
}

const groups = computed(() => {
  const bySides = new Map<string, DiceRoll[]>()
  for (const roll of props.results) {
    const key = String(sides(roll))
    bySides.set(key, [...(bySides.get(key) ?? []), roll])
  }
  return [...bySides.entries()].map(([key, rolls]) => ({ key, rolls }))
})

const total = computed(() => {
  if (props.total !== undefined)
    return props.total

  const counted = props.results.filter(roll => !roll.drop && !roll.reroll)

  if (counted.every(roll => typeof roll.value === 'number'))
    return counted.reduce((sum, roll) => sum + (roll.value as number), 0) + (props.modifier ?? 0)

  const counts: Record<string, number> = {}
  for (const roll of counted) {
    for (const value of Array.isArray(roll.value) ? roll.value : [roll.value]) {
      if (typeof value === 'string')
        counts[value] = (counts[value] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `${key}: ${count}`)
    .join(', ') || '...'
})
</script>

<template>
  <div v-if="labeled" class="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-xl">
    <template v-for="(group, i) in groups" :key="group.key">
      <span v-if="i !== 0" class="text-muted">&middot;</span>
      <span class="inline-flex items-baseline gap-1.5">
        <span class="text-sm text-muted">W{{ group.key }}</span>
        <span v-for="(roll, j) in group.rolls" :key="j" :class="dieClass(roll)">
          {{ roll.value ?? '...' }}<span v-if="j < group.rolls.length - 1" class="text-muted">,</span>
        </span>
      </span>
    </template>
    <span v-if="modifier" class="text-muted">{{ modifier > 0 ? '+' : '-' }} {{ Math.abs(modifier) }}</span>
    <span class="text-muted">=</span>
    <strong class="text-highlighted">{{ total }}</strong>
  </div>

  <div v-else class="flex items-center gap-1 font-display text-2xl">
    <template v-for="(roll, i) in results" :key="i">
      <span v-if="i !== 0" class="text-muted">,</span>

      <UIcon
        v-if="roll.success != null"
        :name="roll.success ? 'i-lucide-check' : (roll.failures ?? 0) > 0 ? 'i-lucide-x' : 'i-lucide-minus'"
        class="size-6"
        :class="roll.success ? 'text-success' : (roll.failures ?? 0) > 0 ? 'text-error' : 'text-muted'"
      />
      <span v-else :class="dieClass(roll)">
        {{ roll.value ?? '...' }}<span v-if="roll.explode" class="text-success">!</span>
      </span>
    </template>

    <span class="text-muted mx-1">=</span>
    <strong class="text-highlighted">{{ total }}</strong>
  </div>
</template>
