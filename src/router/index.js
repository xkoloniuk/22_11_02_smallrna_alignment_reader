import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import DatasetView from "@/views/DatasetView.vue";


const routes = [
  {
    path: "/",
    name: "index",
    component: IndexView,
  },
  {
    path: "/reads-datasets",
    name: "readsdatasets",
    component: DatasetView,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
