<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex min-h-screen flex-col">
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          aria-label="Home"
          class="rounded-md outline-primary/25 focus-visible:outline-3"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="flex flex-1 items-center">
      <slot />
    </UMain>
  </div>
</template>
