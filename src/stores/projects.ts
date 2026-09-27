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

  async function create(payload: ProjectPayload) {
    await createProject(payload)
    await loadAll()
  }

  async function rename(id: number, payload: ProjectPayload) {
    await updateProject(id, payload)
    await loadAll()
  }

  async function remove(id: number) {
    await deleteProject(id)
    await loadAll()
    await useTasksStore().loadTasks()
  }

  return { items, isLoading, error, loadAll, create, rename, remove }
})
