<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../common/Modal.vue'
import type { Task, TaskPayload, Priority } from '../../types/task'
import { useProjectsStore } from '../../stores/projects'
import { useTagsStore } from '../../stores/tags'

const props = defineProps<{ task: Task | null }>()
const emit = defineEmits<{ submit: [payload: TaskPayload]; cancel: [] }>()

const projectsStore = useProjectsStore()
const tagsStore = useTagsStore()

const title = ref(props.task?.title ?? '')
const description = ref(props.task?.description ?? '')
const dueDate = ref(props.task?.dueDate ?? '')
const priority = ref<Priority>(props.task?.priority ?? 'MEDIUM')
const projectId = ref<number | null>(props.task?.projectId ?? null)
const tagIds = ref<number[]>(props.task?.tagIds ?? [])
const titleError = ref<string | null>(null)

function toggleTag(id: number) {
  const index = tagIds.value.indexOf(id)
  if (index === -1) {
    tagIds.value.push(id)
  } else {
    tagIds.value.splice(index, 1)
  }
}

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
    projectId: projectId.value,
    tagIds: tagIds.value,
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

      <div>
        <label class="mb-1 block text-sm font-medium">Project</label>
        <select v-model="projectId" class="w-full rounded border border-gray-300 px-2 py-1">
          <option :value="null">None</option>
          <option v-for="project in projectsStore.items" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div v-if="tagsStore.items.length">
        <label class="mb-1 block text-sm font-medium">Tags</label>
        <div class="flex flex-wrap gap-3">
          <label v-for="tag in tagsStore.items" :key="tag.id" class="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              :checked="tagIds.includes(tag.id)"
              @change="toggleTag(tag.id)"
            />
            {{ tag.name }}
          </label>
        </div>
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
