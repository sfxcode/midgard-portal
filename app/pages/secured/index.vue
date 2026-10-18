<script setup lang="ts">
import { useDiceBox } from '~/composables/tools/useDiceBox'
import type { DiceRoll } from '~/types'

const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)

const items = [{ label: 'Startseite' }]

useSeoMeta({
  title: 'Startseite'
})

const { initDiceBox, roll } = useDiceBox()
const defaultRoll = [{ qty: 1, sides: 100 }, { qty: 1, sides: 20 }, { qty: 1, sides: 6 }]
const result = ref<DiceRoll[]>()
const rolling = ref(false)
async function rollDice() {
  rolling.value = true
  try {
    await roll(defaultRoll)
  } finally {
    rolling.value = false
  }
}

onMounted(() => {
  initDiceBox('#dice-box', 12, (groups: { rolls: DiceRoll[] }[]) => {
    result.value = groups.flatMap(group => group.rolls)
  })
})
</script>

<template>
  <UDashboardPanel id="secured">
    <template #header>
      <AppPageHeader title="Startseite" :items="items" />
    </template>

    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
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

        <UCard class="rpg-frame lg:col-span-2 xl:col-span-2">
          <div class="flex items-center justify-between gap-3 mb-3">
            <p class="rpg-section-title flex-1">
              Würfeltisch
            </p>
            <UButton
              label="Würfeln"
              icon="i-game-icons-rolling-dices"
              :loading="rolling"
              @click="rollDice"
            />
          </div>
          <p class="text-sm text-muted mb-3">
            W100, W20 und W6 &ndash; per Klick auf den Tisch oder auf &bdquo;Würfeln&ldquo;.
          </p>
          <div class="min-h-9 mb-3">
            <DiceResultDisplay v-if="result" :results="result" />
          </div>
          <div id="dice-box" class="rpg-tray h-64 w-full" @click="rollDice" />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style>
.dice-box-canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
