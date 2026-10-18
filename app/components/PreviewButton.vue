<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'Vorschau'
})
</script>

<template>
  <UTooltip :text="label">
    <UPopover :content="{ side: 'right', align: 'start' }">
      <UButton
        icon="i-lucide-search"
        size="sm"
        color="neutral"
        variant="subtle"
        :aria-label="label"
      />

      <template #content>
        <div class="p-4 w-[min(36rem,calc(100vw-2rem))] max-h-[80vh] overflow-y-auto">
          <slot />
        </div>
      </template>
    </UPopover>
  </UTooltip>
</template>
