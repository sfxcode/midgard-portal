<script setup lang="ts">
defineProps<{
  // `wide` lets long values (e.g. "10 / 10") take two columns instead of orphaning on their own row
  facts: { label: string, value?: string | number | null, wide?: boolean }[]
}>()

function isEmpty(value?: string | number | null) {
  return value === null || value === undefined || value === ''
}
</script>

<template>
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))]">
    <div
      v-for="fact in facts"
      :key="fact.label"
      class="rpg-stat p-2.5"
      :class="fact.wide ? 'col-span-2' : ''"
    >
      <p class="rpg-stat-label">
        {{ fact.label }}
      </p>
      <p v-if="!isEmpty(fact.value)" class="font-semibold text-highlighted leading-tight">
        {{ fact.value }}
      </p>
      <p v-else class="text-dimmed leading-tight" title="Keine Angabe">
        –
      </p>
    </div>
  </div>
</template>
