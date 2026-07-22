<script setup lang="ts">
const { wesen } = useBestiariumStore()
</script>

<template>
  <div class="grid gap-2 sm:grid-cols-3">
    <AdvertiseBox v-if="wesen" header="Bestiarium" icon="i-lucide-skull" to="/secured/dm/npc/bestiarium">
      {{ wesen.length ?? 0 }}
    </AdvertiseBox>
  </div>
</template>
