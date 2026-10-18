<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="rpg-empty text-center text-sm text-muted">
    <p>{{ title }}</p>
    <div v-if="$slots.default" class="mt-3">
      <slot />
    </div>
  </div>
</template>
