<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b140d' : '#faf5ea')

const mongocampStorage = useMongocampStorage()
const { authApi } = useMongocampApi()

// Gate page render behind the refresh so a stale-but-present token never
// flashes the login page before the session is confirmed dead or alive.
const checkingAuth = ref(!!mongocampStorage.value.token)

onMounted(async () => {
  if (!checkingAuth.value) return

  try {
    const result = await authApi.refreshToken()
    mongocampStorage.value.token = result.authToken
    mongocampStorage.value.profile = result.userProfile
  } catch {
    // token was already dead; the API's own 401 handling already cleared the session
  } finally {
    checkingAuth.value = false
  }
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'RPG Campaign Manager'
const description = 'An epic campaign management tool built with Nuxt UI, featuring character sheets, quest logs, party management, and comprehensive campaign configuration for immersive tabletop RPG experiences.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <div v-if="checkingAuth" class="min-h-screen flex items-center justify-center">
      <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
