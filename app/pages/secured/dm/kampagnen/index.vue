<script setup lang="ts">
import { useKampagne } from '~/composables/spieler/useKampagne'

const items = [
  { label: 'DM', icon: 'i-lucide-skull', to: '/secured/dm' },
  { label: 'Kampagnen' }
]

const { login } = useSpielerStore()
const { eigeneKampagnenAlsSpielleiter, refetchEigeneKampagnenAlsSpielleiter } = useKampagneStore()
const { createKampagne, saveKampagne } = useKampagne()

const isCreateModalOpen = ref(false)
const name = ref('')
const beschreibung = ref('')
const creating = ref(false)

async function createNewKampagne() {
  if (name.value.trim().length < 2 || !login.value) return
  creating.value = true
  try {
    const result = await saveKampagne(createKampagne(name.value.trim(), login.value, beschreibung.value.trim() || undefined))
    await refetchEigeneKampagnenAlsSpielleiter()
    if (result._id) {
      await navigateTo(`/secured/dm/kampagnen/${result._id}`)
    }
  } finally {
    creating.value = false
  }
}

useSeoMeta({
  title: 'Kampagnen'
})
</script>

<template>
  <UDashboardPanel id="dm-kampagnen">
    <template #header>
      <AppPageHeader title="Kampagnen" :items="items">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            aria-label="Kampagne anlegen"
            @click="isCreateModalOpen = true"
          />
        </template>
      </AppPageHeader>
    </template>

    <template #body>
      <UModal v-model:open="isCreateModalOpen" title="Kampagne anlegen">
        <template #body>
          <div class="flex flex-col gap-2">
            <UInput v-model="name" placeholder="Name" @keyup.enter="createNewKampagne" />
            <UInput v-model="beschreibung" placeholder="Beschreibung (optional)" @keyup.enter="createNewKampagne" />
            <UButton
              label="Kampagne anlegen"
              icon="i-lucide-plus"
              :loading="creating"
              :disabled="name.trim().length < 2"
              @click="createNewKampagne"
            />
          </div>
        </template>
      </UModal>

      <SpielerKampagnenListe
        :kampagnen="eigeneKampagnenAlsSpielleiter ?? []"
        empty-text="Noch keine Kampagne angelegt."
        base-path="/secured/dm/kampagnen"
      />
    </template>
  </UDashboardPanel>
</template>
