<script setup lang="ts">
import type { PropType } from 'vue'
import type { MetaData } from '~/models'

const props = defineProps({
  meta: {
    type: Object as PropType<MetaData>,
    required: true
  }
})

const formatted = computed(() => {
  if (!props.meta?.updated) {
    return ''
  }
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(props.meta.updated))
})
</script>

<template>
  <div v-if="meta" class="text-xs text-muted">
    <span v-if="meta.updated">{{ formatted }}</span> · <span>{{ meta.updatedBy }}</span>
  </div>
</template>
