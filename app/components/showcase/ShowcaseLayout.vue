<script setup lang="ts">
const { releaseTag } = useReleaseTag()
</script>

<template>
  <div class="min-h-screen bg-default">
    <ShowcaseHeader />
    <UMain>
      <slot />
    </UMain>
    <UFooter class="border-t border-default">
      <template #left>
        <p class="text-sm text-muted">
          Unfogy Nuxt starter showcase
        </p>
      </template>
      <template #right>
        <UBadge
          :label="releaseTag"
          color="neutral"
          variant="subtle"
        />
      </template>
    </UFooter>
  </div>
</template>
