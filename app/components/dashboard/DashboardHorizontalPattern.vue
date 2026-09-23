<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
</script>

<template>
  <div class="grid gap-6">
    <nav
      aria-label="Horizontal dashboard sections"
      class="flex gap-1 overflow-x-auto border-b border-default pb-2"
    >
      <UButton
        v-for="item in ['Overview', 'Portfolio', 'Reports', 'Team']"
        :key="item"
        :label="item"
        color="neutral"
        :variant="item === 'Overview' ? 'soft' : 'ghost'"
      />
    </nav><div class="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
      <div class="grid gap-6">
        <DashboardKpiGrid :items="data.kpis" /><DashboardTrendChart :points="data.trend" />
      </div><DashboardActivityList :items="data.activities" />
    </div><DashboardDataTable
      :rows="data.rows"
      searchable
    />
  </div>
</template>
