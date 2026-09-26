import apiClient from './client'
import type { Tag, TagPayload } from '../types/tag'

export function fetchTags() {
  return apiClient.get<Tag[]>('/tags').then((r) => r.data)
}

export function createTag(payload: TagPayload) {
  return apiClient.post<Tag>('/tags', payload).then((r) => r.data)
}

export function updateTag(id: number, payload: TagPayload) {
  return apiClient.put<Tag>(`/tags/${id}`, payload).then((r) => r.data)
}

export function deleteTag(id: number) {
  return apiClient.delete(`/tags/${id}`)
}
