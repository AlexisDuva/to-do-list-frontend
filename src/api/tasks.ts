import apiClient from './client'
import type { Task, TaskPayload, TaskFilters } from '../types/task'

export function fetchTasks(filters: TaskFilters = {}) {
  return apiClient.get<Task[]>('/tasks', { params: filters }).then((r) => r.data)
}

export function fetchTask(id: number) {
  return apiClient.get<Task>(`/tasks/${id}`).then((r) => r.data)
}

export function createTask(payload: TaskPayload) {
  return apiClient.post<Task>('/tasks', payload).then((r) => r.data)
}

export function updateTask(id: number, payload: TaskPayload) {
  return apiClient.put<Task>(`/tasks/${id}`, payload).then((r) => r.data)
}

export function completeTask(id: number) {
  return apiClient.patch<Task>(`/tasks/${id}/complete`).then((r) => r.data)
}

export function incompleteTask(id: number) {
  return apiClient.patch<Task>(`/tasks/${id}/incomplete`).then((r) => r.data)
}

export function deleteTask(id: number) {
  return apiClient.delete(`/tasks/${id}`)
}
