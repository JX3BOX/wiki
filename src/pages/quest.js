import router from "@/router/quest";
import store from "@/store/quest";
import App from "@/views/base.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
