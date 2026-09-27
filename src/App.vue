<script setup lang="ts"></script>

<template>
  <nav class="flex gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
    <RouterLink to="/" class="hover:underline">Tasks</RouterLink>
    <RouterLink to="/projects" class="hover:underline">Projects</RouterLink>
    <RouterLink to="/tags" class="hover:underline">Tags</RouterLink>
  </nav>
  <main class="p-6">
    <RouterView />
  </main>
</template>
