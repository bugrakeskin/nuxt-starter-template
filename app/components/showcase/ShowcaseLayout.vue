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
    </UFooter>
  </div>
</template>
