<script setup lang='ts'>
defineProps({
  header: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  to: {
    type: String,
    default: null
  }
})
</script>

<template>
  <UPageCard
    :icon="icon"
    :title="header"
    :to="to"
    variant="subtle"
    :ui="{
      container: 'p-4 sm:p-4 gap-y-1.5',
      wrapper: 'items-start',
      leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
      title: 'font-normal text-muted text-xs uppercase'
    }"
  >
    <span class="text-2xl font-semibold text-highlighted">
      <slot />
    </span>
  </UPageCard>
</template>
