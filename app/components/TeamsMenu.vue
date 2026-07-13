<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const teams = ref([{
  label: 'The Lost Kingdom',
  avatar: {
    src: 'https://api.dicebear.com/7.x/initials/svg?seed=LK',
    alt: 'The Lost Kingdom'
  }
}, {
  label: 'Dragon Slayers',
  avatar: {
    src: 'https://api.dicebear.com/7.x/initials/svg?seed=DS',
    alt: 'Dragon Slayers'
  }
}, {
  label: 'Shadow Conspiracy',
  avatar: {
    src: 'https://api.dicebear.com/7.x/initials/svg?seed=SC',
    alt: 'Shadow Conspiracy'
  }
}])
const selectedTeam = ref(teams.value[0])

const items = computed<DropdownMenuItem[][]>(() => {
  return [teams.value.map(team => ({
    ...team,
    onSelect() {
      selectedTeam.value = team
    }
  })), [{
    label: 'Start New Campaign',
    icon: 'i-lucide-circle-plus'
  }, {
    label: 'Manage Campaigns',
    icon: 'i-lucide-cog'
  }]]
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated font-display"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
