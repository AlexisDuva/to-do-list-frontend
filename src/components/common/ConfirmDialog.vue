<script setup lang="ts">
import Modal from './Modal.vue'

defineProps<{ message: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Modal @close="emit('cancel')">
    <p class="mb-4">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <button class="rounded px-3 py-1.5 text-sm hover:bg-gray-100" @click="emit('cancel')">
        Cancel
      </button>
      <button
        class="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        @click="emit('confirm')"
      >
        Delete
      </button>
    </div>
  </Modal>
</template>
