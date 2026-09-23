<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[4rem_minmax(0,1fr)]">
    <UCard class="hidden h-fit lg:block">
      <nav
        aria-label="Compact dashboard sections"
        class="grid gap-3"
      >
        <UButton
          v-for="icon in ['i-lucide-layout-dashboard', 'i-lucide-list-checks', 'i-lucide-chart-no-axes-combined', 'i-lucide-settings']"
          :key="icon"
          :icon="icon"
          color="neutral"
          variant="ghost"
          square
          :aria-label="icon"
        />
      </nav>
    </UCard><div class="grid gap-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xl font-semibold text-highlighted">
            Work items
          </p><p class="text-sm text-muted">
            Compact navigation, dense information.
          </p>
        </div><UButton
          label="New item"
          icon="i-lucide-plus"
        />
      </div><DashboardKpiGrid :items="data.kpis.slice(0, 3)" /><DashboardDataTable
        :rows="data.rows"
        searchable
      />
    </div>
  </div>
</template>
