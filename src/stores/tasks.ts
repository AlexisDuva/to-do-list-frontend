import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchTasks } from '../api/tasks'
import type { Task } from '../types/task'
import { ApiError } from '../types/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadTasks() {
    isLoading.value = true
    error.value = null
    try {
      tasks.value = await fetchTasks()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Failed to load tasks'
    } finally {
      isLoading.value = false
    }
  }

  return { tasks, isLoading, error, loadTasks }
})
