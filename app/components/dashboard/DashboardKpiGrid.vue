<script setup lang="ts">
import type { DashboardKpi } from '~/types/dashboard-showcase'

defineProps<{ items: DashboardKpi[] }>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <UCard
      v-for="item in items"
      :key="item.label"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm text-muted">
            {{ item.label }}
          </p>
          <p class="mt-2 text-2xl font-semibold text-highlighted">
            {{ item.value }}
          </p>
          <p class="mt-2 text-xs text-muted">
            {{ item.change }}
          </p>
        </div>
        <UIcon
          :name="item.icon"
          class="size-5 text-primary"
        />
      </div>
    </UCard>
  </div>
</template>
