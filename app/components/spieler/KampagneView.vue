<script setup lang="ts">
import type { PropType } from 'vue'
import type { Kampagne } from '~/models'
import { useKampagneSchema } from '~/composables/spieler/useKampagneSchema'

const props = defineProps({
  kampagne: {
    type: Object as PropType<Kampagne>,
    required: true
  },
  spielerLogins: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  onSave: {
    type: Function as PropType<(data: Partial<Kampagne>) => Promise<void> | void>,
    default: undefined
  }
})

const { kampagneSchema } = useKampagneSchema()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => kampagneSchema({ spielerLogins: props.spielerLogins }))

const editData = computed(() => {
  const { name, beschreibung, spieler } = props.kampagne
  return { name, beschreibung, spieler }
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave?.(data as Partial<Kampagne>)
  editMode.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ kampagne.name }}
      </p>
      <UButton
        v-if="onSave"
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
        {{ kampagne.beschreibung || '–' }}
      </p>

      <dl class="grid grid-cols-2 gap-1 text-sm mb-3">
        <dt class="font-medium text-toned">
          Spielleiter
        </dt>
        <dd class="text-highlighted">
          {{ kampagne.spielleiter }}
        </dd>
      </dl>

      <p class="font-medium text-toned text-sm mb-1">
        Spieler
      </p>
      <p class="text-sm text-highlighted">
        {{ kampagne.spieler.join(', ') || '–' }}
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

    <MetaData v-if="kampagne.metaData" class="mt-4" :meta="kampagne.metaData" />
  </div>
</template>
