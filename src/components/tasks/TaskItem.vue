<script setup lang="ts">
import type { Task } from '../../types/task'

defineProps<{ task: Task }>()
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
  </li>
</template>
