// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@sfxcode/nuxt-ui-mongocamp',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'nuxt-pdfmake'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css', '~/assets/css/formkit.css'],

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

  vite: {
    optimizeDeps: {
      include: [
        'pdfmake/build/pdfmake',
        'pdfmake/build/vfs_fonts'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      { name: 'Cinzel', provider: 'google', global: true, weights: [400, 500, 600, 700, 800] },
      { name: 'Alegreya', provider: 'google', global: true, weights: [400, 500, 600, 700, 800], styles: ['normal', 'italic'] },
      { name: 'Alegreya Sans', provider: 'google', global: true, weights: [400, 500, 700], styles: ['normal', 'italic'] }
    ]
  },

  mongocamp: {
    url: 'https://midgard-server.sfxcode.com',
    paginationSize: 1000,
    tokenRefreshInterval: 60 * 1000
  },

  nuxtUiMongocamp: {
    logoutPath: 'logout',
    notAllowedPath: '/',
    managerRoles: ['manager'],
    securedRouteParts: ['/secured/**'],
    managementRouteParts: ['/secured/manager/**'],
    adminRouteParts: ['/secured/admin/**'],
    useGlobalAuthMiddleware: false,
    useServerProxy: false,
  }
})
