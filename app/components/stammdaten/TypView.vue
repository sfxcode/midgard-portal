<script setup lang="ts">
import type { PropType } from 'vue'
import type { Typ } from '~/models'
import { useStammSchemas } from '~/composables/stamm/useStammSchemas'

const props = defineProps({
  typ: {
    type: Object as PropType<Typ>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Typ>) => Promise<void> | void>,
    required: true
  }
})

const { typSchema } = useStammSchemas()
const { typen: alleTypen } = useStammdatenStore()
const { uniqueValues } = useArrayFunctions()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => typSchema({
  kategorien: uniqueValues(alleTypen.value ?? [], v => v.kategorie)
}))

const editData = computed(() => {
  const { metaData: _metaData, _id: _id, ...rest } = props.typ
  return rest
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave(data as Partial<Typ>)
  editMode.value = false
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ typ.name }}
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
        {{ typ.kategorie }}
      </p>

      <dl class="grid grid-cols-2 gap-1 text-sm">
        <dt class="font-medium text-toned">
          Name kurz
        </dt>
        <dd class="text-highlighted">
          {{ typ.nameKurz }}
        </dd>
      </dl>
    </template>

    <FUDataEdit
      v-else
      :data="editData"
      :schema="schema"
      submit-label="Speichern"
      submit-icon="i-lucide-check"
      @data-saved="handleSave"
    />

    <MetaData v-if="typ.metaData" class="mt-4" :meta="typ.metaData" />
  </div>
</template>
