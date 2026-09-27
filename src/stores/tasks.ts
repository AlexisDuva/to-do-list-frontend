import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  incompleteTask,
} from '../api/tasks'
import type { Task, TaskPayload, TaskFilters } from '../types/task'
import { ApiError } from '../types/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const filters = ref<TaskFilters>({ sortBy: 'dueDate', sortDir: 'asc' })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadTasks() {
    isLoading.value = true
    error.value = null
    try {
      tasks.value = await fetchTasks(filters.value)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Failed to load tasks'
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(partial: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ...partial }
    loadTasks()
  }

  async function withMutationErrorHandling(action: () => Promise<void>, fallbackMessage: string) {
    error.value = null
    try {
      await action()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : fallbackMessage
      throw e
    }
  }

  async function addTask(payload: TaskPayload) {
    await withMutationErrorHandling(async () => {
      await createTask(payload)
      await loadTasks()
    }, 'Failed to create task')
  }

  async function editTask(id: number, payload: TaskPayload) {
    await withMutationErrorHandling(async () => {
      await updateTask(id, payload)
      await loadTasks()
    }, 'Failed to update task')
  }

  async function removeTask(id: number) {
    await withMutationErrorHandling(async () => {
      await deleteTask(id)
      await loadTasks()
    }, 'Failed to delete task')
  }

  async function toggleComplete(task: Task) {
    await withMutationErrorHandling(async () => {
      if (task.completed) {
        await incompleteTask(task.id)
      } else {
        await completeTask(task.id)
      }
      await loadTasks()
    }, 'Failed to update task')
  }

  return {
    tasks,
    filters,
    isLoading,
    error,
    loadTasks,
    setFilters,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
  }
})
