<template>

  <div class="container">
    <h1 v-show="!readsDatasets.length">Upload small RNA dataset in FASTA format</h1>
    <div @click="showStore" >show processed fasta data</div>
    <input
      v-if="!readsDatasets.length"
      ref="readsDatasetLoader"
      type="file"
      accept=".fasta"
      multiple
      @change="showFiles"
    />
    <div v-else class="file-list">
      <div class="header"> {{ 'Recieved data: ' + readsDatasets.length +' files' }} </div>
      <div v-show="!loaded">File is loading, wait a moment...</div>

      <div v-show="loading" class="table-container"> 
        <table class="table-mapped-overview">
          <thead>
            <tr>
              <th>
                Dataset
              </th>
              <th class="number-view">
                Reads, total
              </th>
              <th class="number-view">
                Nonredundant, %
              </th>

              <th>
                Barplot
                <div class="barplot-bar" :style="{width: '200px', background: 'darkorange', 'font-size': '0.75rem', 'text-align': 'right'}" :ref="index+'_cnt'">Scale: 10,000,000 reads</div>

              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(file, index) in readsDatasets"
              :key="'file' + index">  
              <td>
                 {{ file.seqDetails.dataset }}
              </td>
              <td class="number-view">
                 {{ largeNumber(file.seqDetails.totalCount) }}
              </td>

              <td class="number-view">
                 {{ file.seqDetails.nonRedundantPerc }}
              </td>
              <td >
                <div class="barplot-bar" :style="{width: file.seqDetails.totalCount / 50000 + 'px' }" :ref="index + '_cnt'"></div>
                
              </td>
            </tr>
          </tbody>
        </table>
    </div>
      
    </div>
      
    </div>

</template>

<script>
import store from "@/store/index";
import processFastaReads from "@/utils/processFastaReads.js";


export default {
  name: "DatasetView",

  data (){
    return{
      loading: false,
      loaded:false,
      files: []
    }
  },
  methods: {
    showStore (){
      console.log(store.state.readsDatasets)
      // console.log(this.files)
    },
    fixedNumber (n) {
      return n.toFixed(1)
    },
    largeNumber (n) {
      return n.toLocaleString()
    },
    showFiles() {
      for (const file of this.$refs.readsDatasetLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            const nameAndSeq = {name: file.name, seqDetails: processFastaReads(data, file.name)}
            store.commit("addReadsDataset", nameAndSeq);
            this.loading = true;
          })
          .catch((e) => console.error(e));
        }
        this.loaded = true;
    },
    commonBetweenTwo(a,b){
      return a + b
    },
  },
  computed: {
    readsDatasets() {
         return store.state.readsDatasets;
    },
  },
};
</script>

<style lang="stylus" scoped>
h1
    padding 1rem

.header
  width 25%
  font-size 1.5rem
  font-weight bold
  margin 0 auto
  background limegreen
  padding 1rem
  border-radius 5px

.container
    width 100%
    margin 40px auto 0
input::file-selector-button
    padding 0.5rem
    font-size 1rem
    color blue
    border-radius 5px
button
    display block
    margin 10px auto
    padding 10px
    font-size 1rem

.table-container
  max-width: 70%
  margin 2rem auto
  text-align: left

.table-mapped-overview
    background: lightblue
    width 100%
  &th,td
    padding 0.5rem

.barplot-bar
  background: gray
  height: 20px
.number-view
  text-align: right
  padding-right 1rem

.exclude-btn
    background lighten(red, 20%)
    border-radius: 5px
    padding 0.25rem 0.8rem
    align-self: start
    // flex-shrink: 5
    &:hover
        filter: drop-shadow(1px 1px 10px grey)
        filter: invert(100%)
.run-title
    align-self: start
.run-item
    display flex
    align-items: center
    justify-content space-between
.targets
    width 60%
    display inline-flex
    gap 5px
    flex-wrap: wrap
.target
    border: 2px solid
    border-radius: 5px
    padding 0.2rem 0.5rem
    background: white
</style>
