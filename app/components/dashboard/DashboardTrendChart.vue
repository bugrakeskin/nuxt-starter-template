<script setup lang="ts">
defineProps<{ points: { label: string, value: number }[] }>()
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-medium text-highlighted">
        Delivery trend
      </p>
      <p class="text-sm text-muted">
        A lightweight chart using the shared fixture.
      </p>
    </template>
    <div
      class="flex h-48 items-end gap-2 sm:gap-4"
      aria-label="Delivery trend chart"
      role="img"
    >
      <div
        v-for="point in points"
        :key="point.label"
        class="flex min-w-0 flex-1 flex-col items-center gap-2"
      >
        <div class="flex h-36 w-full items-end rounded-md bg-elevated px-1">
          <div
            class="w-full rounded-sm bg-primary"
            :style="{ height: `${point.value}%` }"
            :title="`${point.label}: ${point.value}`"
          />
        </div>
        <span class="text-xs text-muted">{{ point.label }}</span>
      </div>
    </div>
  </UCard>
</template>
