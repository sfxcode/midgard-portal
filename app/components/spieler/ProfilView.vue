<script setup lang="ts">
import type { PropType } from 'vue'
import type { Spieler } from '~/models'
import { useSpielerSchema } from '~/composables/spieler/useSpielerSchema'

const props = defineProps({
  spieler: {
    type: Object as PropType<Spieler>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Spieler>) => Promise<void> | void>,
    required: true
  }
})

const { spielerProfilSchema } = useSpielerSchema()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => spielerProfilSchema())

const editData = computed(() => {
  const { name, email, avatar } = props.spieler
  return { name, email, avatar }
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave(data as Partial<Spieler>)
  editMode.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ spieler.name }}
      </p>
      <UButton
        :icon="editMode ? 'i-lucide-eye' : 'i-lucide-pencil'"
        size="xs"
        color="neutral"
        variant="subtle"
        :aria-label="editMode ? 'Ansicht' : 'Bearbeiten'"
        :label="editMode ? 'Ansicht' : 'Bearbeiten'"
        @click="toggleEditMode"
      />
    </div>

    <template v-if="!editMode">
      <FactGrid
        class="mb-3"
        :facts="[
          { label: 'Login', value: spieler.login },
          { label: 'E-Mail', value: spieler.email }
        ]"
      />
    </template>

    <FUDataEdit
      v-else
      :data="editData"
      :schema="schema"
      submit-label="Speichern"
      submit-icon="i-lucide-check"
      @data-saved="handleSave"
    />

    <MetaData v-if="spieler.metaData" class="mt-4" :meta="spieler.metaData" />
  </div>
</template>
