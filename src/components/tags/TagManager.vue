<script setup lang="ts">
import { ref } from 'vue'
import { useTagsStore } from '../../stores/tags'
import ConfirmDialog from '../common/ConfirmDialog.vue'
import type { Tag } from '../../types/tag'

const tagsStore = useTagsStore()

const newName = ref('')
const newNameError = ref<string | null>(null)
const editingId = ref<number | null>(null)
const editingName = ref('')
const deletingTag = ref<Tag | null>(null)

async function handleCreate() {
  if (!newName.value.trim()) {
    newNameError.value = 'Name is required'
    return
  }
  newNameError.value = null
  await tagsStore.create({ name: newName.value.trim() })
  newName.value = ''
}

function startEdit(tag: Tag) {
  editingId.value = tag.id
  editingName.value = tag.name
}

async function saveEdit() {
  if (editingId.value === null || !editingName.value.trim()) return
  await tagsStore.rename(editingId.value, { name: editingName.value.trim() })
  editingId.value = null
}

async function handleDeleteConfirm() {
  if (deletingTag.value) {
    await tagsStore.remove(deletingTag.value.id)
  }
  deletingTag.value = null
}
</script>

<template>
  <form class="flex flex-col gap-1" @submit.prevent="handleCreate">
    <div class="flex gap-2">
      <input
        v-model="newName"
        type="text"
        placeholder="New tag name"
        class="flex-1 rounded border border-gray-300 px-2 py-1"
      />
      <button type="submit" class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
        Add
      </button>
    </div>
    <p v-if="newNameError" class="text-sm text-red-600">{{ newNameError }}</p>
  </form>

  <p v-if="tagsStore.items.length === 0" class="mt-4 text-gray-500">No tags yet.</p>
  <ul v-else class="mt-4 flex flex-col gap-2">
    <li
      v-for="tag in tagsStore.items"
      :key="tag.id"
      class="flex items-center justify-between rounded border border-gray-200 p-3"
    >
      <template v-if="editingId === tag.id">
        <input v-model="editingName" type="text" class="flex-1 rounded border border-gray-300 px-2 py-1" />
        <div class="ml-2 flex gap-2 text-sm">
          <button class="text-blue-600 hover:underline" @click="saveEdit">Save</button>
          <button class="text-gray-500 hover:underline" @click="editingId = null">Cancel</button>
        </div>
      </template>
      <template v-else>
        <span>{{ tag.name }}</span>
        <div class="flex gap-2 text-sm">
          <button class="text-blue-600 hover:underline" @click="startEdit(tag)">Rename</button>
          <button class="text-red-600 hover:underline" @click="deletingTag = tag">Delete</button>
        </div>
      </template>
    </li>
  </ul>

  <ConfirmDialog
    v-if="deletingTag"
    :message="`Delete tag '${deletingTag.name}'? It will be removed from any tasks that had it.`"
    @confirm="handleDeleteConfirm"
    @cancel="deletingTag = null"
  />
</template>
