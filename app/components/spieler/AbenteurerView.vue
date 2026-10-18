<script setup lang="ts">
import type { PropType } from 'vue'
import type { Abenteurer } from '~/models'
import { useAbenteurerSchema } from '~/composables/spieler/useAbenteurerSchema'
import { useZauber } from '~/composables/stamm/useZauber'

const props = defineProps({
  abenteurer: {
    type: Object as PropType<Abenteurer>,
    required: true
  },
  onSave: {
    type: Function as PropType<(data: Partial<Abenteurer>) => Promise<void> | void>,
    default: undefined
  }
})

const { typNamen } = useStammdatenStore()
const { zauber, zauberLerneinheitenByTyp } = useZauberStore()
const { zauberLernenByTyp } = useZauber()

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}

const zauberNamen = computed(() => {
  if (!zauber.value) return []
  return zauberLernenByTyp(zauber.value, props.abenteurer.typ, false, zauberLerneinheitenByTyp).map(z => z.name).sort()
})

const schema = computed(() => useAbenteurerSchema().abenteurerInputSchema({
  typNamen: typNamen.value,
  zauberNamen: zauberNamen.value
}))

const editData = computed(() => {
  const { metaData: _metaData, _id: _id, ...rest } = props.abenteurer
  return rest
})

async function handleSave(data: Record<string, unknown>) {
  await props.onSave?.(data as Partial<Abenteurer>)
  editMode.value = false
}

const vitalFacts = computed(() => [
  { label: 'LP', title: 'Lebenspunkte', value: props.abenteurer.lp, icon: 'i-lucide-heart' },
  { label: 'AP', title: 'Ausdauerpunkte', value: props.abenteurer.ap, icon: 'i-lucide-zap' },
  { label: 'GG', title: 'Göttliche Gnade', value: props.abenteurer.gg, icon: 'i-lucide-sun' },
  { label: 'SG', title: 'Schicksalsgunst', value: props.abenteurer.sg, icon: 'i-lucide-sparkles' }
])

const combatFacts = computed(() => [
  { label: 'Angriff', value: props.abenteurer.angriff },
  { label: 'Raufen', value: props.abenteurer.raufen },
  { label: 'Abwehr', value: props.abenteurer.abwehr },
  { label: 'Zaubern', value: props.abenteurer.zaubern },
  { label: 'Resistenz Geist', value: props.abenteurer.resistenzGeist },
  { label: 'Resistenz Körper', value: props.abenteurer.resistenzKoerper }
])

const basisFacts = computed(() => {
  const basis = props.abenteurer.basis
  return [
    { label: 'St', title: 'Stärke', value: basis.st },
    { label: 'Gs', title: 'Geschicklichkeit', value: basis.gs },
    { label: 'Gw', title: 'Gewandtheit', value: basis.gw },
    { label: 'Ko', title: 'Konstitution', value: basis.ko },
    { label: 'In', title: 'Intelligenz', value: basis.in },
    { label: 'Zt', title: 'Zaubertalent', value: basis.zt },
    { label: 'Au', title: 'Aussehen', value: basis.au },
    { label: 'pA', title: 'Persönliche Ausstrahlung', value: basis.pa },
    { label: 'Wk', title: 'Willenskraft', value: basis.wk },
    { label: 'B', title: 'Bewegungsweite', value: basis.b }
  ]
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ abenteurer.name }}
        <span class="rpg-seal ml-1.5 align-middle" title="Grad">{{ abenteurer.grad }}</span>
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

    <div v-if="!editMode" class="lg:max-w-3xl">
      <p class="text-sm text-muted mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span class="inline-flex items-center gap-1.5">
          <UIcon name="i-game-icons-hood" class="size-4 text-primary" />{{ abenteurer.typ }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <UIcon name="i-lucide-user" class="size-4 text-primary" />{{ abenteurer.spieler }}
        </span>
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div
          v-for="fact in vitalFacts"
          :key="fact.label"
          class="rpg-stat flex items-center gap-3 p-3"
          :title="fact.title"
        >
          <UIcon :name="fact.icon" class="size-5 text-primary shrink-0" />
          <div>
            <p class="rpg-stat-label">
              {{ fact.label }}
            </p>
            <p class="text-2xl font-semibold text-highlighted leading-none">
              {{ fact.value }}
            </p>
          </div>
        </div>
      </div>

      <p class="rpg-section-title mb-2">
        Kampf &amp; Magie
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <div v-for="fact in combatFacts" :key="fact.label" class="rpg-stat p-2.5">
          <p class="rpg-stat-label">
            {{ fact.label }}
          </p>
          <p class="text-xl font-semibold text-highlighted leading-tight">
            {{ fact.value }}
          </p>
        </div>
      </div>

      <p class="rpg-section-title mb-2">
        Basis-Eigenschaften
      </p>
      <div class="grid grid-cols-5 gap-2 mb-4">
        <div
          v-for="fact in basisFacts"
          :key="fact.label"
          class="rpg-stat p-2 text-center"
          :title="fact.title"
        >
          <p class="rpg-stat-label">
            {{ fact.label }}
          </p>
          <p class="text-xl font-semibold text-highlighted leading-tight">
            {{ fact.value }}
          </p>
        </div>
      </div>

      <UButton
        :to="`/secured/spieler/abenteurer/${abenteurer._id}/zauber`"
        icon="i-game-icons-wizard-staff"
        color="neutral"
        variant="subtle"
        :label="`${abenteurer.zauber.length} Zauber ansehen`"
      />
    </div>

    <FUDataEdit
      v-else
      :data="editData"
      :schema="schema"
      submit-label="Speichern"
      submit-icon="i-lucide-check"
      @data-saved="handleSave"
    />

    <MetaData v-if="abenteurer.metaData" class="mt-4" :meta="abenteurer.metaData" />
  </div>
</template>
