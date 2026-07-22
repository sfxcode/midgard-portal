<script setup lang="ts">
useSeoMeta({
  title: 'NPC'
})

const { wesen } = useBestiariumStore()

</script>

<template>
  <UDashboardPanel id="dm-npc">
    <template #header>
      <UDashboardNavbar title="NPC">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <AdvertiseBox v-if="wesen" header="Bestiarium" icon="i-lucide-skull" to="/secured/dm/npc/bestiarium">
        {{ wesen.length ?? 0 }}
      </AdvertiseBox>
    </template>
  </UDashboardPanel>
</template>
