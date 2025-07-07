import { createApp } from "vue";
import "./style.css";
import "./main.css";
import App from "./App.vue";
import router from "./router";
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'


createApp(App).use(router).mount("#app");
