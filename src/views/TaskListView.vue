<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useProjectsStore } from '../stores/projects'
import { useTagsStore } from '../stores/tags'
import TaskList from '../components/tasks/TaskList.vue'
import TaskForm from '../components/tasks/TaskForm.vue'
import FilterBar from '../components/tasks/FilterBar.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import type { Task, TaskPayload } from '../types/task'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const tagsStore = useTagsStore()

onMounted(() => {
  tasksStore.loadTasks()
  projectsStore.loadAll()
  tagsStore.loadAll()
})

const editingTask = ref<Task | null>(null)
const isFormOpen = ref(false)
const deletingTask = ref<Task | null>(null)

function openCreateForm() {
  editingTask.value = null
  isFormOpen.value = true
}

function openEditForm(task: Task) {
  editingTask.value = task
  isFormOpen.value = true
}

async function handleSubmit(payload: TaskPayload) {
  if (editingTask.value) {
    await tasksStore.editTask(editingTask.value.id, payload)
  } else {
    await tasksStore.addTask(payload)
  }
  isFormOpen.value = false
}

async function handleDeleteConfirm() {
  if (deletingTask.value) {
    await tasksStore.removeTask(deletingTask.value.id)
  }
  deletingTask.value = null
}
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Tasks</h1>
    <button
      class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
      @click="openCreateForm"
    >
      Add task
    </button>
  </div>

  <FilterBar class="mt-4" @change="tasksStore.setFilters" />

  <p v-if="tasksStore.isLoading" class="mt-4 text-gray-500">Loading...</p>
  <p v-else-if="tasksStore.error" class="mt-4 text-red-600">{{ tasksStore.error }}</p>
  <TaskList
    v-else
    class="mt-4"
    :tasks="tasksStore.tasks"
    @edit="openEditForm"
    @delete="(task) => (deletingTask = task)"
    @toggle-complete="tasksStore.toggleComplete"
  />

  <TaskForm
    v-if="isFormOpen"
    :task="editingTask"
    @submit="handleSubmit"
    @cancel="isFormOpen = false"
  />

  <ConfirmDialog
    v-if="deletingTask"
    :message="`Delete task '${deletingTask.title}'?`"
    @confirm="handleDeleteConfirm"
    @cancel="deletingTask = null"
  />
</template>
