<script setup lang="ts">
import type { PropType } from 'vue'
import type { Zauber } from '~/models'

const props = defineProps({
  zauber: {
    type: Object as PropType<Zauber>,
    required: true
  }
})

const facts = computed(() => [
  { label: 'Stufe', value: props.zauber.stufe },
  { label: 'AP-Verbrauch', value: props.zauber.ap },
  { label: 'Zauberdauer', value: props.zauber.zauberdauer },
  { label: 'Reichweite', value: props.zauber.reichweite },
  { label: 'Wirkungsziel', value: props.zauber.wirkungsziel },
  { label: 'Wirkungsbereich', value: props.zauber.wirkungsbereich },
  { label: 'Wirkungsdauer', value: props.zauber.wirkungsdauer },
  { label: 'Ursprung', value: props.zauber.ursprung }
])
</script>

<template>
  <div>
    <p class="font-display text-xl text-highlighted mb-1">
      {{ zauber.name }}
    </p>
    <p class="text-sm text-muted mb-3">
      {{ zauber.kategorie }} · {{ zauber.art }}
    </p>
    <p class="text-sm text-muted mb-3">
      {{ zauber.prozess }} · {{ zauber.agens }} · {{ zauber.reagens }}
    </p>

    <dl class="grid grid-cols-2 gap-1 text-sm">
      <template v-for="fact in facts" :key="fact.label">
        <dt class="font-medium text-toned">
          {{ fact.label }}
        </dt>
        <dd class="text-highlighted">
          {{ fact.value }}
        </dd>
      </template>
    </dl>

    <MetaData v-if="zauber.metaData" class="mt-4" :meta="zauber.metaData" />
  </div>
</template>
