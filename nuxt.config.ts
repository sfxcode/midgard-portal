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

  build: {
    transpile: ['@3d-dice/dice-box', '@dice-roller/rpg-dice-roller']
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

  compatibilityDate: '2026-07-31',

  vite: {
    optimizeDeps: {
      include: [
        'pdfmake/build/pdfmake',
        'pdfmake/build/vfs_fonts',
        // @dice-roller/rpg-dice-roller pulls in mathjs -> typed-function.
        // typed-function's package.json declares "type": "module" at the root
        // but ships a UMD build as main/browser (with a nested lib/umd/package.json
        // overriding it back to "commonjs", which Node respects but Vite's raw
        // @fs/ file-serving does not always honor). Listing only the top-level
        // package wasn't enough to pull typed-function into the same pre-bundle,
        // so it's listed explicitly too - this only started surfacing once
        // useWesenGenerator actually called useDices() for the first time.
        '@dice-roller/rpg-dice-roller',
        // pnpm's strict node_modules layout doesn't hoist transitive deps to the
        // root, so a bare 'mathjs'/'typed-function' entry fails to resolve here -
        // Vite's "parent > child" syntax reaches them through their actual chain.
        '@dice-roller/rpg-dice-roller > mathjs',
        '@dice-roller/rpg-dice-roller > mathjs > typed-function'
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

  icon: {
    clientBundle: {
      // Nav icons are assembled dynamically (computed array of objects), so
      // @nuxt/icon's static scanner can't detect them from template literals.
      // List them explicitly to avoid a runtime API fetch (and the
      // "[Icon] failed to load icon" warning it produces on a cold cache).
      icons: [
        'lucide:book',
        'lucide:database',
        'lucide:home',
        'lucide:id-card',
        'lucide:list',
        'lucide:message-square',
        'lucide:scroll',
        'lucide:shapes',
        'lucide:shield',
        'lucide:shield-cog',
        'lucide:skull',
        'lucide:swords',
        'lucide:user',
        'lucide:user-cog',
        'lucide:users',
        'lucide:users-2',
        'lucide:wand-sparkles'
      ]
    }
  },

  mongocamp: {
    url: process.env.MONGOCAMP_URL,
    apiKey: process.env.MONGOCAMP_API_KEY,
    paginationSize: 1000,
    tokenRefreshInterval: 60 * 1000 * 10,
    refreshToken: true
  },

  nuxtUiMongocamp: {
    logoutPath: 'logout',
    notAllowedPath: '/',
    managerRoles: ['manager'],
    securedRouteParts: ['/secured/**'],
    managementRouteParts: ['/secured/manager/**'],
    adminRouteParts: ['/secured/admin/**'],
    useGlobalAuthMiddleware: true,
    useServerProxy: false
  }
})
