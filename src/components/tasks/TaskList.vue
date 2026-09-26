<script setup lang="ts">
import type { Task } from '../../types/task'
import TaskItem from './TaskItem.vue'

defineProps<{ tasks: Task[] }>()
defineEmits<{ edit: [task: Task]; delete: [task: Task] }>()
</script>

<template>
  <p v-if="tasks.length === 0" class="text-gray-500">No tasks yet.</p>
  <ul v-else class="flex flex-col gap-3">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @edit="$emit('edit', task)"
      @delete="$emit('delete', task)"
    />
  </ul>
</template>
