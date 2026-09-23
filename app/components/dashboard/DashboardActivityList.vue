<script setup lang="ts">
import type { DashboardActivity } from '~/types/dashboard-showcase'

defineProps<{ items: DashboardActivity[] }>()
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-medium text-highlighted">
        Recent activity
      </p>
      <p class="text-sm text-muted">
        Local fixture state for the showcase.
      </p>
    </template>
    <ul class="divide-y divide-default">
      <li
        v-for="item in items"
        :key="item.title"
        class="flex gap-3 py-3 first:pt-0 last:pb-0"
      >
        <span
          class="mt-1 size-2 shrink-0 rounded-full bg-primary"
          :class="{ 'bg-warning': item.status === 'warning' }"
        />
        <div class="min-w-0 flex-1">
          <p class="font-medium text-highlighted">
            {{ item.title }}
          </p>
          <p class="text-sm text-muted">
            {{ item.detail }}
          </p>
        </div>
        <time class="shrink-0 text-xs text-muted">{{ item.time }}</time>
      </li>
    </ul>
  </UCard>
</template>
