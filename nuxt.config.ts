// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@sfxcode/nuxt-ui-mongocamp',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  mongocamp: {
    url: process.env.MONGOCAMP_URL
  },

  fonts: {
    families: [
      { name: 'Cinzel', provider: 'google', global: true, weights: [400, 500, 600, 700, 800] },
      { name: 'Alegreya', provider: 'google', global: true, weights: [400, 500, 600, 700, 800], styles: ['normal', 'italic'] },
      { name: 'Alegreya Sans', provider: 'google', global: true, weights: [400, 500, 700], styles: ['normal', 'italic'] }
    ]
  },

  routeRules: {
    '/api/**': {
      cors: true
    },
    // MongoCamp auth state lives in sessionStorage (client-only), so a
    // server-rendered /secured/** page can't see it yet during SSR and the
    // auth middleware would bounce a logged-in user back to /login on
    // reload. Rendering these routes client-only avoids that mismatch.
    '/secured/**': {
      ssr: false
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
