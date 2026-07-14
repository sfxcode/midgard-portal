<script setup lang="ts">
import type { PropType } from 'vue'
import type { Fertigkeit } from '~/models'
import { useStammSchemas } from '~/composables/stamm/useStammSchemas'

const props = defineProps({
  fertigkeit: {
    type: Object as PropType<Fertigkeit>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Fertigkeit>) => Promise<void> | void>,
    required: true
  }
})

const { fertigkeitSchema } = useStammSchemas()
const { fertigkeiten: alleFertigkeiten } = useFertigkeitenStore()
const { uniqueValues } = useArrayFunctions()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => fertigkeitSchema({
  kategorien: uniqueValues(alleFertigkeiten.value ?? [], v => v.kategorie),
  schwierigkeiten: uniqueValues(alleFertigkeiten.value ?? [], v => v.schwierigkeit)
}))

const editData = computed(() => {
  const { metaData: _metaData, _id: _id, ...rest } = props.fertigkeit
  return rest
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave(data as Partial<Fertigkeit>)
  editMode.value = false
}

const facts = computed(() => [
  { label: 'Leitwert', value: props.fertigkeit.leitwert },
  { label: 'Buch', value: props.fertigkeit.buch },
  { label: 'Schwierigkeit', value: props.fertigkeit.schwierigkeit },
  { label: 'Lerneinheiten', value: props.fertigkeit.lerneinheiten },
  { label: 'Gelernt', value: props.fertigkeit.gelernt },
  { label: 'Ungelernt', value: props.fertigkeit.ungelernt }
])
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ fertigkeit.name }}
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
        {{ fertigkeit.kategorie }}
      </p>

      <dl class="grid grid-cols-2 gap-1 text-sm">
        <template v-for="fact in facts" :key="fact.label">
          <dt class="font-medium text-toned">
            {{ fact.label }}
          </dt>
          <dd class="text-highlighted">
            {{ fact.value }}
          </dd>
        </template>
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

    <MetaData v-if="fertigkeit.metaData" class="mt-4" :meta="fertigkeit.metaData" />
  </div>
</template>
