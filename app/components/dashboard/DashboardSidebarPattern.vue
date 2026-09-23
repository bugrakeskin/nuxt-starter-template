<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
    <UCard class="hidden h-fit lg:block">
      <nav
        aria-label="Dashboard sections"
        class="grid gap-1"
      >
        <UButton
          v-for="item in ['Overview', 'Work items', 'Activity', 'Settings']"
          :key="item"
          :label="item"
          :variant="item === 'Overview' ? 'soft' : 'ghost'"
          color="neutral"
          block
          class="justify-start"
        />
      </nav>
    </UCard>
    <div class="grid gap-6">
      <DashboardKpiGrid :items="data.kpis" /><div class="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <DashboardTrendChart :points="data.trend" /><DashboardActivityList :items="data.activities" />
      </div><DashboardDataTable
        :rows="data.rows"
        searchable
      />
    </div>
  </div>
</template>
