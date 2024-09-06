import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = {
    state: {
        client: location.href.includes("origin") ? "origin" : "std",

        onlyNotCompleted: false, // 是否只显示未完成的任务
        currentRole: "",
        completedQuests: [],
    },
    mutations: {
        SET_STATE(state, payload) {
            state = Object.assign(state, payload);
        },
        SET_ROLE(state, role) {
            state.currentRole = role;
        },
        ADD_COMPLETED_QUEST(state, quest) {
            if (!state.completedQuests.includes(quest)) {
                state.completedQuests.push(quest);
            }
        },
        REMOVE_COMPLETED_QUEST(state, quest) {
            const index = state.completedQuests.indexOf(quest);
            if (index > -1) {
                state.completedQuests.splice(index, 1);
            }
        },
        SET_COMPLETED_QUESTS(state, quests) {
            state.completedQuests = quests;
        },
    },
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
