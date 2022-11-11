import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ComparisonsView from "@/views/ComparisonsView.vue";
import DatasetView from "@/views/DatasetView.vue";


const routes = [
  {
    path: "/",
    name: "index",
    component: IndexView,
  },
  {
    path: "/comparisons",
    name: "comparisons",
    component: ComparisonsView,
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
