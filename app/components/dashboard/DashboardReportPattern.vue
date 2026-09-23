<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
const tabs = ['Overview', 'Progress', 'Activity']
const activeTab = ref(tabs[0])
</script>

<template>
  <div class="mx-auto grid max-w-5xl gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xl font-semibold text-highlighted">
          Delivery report
        </p><p class="text-sm text-muted">
          A focused, single-column reporting layout.
        </p>
      </div><UButton
        label="Export"
        icon="i-lucide-download"
        color="neutral"
        variant="outline"
      />
    </div><UTabs
      v-model="activeTab"
      :items="tabs.map(label => ({ label }))"
    /><DashboardKpiGrid :items="data.kpis.slice(0, 3)" /><DashboardTrendChart
      v-if="activeTab === 'Overview' || activeTab === 'Progress'"
      :points="data.trend"
    /><DashboardActivityList
      v-else
      :items="data.activities"
    /><DashboardDataTable :rows="data.rows" /><DashboardInteractionPanel />
  </div>
</template>
