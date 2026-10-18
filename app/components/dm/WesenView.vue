<script setup lang="ts">
import type { PropType } from 'vue'
import type { Wesen } from '~/models'
import { useWesenSchema } from '~/composables/dm/useWesenSchema'
import { useBestiarium } from '~/composables/dm/useBestiarium'
import { useWesen } from '~/composables/dm/useWesen'

const props = defineProps({
  wesen: {
    type: Object as PropType<Wesen>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Wesen>) => Promise<void> | void>,
    default: undefined
  }
})

const { wesenSchema } = useWesenSchema()
const { gruppen, regionen, ruestungen } = useBestiarium()
const { angriffeToString, besonderheitenToString, zauberToString, vorkommenToString } = useWesen()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const schema = computed(() => wesenSchema({
  kategorien: gruppen,
  regionen,
  ruestungen
}))

const editData = computed(() => {
  const { metaData: _metaData, _id: _id, ...rest } = props.wesen
  return rest
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave?.(data as Partial<Wesen>)
  editMode.value = false
}

const facts = computed(() => [
  { label: 'LP', value: props.wesen.lp },
  { label: 'AP', value: props.wesen.ap },
  { label: 'Rüstung', value: props.wesen.ruestung },
  { label: 'Gf', value: props.wesen.gf },
  { label: 'St', value: props.wesen.st },
  { label: 'Gw', value: props.wesen.gw },
  { label: 'In', value: props.wesen.in },
  { label: 'Bewegung', wide: true, value: `${props.wesen.b}${props.wesen.fliegend ? ` (${props.wesen.fliegend})` : ''}` },
  { label: 'Abwehr', value: props.wesen.abwehr },
  { label: 'Resistenz', wide: true, value: `${props.wesen.resistenzGeist} / ${props.wesen.resistenzKoerper}` }
])
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ wesen.name }}
        <span class="rpg-seal ml-1.5 align-middle" title="Grad">{{ wesen.grad }}</span>
      </p>
      <UButton
        v-if="onSave"
        :icon="editMode ? 'i-lucide-eye' : 'i-lucide-pencil'"
        size="xs"
        color="neutral"
        variant="subtle"
        :aria-label="editMode ? 'Ansicht' : 'Bearbeiten'"
        :label="editMode ? 'Ansicht' : 'Bearbeiten'"
        @click="toggleEditMode"
      />
    </div>

    <div v-if="!editMode" class="lg:max-w-2xl">
      <p class="text-sm text-muted mb-3">
        {{ wesen.kategorie }}
      </p>

      <FactGrid class="mb-4" :facts="facts" />

      <div class="text-sm mb-2">
        <span class="font-medium text-toned mr-2">Angriff:</span>{{ angriffeToString(wesen) }}
      </div>
      <div v-if="wesen.besonderheiten.length > 0" class="text-sm mb-2">
        <span class="font-medium text-toned mr-2">Bes.:</span>{{ besonderheitenToString(wesen) }}
      </div>
      <div v-if="wesen.zauber.length > 0" class="text-sm mb-2">
        <span class="font-medium text-toned mr-2">Zauber:</span>{{ zauberToString(wesen) }}
      </div>
      <div class="text-sm mb-2">
        <span class="font-medium text-toned mr-2">Vorkommen:</span>{{ vorkommenToString(wesen) }}
      </div>
    </div>

    <FUDataEdit
      v-else
      :data="editData"
      :schema="schema"
      submit-label="Speichern"
      submit-icon="i-lucide-check"
      @data-saved="handleSave"
    />

    <MetaData v-if="wesen.metaData" class="mt-4" :meta="wesen.metaData" />
  </div>
</template>
