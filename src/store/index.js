import { createStore } from "vuex";

export default createStore({
  state: {
    processedFiles: [],
    readsDatasets: [],
    loading: true,
  },
  getters: {},
  mutations: {
    addEntry(state, payload) {
      state.processedFiles.push(payload);
      console.log(payload);

      if (state.processedFiles.length === payload.filesCount) {
        console.log("all obtained");

        state.processedFiles.forEach((file) => {
          const currentDataset = file.seqDetails.dataset;
          const currentVirus = file.seqDetails.virus;
          const currentRef = file.seqDetails.ref.seqName;
          const otherVariantsFromTheSameDataset =
            state.processedFiles.filter(
              (file) =>
                file.seqDetails.dataset === currentDataset &&
                file.seqDetails.virus === currentVirus &&
                file.seqDetails.ref.seqName !== currentRef
            );

          const otherSeqs = new Set(
            otherVariantsFromTheSameDataset
              .map((file) => file.seqDetails.reads.map((read) => read.seq))
              .flat()
          );


          const setOfVariantSpecific = new Set();

          file.seqDetails.reads.map((read) => {
            read.variantSpecific = !otherSeqs.has(read.seq);

            if(read.variantSpecific) {
              read.variantSpecificUnique = !setOfVariantSpecific.has(read.seq);
              setOfVariantSpecific.add(read.seq)
            }
            
          });
        });
        console.log(state.processedFiles);

        state.loading = false;
      }
    },
    addReadsDataset(state, payload) {
      state.readsDatasets.push(payload);
    },
    removeEntry(state, index) {
      state.processedFiles.splice(index, 1);
    },
    resetFiles(state) {
      state.processedFiles = []
      state.readsDatasets = []
    },
  },
  actions: {},
  modules: {},
});
