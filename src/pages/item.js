import router from "@/router/item";
import store from "@/store/item";
import App from "@/views/base.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
