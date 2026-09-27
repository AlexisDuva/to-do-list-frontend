<script setup lang="ts">
import { ref } from 'vue'
import { useProjectsStore } from '../../stores/projects'
import ConfirmDialog from '../common/ConfirmDialog.vue'
import type { Project } from '../../types/project'

const projectsStore = useProjectsStore()

const newName = ref('')
const newNameError = ref<string | null>(null)
const editingId = ref<number | null>(null)
const editingName = ref('')
const deletingProject = ref<Project | null>(null)

async function handleCreate() {
  if (!newName.value.trim()) {
    newNameError.value = 'Name is required'
    return
  }
  newNameError.value = null
  try {
    await projectsStore.create({ name: newName.value.trim() })
    newName.value = ''
  } catch {
    // projectsStore.error already shows the message
  }
}

function startEdit(project: Project) {
  editingId.value = project.id
  editingName.value = project.name
}

async function saveEdit() {
  if (editingId.value === null || !editingName.value.trim()) return
  try {
    await projectsStore.rename(editingId.value, { name: editingName.value.trim() })
    editingId.value = null
  } catch {
    // keep the edit field open so the user can retry; projectsStore.error already shows the message
  }
}

async function handleDeleteConfirm() {
  if (deletingProject.value) {
    try {
      await projectsStore.remove(deletingProject.value.id)
    } catch {
      // projectsStore.error already shows the message
    }
  }
  deletingProject.value = null
}
</script>

<template>
  <div>
    <form class="flex flex-col gap-1" @submit.prevent="handleCreate">
      <div class="flex gap-2">
        <input
          v-model="newName"
          type="text"
          placeholder="New project name"
          class="flex-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button type="submit" class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
          Add
        </button>
      </div>
      <p v-if="newNameError" class="text-sm text-red-600">{{ newNameError }}</p>
    </form>

    <p v-if="projectsStore.items.length === 0" class="mt-4 text-gray-500">No projects yet.</p>
    <ul v-else class="mt-4 flex flex-col gap-2">
      <li
        v-for="project in projectsStore.items"
        :key="project.id"
        class="flex items-center justify-between rounded border border-gray-200 bg-white p-3 shadow-sm"
      >
        <template v-if="editingId === project.id">
          <input
            v-model="editingName"
            type="text"
            class="flex-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div class="ml-2 flex gap-2 text-sm">
            <button class="text-blue-600 hover:underline" @click="saveEdit">Save</button>
            <button class="text-gray-500 hover:underline" @click="editingId = null">Cancel</button>
          </div>
        </template>
        <template v-else>
          <span>{{ project.name }}</span>
          <div class="flex gap-2 text-sm">
            <button class="text-blue-600 hover:underline" @click="startEdit(project)">Rename</button>
            <button class="text-red-600 hover:underline" @click="deletingProject = project">Delete</button>
          </div>
        </template>
      </li>
    </ul>

    <ConfirmDialog
      v-if="deletingProject"
      :message="`Delete project '${deletingProject.name}'? Its tasks will be unassigned, not deleted.`"
      @confirm="handleDeleteConfirm"
      @cancel="deletingProject = null"
    />
  </div>
</template>
