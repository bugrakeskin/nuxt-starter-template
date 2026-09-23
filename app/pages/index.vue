<script setup lang="ts">
definePageMeta({ layout: 'showcase' })

const { data, patterns } = useDashboardShowcase()
const { presets, activePreset } = useThemePreset()

useSeoMeta({
  title: 'Starter showcase',
  description: 'Explore six Nuxt UI dashboard wireframe patterns using one shared fixture.'
})
</script>

<template>
  <div>
    <UPageHero
      title="A controlled starting point for customer applications"
      description="Explore six dashboard wireframes, one semantic theme system and one shared showcase dataset. Choose a direction before adding customer-specific business UI."
      :links="[{
        label: 'Explore themes',
        to: '/theme',
        icon: 'i-lucide-palette',
        color: 'neutral',
        variant: 'outline',
        size: 'xl'
      }]"
    />

    <UPageSection
      title="Choose a dashboard starting point"
      description="Each pattern renders the same synthetic data with a different information architecture."
    >
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UCard
          v-for="pattern in patterns"
          :key="pattern.id"
          class="flex flex-col"
        >
          <div class="flex items-start justify-between gap-4">
            <UIcon
              :name="pattern.icon"
              class="size-6 text-primary"
            />
            <UBadge
              label="Showcase"
              color="neutral"
              variant="subtle"
            />
          </div>
          <h2 class="mt-5 text-lg font-semibold text-highlighted">
            {{ pattern.label }}
          </h2>
          <p class="mt-2 flex-1 text-sm text-muted">
            {{ pattern.description }}
          </p>
          <UButton
            :to="`/dashboard/${pattern.id}`"
            label="Open wireframe"
            trailing-icon="i-lucide-arrow-up-right"
            class="mt-6 self-start"
          />
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="Choose a theme preset"
      description="The starter includes the Nuxt UI Theme Studio presets. The same selection is available from the header dropdown."
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UCard
          v-for="preset in presets"
          :key="preset.id"
          class="flex h-full flex-col"
          :class="activePreset.id === preset.id ? 'ring-2 ring-primary' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="font-semibold text-highlighted">
                {{ preset.label }}
              </h2>
              <p class="mt-1 text-xs text-muted">
                {{ preset.font?.sans || 'Nuxt UI default' }}
              </p>
            </div>
            <UBadge
              v-if="activePreset.id === preset.id"
              label="Active"
              color="primary"
              variant="soft"
            />
          </div>
          <p class="mt-4 flex-1 text-sm text-muted">
            {{ preset.description }}
          </p>
          <UButton
            to="/theme"
            label="Preview preset"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-up-right"
            class="mt-5 self-start"
          />
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="One shared fixture"
      description="The same KPI, trend, activity and work-item data flows through every pattern."
    >
      <DashboardKpiGrid :items="data.kpis" />
    </UPageSection>

    <UPageSection
      title="State and interaction examples"
      description="Loading, empty, error and local interaction states are part of the baseline showcase."
    >
      <DashboardStatePanel />
    </UPageSection>
  </div>
</template>
