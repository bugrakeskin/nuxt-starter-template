<script setup lang="ts">
const config = useRuntimeConfig()

const features = [
  {
    icon: 'i-lucide-laptop',
    title: 'Native local development',
    description: 'Source, Node and pnpm run on the local development machine; deployment remains a separate Coolify workflow.'
  },
  {
    icon: 'i-lucide-settings-2',
    title: 'Explicit runtime configuration',
    description: 'Public configuration follows Nuxt runtimeConfig naming and can be supplied independently by each environment.'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Verifiable application health',
    description: 'The application exposes a deterministic health contract used by both local development and deployment checks.'
  }
]
</script>

<template>
  <div>
    <UPageHero
      :title="config.public.appName"
      description="A clean Nuxt 4 and Nuxt UI foundation ready for customer-specific application work."
      :links="[{
        label: 'Check application health',
        to: '/api/health',
        target: '_blank',
        trailingIcon: 'i-lucide-arrow-up-right',
        size: 'xl'
      }, {
        label: 'Open theme',
        to: '/theme',
        icon: 'i-lucide-palette',
        color: 'neutral',
        variant: 'outline',
        size: 'xl'
      }]"
    />

    <UPageSection
      id="foundation"
      title="A small, controlled foundation"
      description="Only verified starter capabilities live here. Supabase and authentication are added through the next contract slice."
      :features="features"
    />
  </div>
</template>
