<script setup lang="ts">
import type { DashboardTableRow } from '~/types/dashboard-showcase'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{ rows: DashboardTableRow[], searchable?: boolean }>()
const query = ref('')
const page = ref(1)
const pageSize = 3
const filteredRows = computed(() => props.rows.filter((row) => {
  const value = query.value.trim().toLowerCase()
  return !value || `${row.name} ${row.owner} ${row.status}`.toLowerCase().includes(value)
}))
const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))
const visibleRows = computed(() => filteredRows.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const columns: TableColumn<DashboardTableRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Progress' },
  { accessorKey: 'updated', header: 'Updated' }
]

watch(query, () => {
  page.value = 1
})

watch(pageCount, (value) => {
  if (page.value > value) page.value = value
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-medium text-highlighted">
            Work items
          </p>
          <p class="text-sm text-muted">
            Filter and inspect the shared data.
          </p>
        </div>
        <UInput
          v-if="searchable"
          v-model="query"
          icon="i-lucide-search"
          placeholder="Filter work"
          aria-label="Filter work items"
        />
      </div>
    </template>
    <UTable
      :data="visibleRows"
      :columns="columns"
      class="min-w-[38rem]"
    >
      <template #status-cell="{ row }">
        <UBadge
          :label="row.original.status"
          :color="row.original.status === 'At risk' ? 'error' : row.original.status === 'Review' ? 'warning' : 'success'"
          variant="subtle"
        />
      </template>
      <template #progress-cell="{ row }">
        <div class="flex items-center gap-2">
          <UProgress
            :model-value="row.original.progress"
            class="w-20"
          />
          <span class="text-xs text-muted">{{ row.original.progress }}%</span>
        </div>
      </template>
      <template #empty>
        No work items match this filter.
      </template>
    </UTable>
    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs text-muted">
          Page {{ page }} of {{ pageCount }}
        </p>
        <UPagination
          v-model="page"
          :total="filteredRows.length"
          :items-per-page="pageSize"
          show-edges
        />
      </div>
    </template>
  </UCard>
</template>
