<script setup lang="ts">
const { typen } = useStammdatenStore()
const { zauber } = useZauberStore()
const { fertigkeiten } = useFertigkeitenStore()
</script>

<template>
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(6.25rem,1fr))]">
    <AdvertiseBox header="Zauber" icon="i-game-icons-wizard-staff" to="/secured/manager/stamm/zauber">
      {{ zauber?.length ?? 0 }}
    </AdvertiseBox>
    <AdvertiseBox header="Fertigkeiten" icon="i-game-icons-crossed-swords" to="/secured/manager/stamm/fertigkeiten">
      {{ fertigkeiten?.length ?? 0 }}
    </AdvertiseBox>
    <AdvertiseBox header="Typen" icon="i-game-icons-open-book" to="/secured/manager/stamm/typen">
      {{ typen?.length ?? 0 }}
    </AdvertiseBox>
  </div>
</template>
