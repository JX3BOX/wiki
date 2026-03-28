import { createStore } from "vuex";

const store = {
    state: {
        client: location.href.includes("origin") ? "origin" : "std",
        onlyNotCompleted: false,
        currentRole: "",
        completedQuests: [],
    },
    mutations: {
        SET_STATE(state, payload) {
            Object.assign(state, payload);
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

export default createStore(store);
