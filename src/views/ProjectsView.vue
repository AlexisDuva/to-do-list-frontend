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
  <ProjectManager class="mt-4" />
</template>
