<script setup lang="ts">
import type { PropType } from 'vue'
import type { Wesen } from '~/models'
import { useWesen } from '~/composables/dm/useWesen'

const props = defineProps({
  wesen: {
    type: Object as PropType<Wesen>,
    required: true
  }
})

const { angriffeToString, besonderheitenToString, zauberToString, vorkommenToString } = useWesen()

const groups = computed(() => [
  {
    title: 'Vitalwerte',
    rows: [
      { label: 'LP', value: props.wesen.lp },
      { label: 'AP', value: props.wesen.ap },
      { label: 'Rüstung', value: props.wesen.ruestung }
    ]
  },
  {
    title: 'Eigenschaften',
    rows: [
      { label: 'St', value: props.wesen.st },
      { label: 'Gw', value: props.wesen.gw },
      { label: 'In', value: props.wesen.in }
    ]
  },
  {
    title: 'Kampfwerte',
    rows: [
      { label: 'Abwehr', value: props.wesen.abwehr },
      { label: 'Resistenz Geist', value: props.wesen.resistenzGeist },
      { label: 'Resistenz Körper', value: props.wesen.resistenzKoerper },
      ...(props.wesen.mw > 0 ? [{ label: 'MW', value: props.wesen.mw >= 999 ? '∞' : `+${props.wesen.mw}` }] : []),
      { label: 'Gefahrenstufe', value: props.wesen.gf }
    ]
  },
  {
    title: 'Bewegung',
    rows: [
      { label: 'Laufen', value: props.wesen.b },
      ...(props.wesen.fliegend > 0 ? [{ label: 'Fliegen', value: props.wesen.fliegend }] : [])
    ]
  }
])

const texts = computed(() => [
  { label: 'Angriff', value: angriffeToString(props.wesen) },
  { label: 'Besonderheiten', value: props.wesen.besonderheiten.length > 0 ? besonderheitenToString(props.wesen) : '' },
  { label: 'Zauber', value: props.wesen.zauber.length > 0 ? zauberToString(props.wesen) : '' },
  { label: 'Vorkommen', value: vorkommenToString(props.wesen) }
].filter(text => text.value))
</script>

<template>
  <div class="@container">
    <div class="grid gap-x-10 gap-y-5 @lg:grid-cols-2">
      <section v-for="group in groups" :key="group.title">
        <p class="rpg-section-title mb-2">
          {{ group.title }}
        </p>
        <dl class="flex flex-col gap-1.5">
          <div v-for="row in group.rows" :key="row.label" class="flex items-baseline gap-2">
            <dt class="rpg-stat-label shrink-0">
              {{ row.label }}
            </dt>
            <span class="flex-1 border-b border-dotted border-accented" aria-hidden="true" />
            <dd class="font-semibold text-highlighted">
              {{ row.value }}
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <div class="mt-5 flex flex-col gap-2 border-t border-default pt-4">
      <p v-for="text in texts" :key="text.label" class="text-sm leading-relaxed">
        <span class="rpg-stat-label mr-2">{{ text.label }}</span>
        <span class="font-serif italic text-highlighted">{{ text.value }}</span>
      </p>
    </div>
  </div>
</template>
