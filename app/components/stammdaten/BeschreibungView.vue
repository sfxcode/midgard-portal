<script setup lang="ts">
import type { PropType } from 'vue'
import type { Beschreibung } from '~/models'

const props = defineProps({
  beschreibung: {
    type: Object as PropType<Beschreibung>,
    default: undefined
  },
  content: {
    type: String,
    default: ''
  },
  onSave: {
    type: Function as PropType<() => Promise<void> | void>,
    required: true
  }
})

const emit = defineEmits<{
  'update:content': [value: string]
}>()

const editMode = ref(false)
const saving = ref(false)

const isEmpty = computed(() => {
  const content = props.beschreibung?.content
  return !content || content === '<p></p>' || content.trim() === ''
})

const localContent = computed({
  get: () => props.content,
  set: (value: string) => emit('update:content', value)
})

const toolbarItems = [
  [
    { 'kind': 'mark' as const, 'mark': 'bold', 'icon': 'i-lucide-bold', 'aria-label': 'Fett' },
    { 'kind': 'mark' as const, 'mark': 'italic', 'icon': 'i-lucide-italic', 'aria-label': 'Kursiv' },
    { 'kind': 'mark' as const, 'mark': 'strike', 'icon': 'i-lucide-strikethrough', 'aria-label': 'Durchgestrichen' }
  ],
  [
    { 'kind': 'heading' as const, 'level': 2, 'icon': 'i-lucide-heading-2', 'aria-label': 'Überschrift' },
    { 'kind': 'bulletList' as const, 'icon': 'i-lucide-list', 'aria-label': 'Liste' },
    { 'kind': 'orderedList' as const, 'icon': 'i-lucide-list-ordered', 'aria-label': 'Nummerierte Liste' },
    { 'kind': 'blockquote' as const, 'icon': 'i-lucide-quote', 'aria-label': 'Zitat' }
  ],
  [
    { 'kind': 'undo' as const, 'icon': 'i-lucide-undo-2', 'aria-label': 'Rückgängig' },
    { 'kind': 'redo' as const, 'icon': 'i-lucide-redo-2', 'aria-label': 'Wiederholen' },
    { 'kind': 'clearFormatting' as const, 'icon': 'i-lucide-eraser', 'aria-label': 'Formatierung entfernen' }
  ]
]

function toggleEditMode() {
  editMode.value = !editMode.value
}

async function handleSave() {
  saving.value = true
  try {
    await props.onSave()
    editMode.value = false
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <p class="font-display text-lg text-highlighted">
        Beschreibung
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
      <div v-if="!isEmpty" class="beschreibung-content font-serif text-highlighted" v-html="beschreibung?.content" />
      <p v-else class="text-sm text-muted italic">
        Noch keine Beschreibung vorhanden.
      </p>
    </template>

    <template v-else>
      <div class="rounded-md border border-default p-3">
        <UEditor v-model="localContent" content-type="html" placeholder="Beschreibung eingeben …">
          <template #default="{ editor, handlers }">
            <UEditorToolbar
              :editor="editor"
              :handlers="handlers"
              :items="toolbarItems"
              class="mb-3 border-b border-default pb-2"
            />
          </template>
        </UEditor>
      </div>
      <div class="flex justify-end pt-3">
        <UButton
          label="Speichern"
          icon="i-lucide-check"
          :loading="saving"
          @click="handleSave"
        />
      </div>
    </template>

    <MetaData v-if="beschreibung?.metaData" class="mt-4" :meta="beschreibung.metaData" />
  </div>
</template>

<style scoped>
.beschreibung-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.beschreibung-content :deep(h1),
.beschreibung-content :deep(h2),
.beschreibung-content :deep(h3) {
  font-family: var(--font-display);
  margin-block: 0.75rem 0.375rem;
}

.beschreibung-content :deep(ul),
.beschreibung-content :deep(ol) {
  margin-bottom: 0.75rem;
  padding-inline-start: 1.25rem;
}

.beschreibung-content :deep(ul) {
  list-style-type: disc;
}

.beschreibung-content :deep(ol) {
  list-style-type: decimal;
}
</style>
