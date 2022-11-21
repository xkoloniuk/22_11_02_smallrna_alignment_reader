import { createStore } from "vuex";

export default createStore({
  state: {
    fastaProcessedFiles: [],
    readsDatasets: []
  },
  getters: {},
  mutations: {
    addEntry(state, payload) {
      state.fastaProcessedFiles.push(payload);
    },
    addReadsDataset(state, payload) {
      state.readsDatasets.push(payload);
    },
    removeEntry(state, index) {
      state.fastaProcessedFiles.splice(index, 1);
    },
    resetFiles(state) {
      state.fastaProcessedFiles = [];
    },
  },
  actions: {},
  modules: {},
});
