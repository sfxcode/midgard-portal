import type { DefaultConfigOptions } from '@formkit/vue'
import { createNuxtUiFormkitConfig } from '@sfxcode/nuxt-ui-formkit/formkit'

const nuxtUiFormkitConfig = createNuxtUiFormkitConfig()

const config: DefaultConfigOptions = {
  inputs: nuxtUiFormkitConfig.inputs,
  plugins: nuxtUiFormkitConfig.plugins
}

export default config
