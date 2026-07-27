<script setup lang="ts">
import type { Spielergruppe } from '~/models'
import { useSpielergruppe } from '~/composables/spieler/useSpielergruppe'

const route = useRoute()
const idParameter = `${route.params.id}`

const { spielergruppen, refetchSpielergruppen } = useSpielergruppenStore()
const { spieler } = useSpielerStore()
const { saveSpielergruppe } = useSpielergruppe()

const gruppe = computed(() => spielergruppen.value?.find((g: Spielergruppe) => g._id === idParameter))
const spielerLogins = computed(() => (spieler.value ?? []).map(s => s.login).sort())

async function handleGruppeSave(data: Partial<Spielergruppe>) {
  if (!gruppe.value) return
  await saveSpielergruppe({ ...gruppe.value, ...data })
  await refetchSpielergruppen()
}

const items = computed(() => [
  { label: 'Spielergruppen', icon: 'i-lucide-users', to: '/secured/manager/spielergruppen' },
  { label: gruppe.value?.name ?? idParameter }
])

useSeoMeta({
  title: gruppe.value?.name ?? 'Spielergruppe'
})
</script>

<template>
  <UDashboardPanel :id="`manager-spielergruppe-${idParameter}`">
    <template #header>
      <UDashboardNavbar :title="gruppe?.name ?? 'Spielergruppe'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard v-if="gruppe" class="max-w-lg">
        <SpielerGruppeView :gruppe="gruppe" :spieler-logins="spielerLogins" :on-save="handleGruppeSave" />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
