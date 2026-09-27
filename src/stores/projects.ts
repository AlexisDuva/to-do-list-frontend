import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects'
import type { Project, ProjectPayload } from '../types/project'
import { ApiError } from '../types/api'
import { useTasksStore } from './tasks'

export const useProjectsStore = defineStore('projects', () => {
  const items = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await fetchProjects()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Failed to load projects'
    } finally {
      isLoading.value = false
    }
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

  async function create(payload: ProjectPayload) {
    await withMutationErrorHandling(async () => {
      await createProject(payload)
      await loadAll()
    }, 'Failed to create project')
  }

  async function rename(id: number, payload: ProjectPayload) {
    await withMutationErrorHandling(async () => {
      await updateProject(id, payload)
      await loadAll()
    }, 'Failed to rename project')
  }

  async function remove(id: number) {
    await withMutationErrorHandling(async () => {
      await deleteProject(id)
      await loadAll()
      await useTasksStore().loadTasks()
    }, 'Failed to delete project')
  }

  return { items, isLoading, error, loadAll, create, rename, remove }
})
