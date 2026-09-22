<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

async function finishSignIn() {
  await navigateTo(safeReturnTarget(redirectInfo.pluck()))
}

async function signInWithPassword() {
  busy.value = true
  message.value = ''
  errorMessage.value = ''

  const { error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  busy.value = false
  if (error) {
    errorMessage.value = error.message
    return
  }

  await finishSignIn()
}

async function sendMagicLink() {
  busy.value = true
  message.value = ''
  errorMessage.value = ''

  const { error } = await client.auth.signInWithOtp({
    email: email.value,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/confirm`
    }
  })

  busy.value = false
  if (error) {
    errorMessage.value = error.message
    return
  }

  message.value = 'Check your email for the secure sign-in link.'
}

watch(user, (currentUser) => {
  if (currentUser) void finishSignIn()
}, { immediate: true })

useSeoMeta({ title: 'Sign in' })
</script>

<template>
  <UContainer class="flex min-h-[70vh] items-center justify-center py-12">
    <UCard class="w-full max-w-md">
      <template #header>
        <div>
          <h1 class="text-xl font-semibold text-highlighted">
            Sign in
          </h1>
          <p class="mt-1 text-sm text-muted">
            Use an account invited to this application.
          </p>
        </div>
      </template>

      <form
        class="grid gap-4"
        @submit.prevent="signInWithPassword"
      >
        <UFormField
          label="Email"
          required
        >
          <UInput
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          required
        >
          <UInput
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="errorMessage"
          color="error"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />
        <UAlert
          v-if="message"
          color="success"
          icon="i-lucide-mail-check"
          :description="message"
        />

        <UButton
          type="submit"
          label="Sign in"
          block
          :loading="busy"
        />
        <UButton
          type="button"
          label="Email a magic link"
          color="neutral"
          variant="outline"
          block
          :loading="busy"
          :disabled="!email"
          @click="sendMagicLink"
        />
      </form>
    </UCard>
  </UContainer>
</template>
