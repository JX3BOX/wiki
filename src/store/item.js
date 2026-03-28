import { createStore } from "vuex";

const store = {
    state: {
        sidebar: {
            AucGenre: null,
            AucSubTypeID: null,
        },
        my_item_plans: null,
        client: location.href.includes("origin") ? "origin" : "std",
        myFavorites: [],
        favChangeFlag: 0,
    },
    mutations: {
        SET_STATE: (state, { key, value }) => {
            state[key] = value;
        },
    },
    getters: {},
    modules: {},
};

export default createStore(store);
