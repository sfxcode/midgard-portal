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
        <div class="p-4 w-80">
          <slot />
        </div>
      </template>
    </UPopover>
  </UTooltip>
</template>
