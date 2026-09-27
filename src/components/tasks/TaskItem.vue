<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../../types/task'
import { useProjectsStore } from '../../stores/projects'
import { useTagsStore } from '../../stores/tags'

const props = defineProps<{ task: Task }>()
defineEmits<{ edit: []; delete: []; 'toggle-complete': [] }>()

const projectsStore = useProjectsStore()
const tagsStore = useTagsStore()

const projectName = computed(
  () => projectsStore.items.find((p) => p.id === props.task.projectId)?.name,
)
const tagNames = computed(() =>
  props.task.tagIds
    .map((id) => tagsStore.items.find((t) => t.id === id)?.name)
    .filter((name): name is string => Boolean(name)),
)
</script>

<template>
  <li class="rounded border border-gray-200 p-4">
    <div class="flex items-start gap-3">
      <input
        type="checkbox"
        class="mt-1"
        :checked="task.completed"
        @change="$emit('toggle-complete')"
      />
      <div class="flex-1">
        <div class="flex items-baseline justify-between gap-2">
          <h3 :class="['font-semibold', task.completed && 'text-gray-400 line-through']">
            {{ task.title }}
          </h3>
          <span class="text-xs uppercase text-gray-500">{{ task.priority }}</span>
        </div>
        <p
          v-if="task.description"
          :class="['mt-1 text-sm text-gray-600', task.completed && 'text-gray-400 line-through']"
        >
          {{ task.description }}
        </p>
        <div class="mt-2 flex flex-wrap gap-3 text-xs">
          <span :class="task.overdue ? 'font-bold text-red-600' : 'text-gray-500'" v-if="task.dueDate">
            Due {{ task.dueDate }}<span v-if="task.overdue"> (overdue)</span>
          </span>
          <span class="text-gray-500" v-if="projectName">Project: {{ projectName }}</span>
          <span class="text-gray-500" v-if="tagNames.length">Tags: {{ tagNames.join(', ') }}</span>
        </div>
        <div class="mt-3 flex gap-2 text-sm">
          <button class="text-blue-600 hover:underline" @click="$emit('edit')">Edit</button>
          <button class="text-red-600 hover:underline" @click="$emit('delete')">Delete</button>
        </div>
      </div>
    </div>
  </li>
</template>
