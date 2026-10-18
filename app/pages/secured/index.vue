<script setup lang="ts">
const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)

const items = [{ label: 'Startseite' }]

useSeoMeta({
  title: 'Startseite'
})
</script>

<template>
  <UDashboardPanel id="secured">
    <template #header>
      <AppPageHeader title="Startseite" :items="items" />
    </template>

    <template #body>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <div class="flex flex-col gap-4">
          <UCard class="rpg-frame">
            <p class="rpg-section-title mb-3">
              Willkommen zurück
            </p>
            <p class="font-display text-2xl text-highlighted break-all">
              {{ profile.user }}
            </p>
            <UBadge
              v-if="profile.isAdmin"
              class="mt-2"
              color="primary"
              variant="subtle"
              label="Administrator"
            />
            <div class="flex flex-wrap gap-2 mt-4">
              <UButton
                label="Abenteurer"
                icon="i-game-icons-hood"
                to="/secured/spieler/abenteurer"
                variant="subtle"
              />
              <UButton
                label="Meine Kampagnen"
                icon="i-game-icons-scroll-unfurled"
                to="/secured/spieler/kampagnen"
                variant="subtle"
              />
            </div>
          </UCard>

          <UCard v-if="profile.isAdmin" class="rpg-frame">
            <p class="rpg-section-title mb-3">
              Verwaltung
            </p>
            <p class="text-highlighted mb-3">
              Benutzer und Rollen dieses MongoCamp-Servers verwalten.
            </p>
            <div class="flex flex-wrap gap-2">
              <UButton
                label="Benutzer"
                icon="i-lucide-users"
                to="/secured/admin/users"
                variant="subtle"
              />
              <UButton
                label="Rollen"
                icon="i-game-icons-round-shield"
                to="/secured/admin/roles"
                variant="subtle"
              />
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:col-span-2 items-start">
          <UCard class="rpg-frame">
            <p class="rpg-section-title mb-3">
              Stammdaten
            </p>
            <p class="text-highlighted mb-3">
              Nachschlagewerk der Kampagne: Zauber, Fertigkeiten und Typen.
            </p>
            <StammdatenBox />
          </UCard>

          <UCard class="rpg-frame">
            <p class="rpg-section-title mb-3">
              Spielleiter
            </p>
            <p class="text-highlighted mb-3">
              Werkzeuge für die Spielleitung: NPCs und Bestiarium.
            </p>
            <DMBox />
          </UCard>

          <UCard class="rpg-frame sm:col-span-2">
            <p class="rpg-section-title mb-3">
              Würfeltisch
            </p>
            <DiceTable />
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
