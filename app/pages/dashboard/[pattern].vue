<script setup lang="ts">
import { getDashboardPattern, isDashboardPatternId } from '~/data/dashboard-showcase'

definePageMeta({ layout: 'showcase' })

const route = useRoute()
const { data } = useDashboardShowcase()
const patternId = computed(() => String(route.params.pattern))
const pattern = computed(() => getDashboardPattern(patternId.value))

if (!isDashboardPatternId(patternId.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Dashboard wireframe not found' })
}

useSeoMeta({
  title: () => `${pattern.value?.label || 'Dashboard'} showcase`,
  description: () => pattern.value?.description || 'Nuxt starter dashboard showcase.'
})
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <header class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <UBadge
          label="Dashboard wireframe"
          color="neutral"
          variant="subtle"
          class="mb-3"
        />
        <h1 class="text-3xl font-semibold text-highlighted">
          {{ pattern?.label }}
        </h1>
        <p class="mt-2 text-muted">
          {{ pattern?.description }}
        </p>
      </div>
      <UButton
        to="/"
        label="All wireframes"
        icon="i-lucide-layout-grid"
        color="neutral"
        variant="outline"
      />
    </header>

    <DashboardSidebarPattern
      v-if="patternId === 'sidebar'"
      :data="data"
    />
    <DashboardIconSidebarPattern
      v-else-if="patternId === 'icon-sidebar'"
      :data="data"
    />
    <DashboardHorizontalPattern
      v-else-if="patternId === 'horizontal'"
      :data="data"
    />
    <DashboardThreeColumnPattern
      v-else-if="patternId === 'three-column'"
      :data="data"
    />
    <DashboardBentoPattern
      v-else-if="patternId === 'bento'"
      :data="data"
    />
    <DashboardReportPattern
      v-else
      :data="data"
    />
  </UContainer>
</template>
