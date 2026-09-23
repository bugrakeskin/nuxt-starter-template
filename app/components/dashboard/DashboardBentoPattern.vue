<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <UCard
      v-for="item in data.kpis"
      :key="item.label"
    >
      <p class="text-sm text-muted">
        {{ item.label }}
      </p><p class="mt-3 text-3xl font-semibold text-highlighted">
        {{ item.value }}
      </p><p class="mt-2 text-sm text-primary">
        {{ item.change }}
      </p>
    </UCard><div class="md:col-span-2 xl:col-span-3">
      <DashboardTrendChart :points="data.trend" />
    </div><div><DashboardActivityList :items="data.activities.slice(0, 3)" /></div><div class="md:col-span-2 xl:col-span-4">
      <DashboardDataTable :rows="data.rows" />
    </div>
  </div>
</template>
