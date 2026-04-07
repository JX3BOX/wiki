import router from "@/router/item";
import store from "@/store/item";
import App from "@/App.vue";
import { bootstrapApp } from "@/utils/bootstrap";

bootstrapApp(App, { router, store }).mount("#app");
