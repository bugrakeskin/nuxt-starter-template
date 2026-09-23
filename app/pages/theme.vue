<script setup lang="ts">
import type { ThemePresetId } from '~/utils/theme-presets'

definePageMeta({ layout: 'showcase' })

const { activePreset, activePresetId, applyPreset, presets } = useThemePreset()

const email = ref('alex@example.com')
const notifications = ref(true)
const workspace = ref('Operations')

const workspaces = ['Operations', 'Delivery', 'Support']
const stats = [
  { label: 'Active work', value: '24', icon: 'i-lucide-list-checks' },
  { label: 'Healthy services', value: '18/18', icon: 'i-lucide-heart-pulse' },
  { label: 'Waiting review', value: '7', icon: 'i-lucide-message-square-more' }
]

function selectPreset(id: ThemePresetId) {
  applyPreset(id)
}

useSeoMeta({
  title: 'Theme presets',
  description: 'Nuxt UI theme presets for the Unfogy starter.'
})
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <div class="flex flex-col gap-8">
      <header class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <UBadge
            label="Theme"
            variant="subtle"
            class="mb-3"
          />
          <h1 class="text-3xl font-semibold text-highlighted sm:text-4xl">
            One interface, several presets
          </h1>
          <p class="mt-3 text-base text-muted sm:text-lg">
            The page uses Nuxt UI components and semantic tokens. Presets change global colors,
            radius and selected component defaults without changing this template.
          </p>
        </div>

        <UColorModeButton aria-label="Change color mode" />
      </header>

      <UCard>
        <template #header>
          <div class="flex flex-col gap-1">
            <p class="font-medium text-highlighted">
              Preset
            </p>
            <p class="text-sm text-muted">
              Current: {{ activePreset.label }} — {{ activePreset.description }}
            </p>
          </div>
        </template>

        <div class="grid gap-3 sm:grid-cols-3">
          <UButton
            v-for="preset in presets"
            :key="preset.id"
            :label="preset.label"
            :icon="activePresetId === preset.id ? 'i-lucide-check' : 'i-lucide-palette'"
            :color="activePresetId === preset.id ? 'primary' : 'neutral'"
            :variant="activePresetId === preset.id ? 'solid' : 'outline'"
            block
            @click="selectPreset(preset.id)"
          />
        </div>
      </UCard>

      <div class="grid gap-4 sm:grid-cols-3">
        <UCard
          v-for="stat in stats"
          :key="stat.label"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-muted">
                {{ stat.label }}
              </p>
              <p class="mt-2 text-2xl font-semibold text-highlighted">
                {{ stat.value }}
              </p>
            </div>
            <UIcon
              :name="stat.icon"
              class="size-5 text-primary"
            />
          </div>
        </UCard>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <UCard>
          <template #header>
            <div>
              <p class="font-medium text-highlighted">
                Account preferences
              </p>
              <p class="mt-1 text-sm text-muted">
                Form controls inherit the active preset's global defaults.
              </p>
            </div>
          </template>

          <div class="grid gap-5">
            <UFormField
              label="Email"
              description="Used for workflow notifications."
              required
            >
              <UInput
                v-model="email"
                type="email"
                icon="i-lucide-mail"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Workspace">
              <USelect
                v-model="workspace"
                :items="workspaces"
                class="w-full"
              />
            </UFormField>

            <div class="flex items-center justify-between gap-4 rounded-lg border border-default bg-elevated/40 p-4">
              <div>
                <p class="font-medium text-highlighted">
                  Notifications
                </p>
                <p class="text-sm text-muted">
                  Receive updates when work needs attention.
                </p>
              </div>
              <USwitch v-model="notifications" />
            </div>
          </div>

          <template #footer>
            <div class="flex flex-wrap justify-end gap-2">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
              />
              <UButton
                label="Save preferences"
                icon="i-lucide-check"
              />
            </div>
          </template>
        </UCard>

        <div class="grid content-start gap-4">
          <UAlert
            title="Theme-aware status"
            description="Semantic primary, background, text and border tokens follow the selected preset."
            icon="i-lucide-sparkles"
            color="primary"
          />

          <UCard>
            <template #header>
              <p class="font-medium text-highlighted">
                Component states
              </p>
            </template>

            <div class="flex flex-wrap gap-2">
              <UBadge label="Primary" />
              <UBadge
                label="Success"
                color="success"
              />
              <UBadge
                label="Warning"
                color="warning"
              />
              <UBadge
                label="Error"
                color="error"
              />
            </div>

            <UProgress
              :model-value="72"
              class="mt-6"
            />

            <div class="mt-6 flex flex-wrap gap-2">
              <UButton label="Default" />
              <UButton
                label="Soft"
                variant="soft"
              />
              <UButton
                label="Outline"
                variant="outline"
              />
            </div>
          </UCard>
        </div>
      </div>

      <footer class="flex flex-col gap-3 border-t border-default pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Presets include persistent colors, radius, component defaults and typography pairings.
        </p>
        <UButton
          label="Back to starter"
          to="/"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
        />
      </footer>
    </div>
  </UContainer>
</template>
