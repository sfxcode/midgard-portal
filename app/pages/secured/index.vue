<script setup lang="ts">
const { logout } = useMongocampAuth()
const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)

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
      <div class="flex flex-col gap-4">
      <UCard class="max-w-md">
        <p class="text-sm text-muted mb-1">
          Signed in as
        </p>
        <p class="font-display text-lg text-highlighted">
          {{ profile.user }}
        </p>
        <UBadge
          v-if="profile.isAdmin"
          class="mt-2"
          color="primary"
          variant="subtle"
          label="Admin"
        />
      </UCard>

      <UCard  v-if="false" class="max-w-md">
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

      <UCard v-if="profile.isAdmin" class="max-w-md">
        <p class="text-sm text-muted mb-1">
          Administration
        </p>
        <p class="text-highlighted mb-3">
          Manage users and roles for this MongoCamp server.
        </p>
        <div class="flex gap-2">
          <UButton
            label="Users"
            icon="i-lucide-users"
            to="/secured/admin/users"
            variant="subtle"
          />
          <UButton
            label="Roles"
            icon="i-lucide-shield"
            to="/secured/admin/roles"
            variant="subtle"
          />
        </div>
      </UCard>
      <UCard class="max-w-md">
        <p class="text-sm text-muted mb-1">
          Stammdaten
        </p>
        <p class="text-highlighted mb-3">
          The original dashboard sample lives here, separate from your account.
        </p>
       <StammdatenBox/>
      </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
