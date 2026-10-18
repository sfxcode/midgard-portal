<script setup lang="ts">
const { wesen } = useBestiariumStore()
</script>

<template>
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(6.25rem,1fr))]">
    <AdvertiseBox
      v-if="wesen"
      header="Bestiarium"
      icon="i-game-icons-dragon-head"
      to="/secured/dm/npc/bestiarium"
    >
      {{ wesen.length ?? 0 }}
    </AdvertiseBox>
  </div>
</template>
