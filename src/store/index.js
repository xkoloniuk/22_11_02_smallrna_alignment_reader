import { createStore } from "vuex";

export default createStore({
  state: {
    csvProcessedFiles: [],
    readsDatasets: []
  },
  getters: {},
  mutations: {
    addEntry(state, payload) {
      state.csvProcessedFiles.push(payload);
    },
    addReadsDataset(state, payload) {
      state.readsDatasets.push(payload);
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
