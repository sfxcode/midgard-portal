<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const fileRef = ref<HTMLInputElement>()

const campaignSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  avatar: z.string().optional(),
  bio: z.string().optional()
})

type CampaignSchema = z.output<typeof campaignSchema>

const campaign = reactive<Partial<CampaignSchema>>({
  name: 'The Lost Kingdom',
  email: 'master@campaign.com',
  username: 'dungeonmaster',
  avatar: undefined,
  bio: undefined
})
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<CampaignSchema>) {
  toast.add({
    title: 'Success',
    description: 'Campaign settings have been updated.',
    icon: 'i-lucide-check',
    color: 'success'
  })
  console.log(event.data)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  campaign.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="campaign-setup"
    :schema="campaignSchema"
    :state="campaign"
    @submit="onSubmit"
  >
    <UPageCard
      title="Campaign Profile"
      description="These details define your campaign's identity."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="campaign-setup"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Campaign Name"
        description="The epic name of your campaign or world."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="campaign.name"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Master Contact"
        description="Email for campaign master/administrator contact."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="campaign.email"
          type="email"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="username"
        label="Dungeon Master"
        description="Your unique DM alias for authorization and roleplay."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="campaign.username"
          type="username"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Campaign Banner"
        description="JPG, GIF or PNG. 1MB Max. Campaign emblem or banner."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="campaign.avatar"
            :alt="campaign.name"
            size="lg"
          />
          <UButton
            label="Choose"
            color="neutral"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          >
        </div>
      </UFormField>
      <USeparator />
      <UFormField
        name="bio"
        label="Campaign Lore"
        description="Rich description of your campaign setting and story. URLs are hyperlinked."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="campaign.bio"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
