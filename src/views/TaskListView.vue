<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import TaskList from '../components/tasks/TaskList.vue'

const tasksStore = useTasksStore()

onMounted(() => {
  tasksStore.loadTasks()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Tasks</h1>

  <p v-if="tasksStore.isLoading" class="mt-4 text-gray-500">Loading...</p>
  <p v-else-if="tasksStore.error" class="mt-4 text-red-600">{{ tasksStore.error }}</p>
  <TaskList v-else class="mt-4" :tasks="tasksStore.tasks" />
</template>
