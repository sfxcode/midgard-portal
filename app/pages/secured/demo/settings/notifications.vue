<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: 'Event Channels',
  description: 'Where should campaign events be notified?',
  fields: [{
    name: 'email',
    label: 'In-Game Mail',
    description: 'Receive event notifications via in-game message system.'
  }, {
    name: 'desktop',
    label: 'Real-time Alerts',
    description: 'Receive instant browser notifications for critical events.'
  }]
}, {
  title: 'Campaign Events',
  description: 'Which events should trigger notifications?',
  fields: [{
    name: 'weekly_digest',
    label: 'Campaign Updates',
    description: 'Receive weekly summaries of campaign progress and milestones.'
  }, {
    name: 'product_updates',
    label: 'Quest Completions',
    description: 'Get notified when party members complete major quests.'
  }, {
    name: 'important_updates',
    label: 'Critical Events',
    description: 'Alerts for critical story events, boss encounters, and campaign climaxes.'
  }]
}]

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
