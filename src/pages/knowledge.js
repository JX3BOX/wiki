import router from "@/router/knowledge";
import store from "@/store";
import App from "@/views/base.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
