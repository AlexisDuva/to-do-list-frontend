<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects'
import ProjectManager from '../components/projects/ProjectManager.vue'

const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.loadAll()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Projects</h1>

  <p v-if="projectsStore.isLoading" class="mt-4 text-gray-500">Loading...</p>
  <template v-else>
    <p v-if="projectsStore.error" class="mt-4 text-red-600">{{ projectsStore.error }}</p>
    <ProjectManager class="mt-4" />
  </template>
</template>
