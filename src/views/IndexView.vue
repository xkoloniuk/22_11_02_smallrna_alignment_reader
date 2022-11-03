<template>


  <div class="container">
    <h1 v-show="!csvProcessedFiles.length">Upload mapping of small RNA in FASTA format</h1>
    <div @click="showStore" >show processed fasta data</div>
    <input
      v-if="!csvProcessedFiles.length"
      ref="csvLoader"
      type="file"
      accept=".fasta"
      multiple
      @change="showFiles"
    />
    <div v-else class="file-list">
      <div class="header"> {{ 'Recieved data: ' + csvProcessedFiles.length +' files' }} </div>

      <div v-show="loading" class="table-container"> 
        <table class="table-mapped-overview">
          <thead>
            <tr>
              <th>
                Dataset
              </th>
              <th>
                Reference
              </th>
              <th>
                Mapped reads
              </th>
              <th>
                Forward/Reverse balance
              </th>
              <th>
                Nonredundant, %
              </th>
              <th>
                Variant specific (%)
              </th>
              <th>
                Barplot
                <div class="barplot-bar" :style="{width: '200px', background: 'darkorange', 'font-size': '0.75rem', 'text-align': 'right'}" :ref="index+'_cnt'">Scale: 10,000 reads</div>

              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(file, index) in csvProcessedFiles"
              :key="'file' + index">  
              <td>
                 {{ file.name.match(/CR.{5}/)[0] }}
              </td>
              <td>
                 {{ file.seqDetails.ref.seqName }}
              </td>
              <td>
                 {{ file.seqDetails.totalCount }}
              </td>
              <td>
                 {{ file.seqDetails.frRvRatio }}
              </td>
              <td>
                 {{ file.seqDetails.nonRedundantPerc }}
              </td>
              <td @click="getVariantSpecific(index)">
                 {{ getVariantSpecific(index) + ' ' + '(' + fixedNumber(100 * (getVariantSpecific(index) / file.seqDetails.totalCount)) + '%)' }}
              </td>
              <td >
                <div class="barplot-bar" :style="{width: file.seqDetails.totalCount / 50 + 'px' }" :ref="index+'_cnt'"></div>
                
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

import processCsvFile from "@/utils/processCSVfile.js";


export default {
  name: "IndexView",
  components: {

  },
  data (){
    return{
      loading: false,
      files: []
    }
  },
  methods: {
    showStore (){
      console.log(store.state.csvProcessedFiles)
      // console.log(this.files)
    },
    fixedNumber (n) {
      return n.toFixed(1)
    },
    showFiles() {
      for (const file of this.$refs.csvLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            const nameAndSeq = {name: file.name, seqDetails: processCsvFile(data)}
            store.commit("addEntry", nameAndSeq);
          })
          .catch((e) => console.error(e));
      }
    },
    getVariantSpecific (index){
      const compared = store.state.csvProcessedFiles[index].seqDetails.reads.map(read => read.seq);
      const others = store.state.csvProcessedFiles.filter((_, i) => i !== index);

      const seqsFromOthers = new Set (others.map(file => file.seqDetails.reads.map(read => read.seq)).flat());
      const variantSpecific = compared.filter(read => !seqsFromOthers.has(read));
      this.loading = true;
      return variantSpecific.length
    },
    commonBetweenTwo(a,b){
      return a + b
    },
  },
  computed: {
    csvProcessedFiles() {
         return store.state.csvProcessedFiles;
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
