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

  <p v-if="tagsStore.isLoading" class="mt-4 text-gray-500">Loading...</p>
  <template v-else>
    <p v-if="tagsStore.error" class="mt-4 text-red-600">{{ tagsStore.error }}</p>
    <TagManager class="mt-4" />
  </template>
</template>
