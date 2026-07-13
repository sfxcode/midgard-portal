<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const accessSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type AccessSchema = z.output<typeof accessSchema>

const access = reactive<Partial<AccessSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<AccessSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Access codes must be different' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    title="Access Code"
    description="Update your campaign access code to control who can join."
    variant="subtle"
  >
    <UForm
      :schema="accessSchema"
      :state="access"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="access.current"
          type="password"
          placeholder="Current access code"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="access.new"
          type="password"
          placeholder="New access code"
          class="w-full"
        />
      </UFormField>

      <UButton label="Update" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="Campaign Closure"
    description="Permanently close this campaign and archive all data. This action is not reversible. All information related to this campaign will be archived permanently."
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="Close Campaign" color="error" />
    </template>
  </UPageCard>
</template>
