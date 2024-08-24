import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let store = {
    state: {
        scroll_tops: {},
        sidebar: {
            general: 1,
            sub: null,
            detail: null,
        },
        client: location.href.includes("origin") ? "origin" : "std",
        role: "",
        achievements: [],
        generalTotal: 0,
        armorTotal: 0,
        onlyUncompleted: false,
        achievementsVirtual: [],
        viewAchievementsName: null,
    },
    mutations: {
        SET_STATE: (state, { key, value, isSession = false }) => {
            state[key] = value;
            if (isSession) {
                sessionStorage.setItem(key, value);
            }
        },
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
