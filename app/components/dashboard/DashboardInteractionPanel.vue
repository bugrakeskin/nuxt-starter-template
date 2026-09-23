<script setup lang="ts">
const title = ref('New review note')
const saved = ref(false)
const modalOpen = ref(false)

function saveNote() {
  saved.value = true
  modalOpen.value = false
}
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-medium text-highlighted">
        Local interactions
      </p>
      <p class="text-sm text-muted">
        Form, modal and disabled states without a backend mutation.
      </p>
    </template>
    <div class="flex flex-wrap gap-2">
      <UButton
        label="Open note form"
        icon="i-lucide-plus"
        @click="modalOpen = true"
      />
      <UButton
        label="Disabled action"
        color="neutral"
        variant="outline"
        disabled
      />
      <UBadge
        v-if="saved"
        label="Saved locally"
        color="success"
        variant="subtle"
      />
    </div>
    <UModal
      v-model:open="modalOpen"
      title="Add review note"
    >
      <template #body>
        <UFormField label="Note">
          <UInput
            v-model="title"
            class="w-full"
          />
        </UFormField>
      </template>
      <template #footer>
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="modalOpen = false"
        />
        <UButton
          label="Save locally"
          @click="saveNote"
        />
      </template>
    </UModal>
  </UCard>
</template>
