import router from "@/router/wiki";
import store from "@/store/cj";
import App from "@/views/wiki/index.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
