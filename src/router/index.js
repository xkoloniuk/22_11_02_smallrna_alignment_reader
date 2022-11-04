import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ComparisonsView from "@/views/ComparisonsView.vue";


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

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
