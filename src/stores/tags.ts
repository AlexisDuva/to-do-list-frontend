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

  async function withMutationErrorHandling(action: () => Promise<void>, fallbackMessage: string) {
    error.value = null
    try {
      await action()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : fallbackMessage
      throw e
    }
  }

  async function create(payload: TagPayload) {
    await withMutationErrorHandling(async () => {
      await createTag(payload)
      await loadAll()
    }, 'Failed to create tag')
  }

  async function rename(id: number, payload: TagPayload) {
    await withMutationErrorHandling(async () => {
      await updateTag(id, payload)
      await loadAll()
    }, 'Failed to rename tag')
  }

  async function remove(id: number) {
    await withMutationErrorHandling(async () => {
      await deleteTag(id)
      await loadAll()
      await useTasksStore().loadTasks()
    }, 'Failed to delete tag')
  }

  return { items, isLoading, error, loadAll, create, rename, remove }
})
