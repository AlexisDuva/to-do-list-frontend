import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import type { Task, TaskPayload } from '../types/task'
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

  async function addTask(payload: TaskPayload) {
    await createTask(payload)
    await loadTasks()
  }

  async function editTask(id: number, payload: TaskPayload) {
    await updateTask(id, payload)
    await loadTasks()
  }

  async function removeTask(id: number) {
    await deleteTask(id)
    await loadTasks()
  }

  return { tasks, isLoading, error, loadTasks, addTask, editTask, removeTask }
})
