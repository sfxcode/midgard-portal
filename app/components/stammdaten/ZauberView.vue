<script setup lang="ts">
import type { PropType } from 'vue'
import type { Zauber } from '~/models'
import { useStammSchemas } from '~/composables/stamm/useStammSchemas'

const props = defineProps({
  zauber: {
    type: Object as PropType<Zauber>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Zauber>) => Promise<void> | void>,
    required: true
  }
})

const { zauberSchema } = useStammSchemas()
const { zauber: alleZauber } = useZauberStore()
const { uniqueValues } = useArrayFunctions()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => zauberSchema({
  kategorien: uniqueValues(alleZauber.value ?? [], v => v.kategorie),
  arten: uniqueValues(alleZauber.value ?? [], v => v.art),
  prozesse: uniqueValues(alleZauber.value ?? [], v => v.prozess),
  zauberdauern: uniqueValues(alleZauber.value ?? [], v => v.zauberdauer)
}))

const editData = computed(() => {
  const { metaData: _metaData, _id: _id, ...rest } = props.zauber
  return rest
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave(data as Partial<Zauber>)
  editMode.value = false
}

const facts = computed(() => [
  { label: 'Stufe', value: props.zauber.stufe },
  { label: 'AP-Verbrauch', value: props.zauber.ap },
  { label: 'Zauberdauer', value: props.zauber.zauberdauer },
  { label: 'Reichweite', value: props.zauber.reichweite },
  { label: 'Wirkungsziel', value: props.zauber.wirkungsziel },
  { label: 'Wirkungsbereich', value: props.zauber.wirkungsbereich },
  { label: 'Wirkungsdauer', value: props.zauber.wirkungsdauer },
  { label: 'Ursprung', value: props.zauber.ursprung }
])
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ zauber.name }}
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
        {{ zauber.kategorie }} · {{ zauber.art }}
      </p>
      <p class="text-sm text-muted mb-3">
        {{ zauber.prozess }} · {{ zauber.agens }} · {{ zauber.reagens }}
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

    <MetaData v-if="zauber.metaData" class="mt-4" :meta="zauber.metaData" />
  </div>
</template>
