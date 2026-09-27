<script setup lang="ts">
import { onMounted } from 'vue'
import { useTagsStore } from '../stores/tags'
import TagManager from '../components/tags/TagManager.vue'

const tagsStore = useTagsStore()

onMounted(() => {
  tagsStore.loadAll()
})
</script>

<template>
  <h1 class="text-2xl font-bold">Tags</h1>
  <TagManager class="mt-4" />
</template>
