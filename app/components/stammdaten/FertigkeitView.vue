<script setup lang="ts">
import type { PropType } from 'vue'
import type { Fertigkeit } from '~/models'

const props = defineProps({
  fertigkeit: {
    type: Object as PropType<Fertigkeit>,
    required: true
  }
})

const facts = computed(() => [
  { label: 'Leitwert', value: props.fertigkeit.leitwert },
  { label: 'Buch', value: props.fertigkeit.buch },
  { label: 'Schwierigkeit', value: props.fertigkeit.schwierigkeit },
  { label: 'Lerneinheiten', value: props.fertigkeit.lerneinheiten },
  { label: 'Gelernt', value: props.fertigkeit.gelernt },
  { label: 'Ungelernt', value: props.fertigkeit.ungelernt }
])
</script>

<template>
  <div>
    <p class="font-display text-xl text-highlighted mb-1">
      {{ fertigkeit.name }}
    </p>
    <p class="text-sm text-muted mb-3">
      {{ fertigkeit.kategorie }}
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

    <MetaData v-if="fertigkeit.metaData" class="mt-4" :meta="fertigkeit.metaData" />
  </div>
</template>
