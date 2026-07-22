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

const facts = computed(() => [
  { label: 'Spieler', value: props.abenteurer.spieler },
  { label: 'Typ', value: props.abenteurer.typ },
  { label: 'LP', value: props.abenteurer.lp },
  { label: 'AP', value: props.abenteurer.ap },
  { label: 'GG', value: props.abenteurer.gg },
  { label: 'SG', value: props.abenteurer.sg },
  { label: 'Angriff', value: props.abenteurer.angriff },
  { label: 'Raufen', value: props.abenteurer.raufen },
  { label: 'Abwehr', value: props.abenteurer.abwehr },
  { label: 'Zaubern', value: props.abenteurer.zaubern },
  { label: 'Resistenz', value: `${props.abenteurer.resistenzGeist} / ${props.abenteurer.resistenzKoerper}` }
])

const basisFacts = computed(() => {
  const basis = props.abenteurer.basis
  return [
    { label: 'St', value: basis.st },
    { label: 'Gs', value: basis.gs },
    { label: 'Gw', value: basis.gw },
    { label: 'Ko', value: basis.ko },
    { label: 'In', value: basis.in },
    { label: 'Zt', value: basis.zt },
    { label: 'Au', value: basis.au },
    { label: 'pA', value: basis.pa },
    { label: 'Wk', value: basis.wk },
    { label: 'B', value: basis.b }
  ]
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-display text-xl text-highlighted">
        {{ abenteurer.name }} <span class="text-sm text-muted">(Grad {{ abenteurer.grad }})</span>
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

    <div v-if="!editMode" class="lg:max-w-2xl">
      <dl class="grid grid-cols-2 gap-1 text-sm mb-3">
        <template v-for="fact in facts" :key="fact.label">
          <dt class="font-medium text-toned">
            {{ fact.label }}
          </dt>
          <dd class="text-highlighted">
            {{ fact.value }}
          </dd>
        </template>
      </dl>

      <p class="font-medium text-toned text-sm mb-1">
        Basis-Eigenschaften
      </p>
      <dl class="grid grid-cols-5 gap-1 text-sm mb-3">
        <template v-for="fact in basisFacts" :key="fact.label">
          <dt class="font-medium text-toned">
            {{ fact.label }}
          </dt>
          <dd class="text-highlighted">
            {{ fact.value }}
          </dd>
        </template>
      </dl>

      <NuxtLink :to="`/secured/spieler/abenteurer/${abenteurer._id}/zauber`" class="text-sm text-primary hover:underline">
        {{ abenteurer.zauber.length }} Zauber
      </NuxtLink>
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
