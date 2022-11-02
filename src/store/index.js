import { createStore } from "vuex";

export default createStore({
  state: {
    csvProcessedFiles: [],
  },
  getters: {},
  mutations: {
    addEntry(state, payload) {
      state.csvProcessedFiles.push(payload);
    },
    removeEntry(state, index) {
      state.csvProcessedFiles.splice(index, 1);
    },
    resetFiles(state) {
      state.csvProcessedFiles = [];
    },
  },
  actions: {},
  modules: {},
});
