<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../common/Modal.vue'
import type { Task, TaskPayload, Priority } from '../../types/task'

const props = defineProps<{ task: Task | null }>()
const emit = defineEmits<{ submit: [payload: TaskPayload]; cancel: [] }>()

const title = ref(props.task?.title ?? '')
const description = ref(props.task?.description ?? '')
const dueDate = ref(props.task?.dueDate ?? '')
const priority = ref<Priority>(props.task?.priority ?? 'MEDIUM')
const titleError = ref<string | null>(null)

function handleSubmit() {
  if (!title.value.trim()) {
    titleError.value = 'Title is required'
    return
  }
  titleError.value = null

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    dueDate: dueDate.value || undefined,
    priority: priority.value,
  })
}
</script>

<template>
  <Modal @close="emit('cancel')">
    <h2 class="mb-4 text-lg font-semibold">{{ task ? 'Edit task' : 'Add task' }}</h2>

    <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium">Title</label>
        <input v-model="title" type="text" class="w-full rounded border border-gray-300 px-2 py-1" />
        <p v-if="titleError" class="mt-1 text-sm text-red-600">{{ titleError }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Description</label>
        <textarea v-model="description" class="w-full rounded border border-gray-300 px-2 py-1" rows="3" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Due date</label>
        <input v-model="dueDate" type="date" class="w-full rounded border border-gray-300 px-2 py-1" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Priority</label>
        <select v-model="priority" class="w-full rounded border border-gray-300 px-2 py-1">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div class="mt-2 flex justify-end gap-2">
        <button type="button" class="rounded px-3 py-1.5 text-sm hover:bg-gray-100" @click="emit('cancel')">
          Cancel
        </button>
        <button type="submit" class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  </Modal>
</template>
