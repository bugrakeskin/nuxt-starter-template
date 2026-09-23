<script setup lang="ts">
definePageMeta({ layout: 'showcase' })

const { data, patterns } = useDashboardShowcase()

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
