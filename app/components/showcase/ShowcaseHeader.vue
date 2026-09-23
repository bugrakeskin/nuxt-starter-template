<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { dashboardPatterns } from '~/data/dashboard-showcase'
import type { ThemePresetId } from '~/utils/theme-presets'

const route = useRoute()
const { activePreset, activePresetId, applyPreset, presets } = useThemePreset()

const themeItems = computed<DropdownMenuItem[]>(() => presets.map(preset => ({
  label: preset.label,
  description: preset.description,
  icon: activePresetId.value === preset.id ? 'i-lucide-check' : 'i-lucide-palette',
  onSelect: () => applyPreset(preset.id as ThemePresetId)
})))

const wireframeItems = computed<DropdownMenuItem[]>(() => dashboardPatterns.map(pattern => ({
  label: pattern.label,
  description: pattern.description,
  icon: pattern.icon,
  to: `/dashboard/${pattern.id}`
})))

const activePattern = computed(() => dashboardPatterns.find(pattern => route.params.pattern === pattern.id))
</script>

<template>
  <UHeader class="border-b border-default">
    <template #left>
      <NuxtLink
        to="/"
        aria-label="Unfogy starter showcase home"
        class="rounded-md outline-primary/25 focus-visible:outline-3"
      >
        <AppLogo />
      </NuxtLink>
      <UBadge
        label="Showcase"
        color="neutral"
        variant="subtle"
        class="hidden sm:inline-flex"
      />
    </template>
    <template #right>
      <UDropdownMenu
        :items="themeItems"
        :content="{ align: 'end' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-palette"
          :label="activePreset.label"
          trailing-icon="i-lucide-chevron-down"
          aria-label="Choose theme preset"
        />
      </UDropdownMenu>
      <UDropdownMenu
        :items="wireframeItems"
        :content="{ align: 'end' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-layout-dashboard"
          :label="activePattern?.label || 'Wireframes'"
          trailing-icon="i-lucide-chevron-down"
          aria-label="Choose dashboard wireframe"
        />
      </UDropdownMenu>
      <UColorModeButton aria-label="Change color mode" />
    </template>
    <template #body>
      <div class="grid gap-3 p-4">
        <UDropdownMenu
          :items="themeItems"
          :content="{ align: 'start' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-palette"
            :label="`Theme: ${activePreset.label}`"
            trailing-icon="i-lucide-chevron-down"
            block
            class="justify-between"
          />
        </UDropdownMenu>
        <UDropdownMenu
          :items="wireframeItems"
          :content="{ align: 'start' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-layout-dashboard"
            :label="`Wireframe: ${activePattern?.label || 'Choose'}`"
            trailing-icon="i-lucide-chevron-down"
            block
            class="justify-between"
          />
        </UDropdownMenu>
        <UColorModeButton aria-label="Change color mode" />
      </div>
    </template>
  </UHeader>
</template>
