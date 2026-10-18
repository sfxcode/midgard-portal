<script setup lang="ts">
useSeoMeta({
  title: 'NPC'
})
</script>

<template>
  <UDashboardPanel id="dm-npc">
    <template #header>
      <AppPageHeader title="NPC" :items="[{ label: 'DM' }, { label: 'NPC' }]" />
    </template>

    <template #body>
      <DMBox class="lg:max-w-3xl" />
    </template>
  </UDashboardPanel>
</template>
