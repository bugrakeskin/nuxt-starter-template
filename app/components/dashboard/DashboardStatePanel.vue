<template>
  <div class="grid gap-4 md:grid-cols-3">
    <UCard>
      <template #header>
        <p class="font-medium text-highlighted">
          Loading
        </p>
      </template>
      <USkeleton class="h-4 w-3/4" />
      <USkeleton class="mt-3 h-8 w-1/2" />
    </UCard>
    <UCard>
      <template #header>
        <p class="font-medium text-highlighted">
          Empty
        </p>
      </template>
      <div class="py-2 text-center">
        <UIcon
          name="i-lucide-inbox"
          class="size-6 text-muted"
        /><p class="mt-2 text-sm text-muted">
          Nothing needs attention.
        </p>
      </div>
    </UCard>
    <UCard>
      <template #header>
        <p class="font-medium text-highlighted">
          Error
        </p>
      </template>
      <UAlert
        title="Example unavailable"
        description="This local state does not call a backend."
        color="error"
        variant="subtle"
      />
    </UCard>
  </div>
</template>
