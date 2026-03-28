import { createStore } from "vuex";

const store = {
    state: {
        client: location.href.includes("origin") ? "origin" : "std",
    },
    mutations: {},
    actions: {},
    modules: {},
};

export default createStore(store);
