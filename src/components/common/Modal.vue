<script setup lang="ts">
defineEmits<{ close: [] }>()
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-md rounded bg-white p-6 shadow-lg">
      <slot />
    </div>
  </div>
</template>
