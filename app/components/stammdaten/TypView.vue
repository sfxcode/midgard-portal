<script setup lang="ts">
import type { PropType } from 'vue'
import type { Typ } from '~/models'

defineProps({
  typ: {
    type: Object as PropType<Typ>,
    required: true
  }
})
</script>

<template>
  <div>
    <p class="font-display text-xl text-highlighted mb-1">
      {{ typ.name }}
    </p>
    <p class="text-sm text-muted mb-3">
      {{ typ.kategorie }}
    </p>

    <dl class="grid grid-cols-2 gap-1 text-sm">
      <dt class="font-medium text-toned">
        Name kurz
      </dt>
      <dd class="text-highlighted">
        {{ typ.nameKurz }}
      </dd>
    </dl>

    <MetaData v-if="typ.metaData" class="mt-4" :meta="typ.metaData" />
  </div>
</template>
