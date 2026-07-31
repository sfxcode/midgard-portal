<script setup lang="ts">
import type { Kampagne } from '~/models'
import { useKampagne } from '~/composables/spieler/useKampagne'

const route = useRoute()
const idParameter = `${route.params.id}`

const { spieler } = useSpielerStore()
const { eigeneKampagnenAlsSpielleiter, refetchEigeneKampagnenAlsSpielleiter } = useKampagneStore()
const { saveKampagne } = useKampagne()

const kampagne = computed(() => eigeneKampagnenAlsSpielleiter.value?.find((k: Kampagne) => k._id === idParameter))
const spielerLogins = computed(() => (spieler.value ?? []).map(s => s.login).sort())

async function handleKampagneSave(data: Partial<Kampagne>) {
  if (!kampagne.value) return
  await saveKampagne({ ...kampagne.value, ...data })
  await refetchEigeneKampagnenAlsSpielleiter()
}

const items = computed(() => [
  { label: 'DM', icon: 'i-lucide-skull', to: '/secured/dm' },
  { label: 'Kampagnen', icon: 'i-lucide-scroll', to: '/secured/dm/kampagnen' },
  { label: kampagne.value?.name ?? idParameter }
])

useSeoMeta({
  title: kampagne.value?.name ?? 'Kampagne'
})
</script>

<template>
  <UDashboardPanel :id="`dm-kampagne-${idParameter}`">
    <template #header>
      <AppPageHeader :title="kampagne?.name ?? 'Kampagne'" :items="items" />
    </template>

    <template #body>
      <UCard v-if="kampagne" class="max-w-lg">
        <SpielerKampagneView :kampagne="kampagne" :spieler-logins="spielerLogins" :on-save="handleKampagneSave" />
      </UCard>
      <p v-else class="text-sm text-muted">
        Diese Kampagne existiert nicht oder du bist nicht der Spielleiter.
      </p>
    </template>
  </UDashboardPanel>
</template>
