<script setup lang="ts">
import { useDiceBox } from '~/composables/tools/useDiceBox'
import type { DiceRoll } from '~/types'

const mongocampStorage = useMongocampStorage()
const profile = computed(() => mongocampStorage.value.profile)

const items = [{ label: 'Account' }]

useSeoMeta({
  title: 'Account'
})

const { initDiceBox, roll } = useDiceBox()
const defaultRoll = [{ qty: 1, sides: 100 }, { qty: 1, sides: 20 }, { qty: 1, sides: 6 }]
const result = ref<DiceRoll[]>()
function rollDice() {
  roll(defaultRoll)
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
      <AppPageHeader title="Account" :items="items" />
    </template>

    <template #body>
      <div class="grid cols-1 l:cols-2 xl:cols-3 gap-4">
        <UCard class="max-w">
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

        <UCard v-if="profile.isAdmin" class="max-w">
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
        <UCard class="max-w">
          <p class="text-sm text-muted mb-1">
            Stammdaten
          </p>
          <p class="text-highlighted mb-3">
            Reference data for this campaign: spells, skills and types.
          </p>
          <StammdatenBox />
        </UCard>
        <UCard class="max-w">
          <p class="text-sm text-muted mb-1">
            DM
          </p>
          <p class="text-highlighted mb-3">
            Tools for the dungeon master: NPCs and bestiary.
          </p>
          <DMBox />
        </UCard>
        <UCard class="max-w">
          <p class="text-sm text-muted mb-1">
            Dice
          </p>
          <p class="text-highlighted mb-3">
            Click the box to roll d100, d6 and d20.
          </p>
          <DiceResultDisplay v-if="result" :results="result" class="mb-3" />
          <div id="dice-box" class="" @click="rollDice" />
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
  background-image: url('/images/heroes/abenteurer.svg');
  opacity: 0.50;
  background-size: 70%;
  background-repeat: no-repeat;
}
</style>
