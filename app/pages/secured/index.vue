<script setup lang="ts">
const { logout } = useMongocampAuth()
const user = useMongocampUser()

useSeoMeta({
  title: 'Secured'
})

function onLogout() {
  logout()
  navigateTo('/login')
}
</script>

<template>
  <UDashboardPanel id="secured">
    <template #header>
      <UDashboardNavbar title="Secured Area">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Logout"
            icon="i-lucide-log-out"
            color="neutral"
            variant="subtle"
            @click="onLogout"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UCard class="max-w-md">
        <p class="text-sm text-muted mb-1">
          Signed in as
        </p>
        <p class="font-display text-lg text-highlighted">
          {{ user.user }}
        </p>
        <UBadge
          v-if="user.isAdmin"
          class="mt-2"
          color="primary"
          variant="subtle"
          label="Admin"
        />
      </UCard>

      <UCard class="max-w-md">
        <p class="text-sm text-muted mb-1">
          Sample content
        </p>
        <p class="text-highlighted mb-3">
          The original dashboard sample lives here, separate from your account.
        </p>
        <UButton
          label="View Demo Dashboard"
          icon="i-lucide-layout-dashboard"
          to="/secured/demo"
          variant="subtle"
        />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
