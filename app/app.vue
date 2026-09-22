<script setup lang="ts">
const config = useRuntimeConfig()
const description = 'A controlled Nuxt foundation for Unfogy customer applications.'

useThemePreset()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: config.public.appName,
  description,
  ogTitle: config.public.appName,
  ogDescription: description,
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
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
        <UBadge
          label="Starter"
          color="neutral"
          variant="subtle"
        />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ config.public.appName }} · Nuxt 4 + Nuxt UI
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
