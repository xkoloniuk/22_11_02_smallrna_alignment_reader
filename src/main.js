import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'devextreme/dist/css/dx.light.css';

createApp(App).use(store).use(router).mount('#app')
