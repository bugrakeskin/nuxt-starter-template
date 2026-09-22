<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() => {
  if (props.error.statusCode === 403) return 'Access denied'
  if (props.error.statusCode === 404) return 'Page not found'
  return 'Something went wrong'
})

function clear() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <UContainer class="flex min-h-screen items-center justify-center py-12">
      <UCard class="w-full max-w-lg text-center">
        <p class="text-sm font-medium text-primary">
          Error {{ error.statusCode }}
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-highlighted">
          {{ title }}
        </h1>
        <p class="mt-3 text-muted">
          {{ error.statusMessage || 'The request could not be completed.' }}
        </p>
        <UButton
          class="mt-6"
          label="Return home"
          @click="clear"
        />
      </UCard>
    </UContainer>
  </UApp>
</template>
