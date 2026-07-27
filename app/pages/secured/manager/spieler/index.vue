<script setup lang="ts">
const items = [{ label: 'Spieler' }]

useSeoMeta({
  title: 'Spieler'
})
</script>

<template>
  <UDashboardPanel id="manager-spieler">
    <template #header>
      <UDashboardNavbar title="Spieler">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <SpielerProfilListe />
    </template>
  </UDashboardPanel>
</template>
