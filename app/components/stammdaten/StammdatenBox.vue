<script setup lang="ts">
const { typen } = useStammdatenStore()
const { zauber } = useZauberStore()
const { fertigkeiten } = useFertigkeitenStore()
</script>

<template>
  <div class="gap-1 grid grid-cols-2 lg:grid-cols-3">
    <AdvertiseBox header="Zauber" icon="mdi-information" color="blue-200">
      {{ zauber?.length }}
      <NuxtLink to="/secured/stamm/zauber">
        <span>Zaubersprüche</span>
      </NuxtLink> gefunden
    </AdvertiseBox>
    <AdvertiseBox header="Fertigkeiten" color="blue-200">
      {{ fertigkeiten?.length }}
      <NuxtLink to="/secured/stamm/fertigkeiten">
        <span>Fertigkeiten</span>
      </NuxtLink>  gefunden
    </AdvertiseBox>
    <AdvertiseBox header="Typen" icon="prime-check-circle" color="blue-200">
      {{ typen?.length }}
      <NuxtLink to="/secured/stamm/typen">
        <span>Typen</span>
      </NuxtLink>  gefunden
    </AdvertiseBox>
  </div>
</template>

<style scoped></style>
