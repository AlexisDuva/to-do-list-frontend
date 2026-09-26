import apiClient from './client'
import type { Project, ProjectPayload } from '../types/project'

export function fetchProjects() {
  return apiClient.get<Project[]>('/projects').then((r) => r.data)
}

export function createProject(payload: ProjectPayload) {
  return apiClient.post<Project>('/projects', payload).then((r) => r.data)
}

export function updateProject(id: number, payload: ProjectPayload) {
  return apiClient.put<Project>(`/projects/${id}`, payload).then((r) => r.data)
}

export function deleteProject(id: number) {
  return apiClient.delete(`/projects/${id}`)
}
