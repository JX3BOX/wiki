import router from "@/router/cj";
import store from "@/store/cj";
import App from "@/App.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
