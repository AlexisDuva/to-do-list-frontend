export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  completed: boolean
  overdue: boolean
  createdAt: string
  projectId: number | null
  tagIds: number[]
}

export interface TaskPayload {
  title: string
  description?: string
  dueDate?: string
  priority?: Priority
  projectId?: number | null
  tagIds?: number[]
}

export type TaskStatus = 'completed' | 'incomplete'
export type SortBy = 'dueDate' | 'priority' | 'createdAt'
export type SortDir = 'asc' | 'desc'

export interface TaskFilters {
  status?: TaskStatus
  projectId?: number
  tagId?: number
  priority?: Priority
  search?: string
  sortBy?: SortBy
  sortDir?: SortDir
}
