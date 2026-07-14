<script setup lang="ts">
const { typen } = useStammdatenStore()
const { zauber } = useZauberStore()
const { fertigkeiten } = useFertigkeitenStore()
</script>

<template>
  <div class="grid gap-2 sm:grid-cols-3">
    <AdvertiseBox header="Zauber" icon="i-lucide-wand-sparkles" to="/secured/stamm/zauber">
      {{ zauber?.length ?? 0 }}
    </AdvertiseBox>
    <AdvertiseBox header="Fertigkeiten" icon="i-lucide-swords" to="/secured/stamm/fertigkeiten">
      {{ fertigkeiten?.length ?? 0 }}
    </AdvertiseBox>
    <AdvertiseBox header="Typen" icon="i-lucide-shapes" to="/secured/stamm/typen">
      {{ typen?.length ?? 0 }}
    </AdvertiseBox>
  </div>
</template>
