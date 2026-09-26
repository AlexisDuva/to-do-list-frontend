import { createRouter, createWebHistory } from 'vue-router'
import TaskListView from '../views/TaskListView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import TagsView from '../views/TagsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'tasks', component: TaskListView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/tags', name: 'tags', component: TagsView },
  ],
})

export default router
