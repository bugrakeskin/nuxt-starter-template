<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const config = useRuntimeConfig()
const client = useSupabaseClient()
const user = useSupabaseUser()

useThemePreset()

async function signOut() {
  await client.auth.signOut()
  await navigateTo('/login')
}
</script>

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
        <UBadge
          label="Starter"
          color="neutral"
          variant="subtle"
        />
        <UButton
          v-if="user"
          label="Sign out"
          color="neutral"
          variant="ghost"
          @click="signOut"
        />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="flex-1">
      <slot />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ config.public.appName }} · Nuxt 4 + Nuxt UI
        </p>
      </template>
    </UFooter>
  </div>
</template>
