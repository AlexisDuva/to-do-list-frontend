import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchTags, createTag, updateTag, deleteTag } from '../api/tags'
import type { Tag, TagPayload } from '../types/tag'
import { ApiError } from '../types/api'
import { useTasksStore } from './tasks'

export const useTagsStore = defineStore('tags', () => {
  const items = ref<Tag[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadAll() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await fetchTags()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Failed to load tags'
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: TagPayload) {
    await createTag(payload)
    await loadAll()
  }

  async function rename(id: number, payload: TagPayload) {
    await updateTag(id, payload)
    await loadAll()
  }

  async function remove(id: number) {
    await deleteTag(id)
    await loadAll()
    await useTasksStore().loadTasks()
  }

  return { items, isLoading, error, loadAll, create, rename, remove }
})
