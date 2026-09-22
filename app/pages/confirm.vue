<script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, (currentUser) => {
  if (!currentUser) return
  void navigateTo(safeReturnTarget(redirectInfo.pluck()))
}, { immediate: true })

useSeoMeta({ title: 'Confirming sign in' })
</script>

<template>
  <UContainer class="flex min-h-[70vh] items-center justify-center py-12">
    <UCard class="w-full max-w-md text-center">
      <UIcon
        name="i-lucide-loader-circle"
        class="mx-auto size-8 animate-spin text-primary"
      />
      <h1 class="mt-4 text-xl font-semibold text-highlighted">
        Confirming your sign-in
      </h1>
      <p class="mt-2 text-sm text-muted">
        You will be redirected when the session is ready.
      </p>
    </UCard>
  </UContainer>
</template>
