<script setup lang="ts">
useSeoMeta({
  title: 'Stammdaten'
})
</script>

<template>
  <UDashboardPanel id="stamm">
    <template #header>
      <UDashboardNavbar title="Stammdaten">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <StammdatenBox />
    </template>
  </UDashboardPanel>
</template>
