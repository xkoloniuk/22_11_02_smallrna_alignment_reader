import { createStore } from "vuex";

export default createStore({
  state: {
    fastaProcessedFiles: [],
    fastaSelectedFilesCount: 0,
    readsDatasets: []
  },
  getters: {},
  mutations: {
    addEntry(state, payload) {
      state.fastaProcessedFiles.push(payload);
    },
      setFastaSelectedFilesCount (state, payload){
      state.fastaSelectedFilesCount = payload
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
