<script setup lang="ts">
import type { PropType } from 'vue'
import type { Beschreibung } from '~/models'

const props = defineProps({
  beschreibung: {
    type: Object as PropType<Beschreibung>,
    required: true
  }
})

const isEmpty = computed(() => {
  const content = props.beschreibung?.content
  return !content || content === '<p></p>' || content.trim() === ''
})
</script>

<template>
  <div>
    <p class="font-display text-lg text-highlighted mb-2">
      Beschreibung
    </p>
    <div v-if="!isEmpty" class="beschreibung-content font-serif text-highlighted" v-html="beschreibung.content" />
    <p v-else class="text-sm text-muted italic">
      Noch keine Beschreibung vorhanden.
    </p>

    <MetaData v-if="beschreibung.metaData" class="mt-4" :meta="beschreibung.metaData" />
  </div>
</template>

<style scoped>
.beschreibung-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.beschreibung-content :deep(h1),
.beschreibung-content :deep(h2),
.beschreibung-content :deep(h3) {
  font-family: var(--font-display);
  margin-block: 0.75rem 0.375rem;
}

.beschreibung-content :deep(ul),
.beschreibung-content :deep(ol) {
  margin-bottom: 0.75rem;
  padding-inline-start: 1.25rem;
}

.beschreibung-content :deep(ul) {
  list-style-type: disc;
}

.beschreibung-content :deep(ol) {
  list-style-type: decimal;
}
</style>
