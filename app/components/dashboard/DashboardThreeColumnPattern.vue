<script setup lang="ts">
import type { DashboardShowcaseData } from '~/types/dashboard-showcase'

defineProps<{ data: DashboardShowcaseData }>()
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-[15rem_minmax(0,1fr)_18rem]">
    <UCard class="h-fit">
      <template #header>
        <p class="font-medium text-highlighted">
          Workspace
        </p>
      </template><nav class="grid gap-1">
        <UButton
          v-for="item in ['All work', 'In progress', 'Completed']"
          :key="item"
          :label="item"
          color="neutral"
          variant="ghost"
          block
          class="justify-start"
        />
      </nav>
    </UCard><div class="grid gap-4">
      <DashboardKpiGrid :items="data.kpis.slice(0, 2)" /><DashboardDataTable :rows="data.rows" />
    </div><DashboardActivityList :items="data.activities" />
  </div>
</template>
