<script setup lang="ts">
import { ref } from 'vue'
import type { TaskFilters, TaskStatus, Priority, SortBy, SortDir } from '../../types/task'

const emit = defineEmits<{ change: [partial: Partial<TaskFilters>] }>()

const status = ref<TaskStatus | ''>('')
const priority = ref<Priority | ''>('')
const search = ref('')
const sortBy = ref<SortBy>('dueDate')
const sortDir = ref<SortDir>('asc')

let searchTimeout: ReturnType<typeof setTimeout>

function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('change', { search: search.value || undefined })
  }, 300)
}

function onStatusChange() {
  emit('change', { status: status.value || undefined })
}

function onPriorityChange() {
  emit('change', { priority: priority.value || undefined })
}

function onSortChange() {
  emit('change', { sortBy: sortBy.value, sortDir: sortDir.value })
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <input
      v-model="search"
      type="text"
      placeholder="Search tasks..."
      class="rounded border border-gray-300 px-2 py-1 text-sm"
      @input="onSearchInput"
    />

    <select v-model="status" class="rounded border border-gray-300 px-2 py-1 text-sm" @change="onStatusChange">
      <option value="">All statuses</option>
      <option value="incomplete">Incomplete</option>
      <option value="completed">Completed</option>
    </select>

    <select v-model="priority" class="rounded border border-gray-300 px-2 py-1 text-sm" @change="onPriorityChange">
      <option value="">All priorities</option>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>

    <select v-model="sortBy" class="rounded border border-gray-300 px-2 py-1 text-sm" @change="onSortChange">
      <option value="dueDate">Due date</option>
      <option value="priority">Priority</option>
      <option value="createdAt">Created</option>
    </select>

    <select v-model="sortDir" class="rounded border border-gray-300 px-2 py-1 text-sm" @change="onSortChange">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</template>
