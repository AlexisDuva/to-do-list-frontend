<script setup lang="ts">
import type { Task } from '../../types/task'

defineProps<{ task: Task }>()
defineEmits<{ edit: []; delete: [] }>()
</script>

<template>
  <li class="rounded border border-gray-200 p-4">
    <div class="flex items-baseline justify-between gap-2">
      <h3 class="font-semibold">{{ task.title }}</h3>
      <span class="text-xs uppercase text-gray-500">{{ task.priority }}</span>
    </div>
    <p v-if="task.description" class="mt-1 text-sm text-gray-600">{{ task.description }}</p>
    <div class="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
      <span v-if="task.dueDate">Due {{ task.dueDate }}</span>
      <span v-if="task.projectId !== null">Project #{{ task.projectId }}</span>
      <span v-if="task.tagIds.length">Tags: {{ task.tagIds.join(', ') }}</span>
    </div>
    <div class="mt-3 flex gap-2 text-sm">
      <button class="text-blue-600 hover:underline" @click="$emit('edit')">Edit</button>
      <button class="text-red-600 hover:underline" @click="$emit('delete')">Delete</button>
    </div>
  </li>
</template>
