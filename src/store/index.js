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

      // all files should be already read
      if (state.processedFiles.length === payload.filesCount) {
        console.log("all obtained");


        state.processedFiles.sort((a,b)=>{
          if(a.seqDetails.dataset.localeCompare(b.seqDetails.dataset) > 0) {
            return 1} else if (a.seqDetails.dataset.localeCompare(b.seqDetails.dataset) < 0) {
              return -1} else {
                return (a.seqDetails.ref.seqName).localeCompare(b.seqDetails.ref.seqName)
                }
        })




        const inputReads= {
          S113_L005: 177200,
          S113_L006: 191410,
          S93_L004: 6114128,
          S103_L006: 6221896,
          S103_L005: 6265331,
          S105_L006: 6597400,
          S105_L005: 6636084,
          S99_L004: 6772412,
          S98_L004: 9901238
        }

        
        state.processedFiles.forEach((file) => {

          const currentDataset = file.seqDetails.dataset;

          // set number of initial reads as not all had 10 mil reads, those that did not were set automatically to 10 mils
          file.seqDetails.inputReads = inputReads[currentDataset] || 10000000;
          
          file.seqDetails.rpkm = 1000000000 * (file.seqDetails.reads.length / (file.seqDetails.inputReads * file.seqDetails.ref.seqLength))

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

          file.seqDetails.rpkmVariantSpecific =  1000000000 * (file.seqDetails.reads.filter(read => read.variantSpecific).length / (file.seqDetails.inputReads * file.seqDetails.ref.seqLength))

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
