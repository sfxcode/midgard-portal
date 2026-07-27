<script setup lang="ts">
import type { PropType } from 'vue'
import type { Spielergruppe } from '~/models'
import { useSpielergruppeSchema } from '~/composables/spieler/useSpielergruppeSchema'

const props = defineProps({
  gruppe: {
    type: Object as PropType<Spielergruppe>,
    required: true
  },
  spielerLogins: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  onSave: {
    type: Function as PropType<(data: Partial<Spielergruppe>) => Promise<void> | void>,
    required: true
  }
})

const { spielergruppeSchema } = useSpielergruppeSchema()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => spielergruppeSchema({ spielerLogins: props.spielerLogins }))

const editData = computed(() => {
  const { name, beschreibung, mitglieder } = props.gruppe
  return { name, beschreibung, mitglieder }
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave(data as Partial<Spielergruppe>)
  editMode.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ gruppe.name }}
      </p>
      <UButton
        :icon="editMode ? 'i-lucide-eye' : 'i-lucide-pencil'"
        size="xs"
        color="neutral"
        variant="subtle"
        :aria-label="editMode ? 'Ansicht' : 'Bearbeiten'"
        @click="toggleEditMode"
      />
    </div>

    <template v-if="!editMode">
      <p class="text-sm text-muted mb-3">
        {{ gruppe.beschreibung || '–' }}
      </p>

      <p class="font-medium text-toned text-sm mb-1">
        Mitglieder
      </p>
      <p class="text-sm text-highlighted">
        {{ gruppe.mitglieder.join(', ') || '–' }}
      </p>
    </template>

    <FUDataEdit
      v-else
      :data="editData"
      :schema="schema"
      submit-label="Speichern"
      submit-icon="i-lucide-check"
      @data-saved="handleSave"
    />

    <MetaData v-if="gruppe.metaData" class="mt-4" :meta="gruppe.metaData" />
  </div>
</template>
