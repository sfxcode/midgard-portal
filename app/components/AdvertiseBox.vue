<script setup lang='ts'>
defineProps({
  header: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  }
})
</script>

<template>
  <div class="mb-4 px-5">
    <div :class="`mb-3 text-2xl dark:text-${color}`">
      {{ header }}
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>

</style>
