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
                Virus
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
            <template v-for="(file, index) in csvProcessedFiles"
              :key="'file' + index">

              <tr class="reads-details-tr-container">  
                <td>
                  {{ file.seqDetails.dataset }}
                </td>
                <td>
                  {{ file.seqDetails.virus }}
                </td>
                <td>
                  {{ file.seqDetails.ref.seqName }}
                </td>
                <td>
                  {{ file.seqDetails.totalCount }}
                  <i-length-barplot :data="file.seqDetails.reads.map(item => item.seq)" />
                </td>
                <td>
                  {{ file.seqDetails.frRvRatio }}
                </td>
                <td>
                  {{ file.seqDetails.nonRedundantPerc }}
                  <i-length-barplot :data="file.seqDetails.uniqueReads"/>

                </td>
                <td>
                  {{ getVariantSpecific(index).length + ' ' + '(' + fixedNumber(100 * (getVariantSpecific(index).length / file.seqDetails.totalCount)) + '%)' }}
                  <i-length-barplot :data="getVariantSpecific(index)"/>
                </td>
                <td >
                  <div class="barplot-bar" :style="{width: file.seqDetails.totalCount / 50 + 'px' }" :ref="index +'_cnt'"></div>
                  <div
                    class="toggleReads" 
                    @click="toggleReadsToShow"
                    >Show coverage without duplicates
                  </div>

                </td>
              </tr>
              <tr class="coverage-plot-tr-container">
                <td colspan="8" >
                  <i-coverage-plot 
                  :ref="file.name + '_plot'"
                  :dataset="index"
                  :selection="readsToShow"
                    />
                </td>
              </tr>
          </template>

          </tbody>
        </table>
    </div>
      
    </div>
  </div>
</template>

<script>
import store from "@/store/index";
import ILengthBarplot from "@/components/ILengthBarplot.vue"
import ICoveragePlot from "@/components/ICoveragePlot.vue"
import processCsvFile from "@/utils/processCSVfile.js";


export default {
  name: "IndexView",
  components: {
    ILengthBarplot, ICoveragePlot
  },
  data (){
    return{
      loading: false,
      files: [],
      readsToShow: 'total'
    }
  },
  methods: {
    showStore (){
      console.log(store.state.csvProcessedFiles)
      console.log(this.datasets)

    },
    toggleReadsToShow (){
      console.log(this.readsToShow)
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
      console.log(this.readsToShow)
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
            const nameAndSeq = {name: file.name, seqDetails: processCsvFile(data, file.name)}
            store.commit("addEntry", nameAndSeq);
          })
          .catch((e) => console.error(e));
      }
    },
    getVariantSpecific (index){
      const comparedSeqs = store.state.csvProcessedFiles[index].seqDetails.reads.map(read => read.seq);
      const currentDataset = store.state.csvProcessedFiles[index].seqDetails.dataset
      const currentVirus = store.state.csvProcessedFiles[index].seqDetails.virus
      const currentRef = store.state.csvProcessedFiles[index].seqDetails.ref.seqName
      const otherVariantsFromTheSameDataset = store.state.csvProcessedFiles.filter(file => file.seqDetails.dataset === currentDataset && file.seqDetails.virus === currentVirus && file.seqDetails.ref.seqName !== currentRef)


      const otherSeqs = new Set (otherVariantsFromTheSameDataset.map(file => file.seqDetails.reads.map(read => read.seq)).flat());
      const variantSpecific = comparedSeqs.filter(read => !otherSeqs.has(read));
      this.loading = true;
  

      return variantSpecific
    },
    commonBetweenTwo(a,b){
      return a + b
    },
  },
  computed: {
    csvProcessedFiles() {
         return store.state.csvProcessedFiles;
    },
    datasets () {
      const datasets = store.state.csvProcessedFiles.map(file => file.seqDetails.dataset)
      return new Set(datasets)
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
    border-collapse: collapse;
    width 100%
  &th,td
    padding 0.5rem
    vertical-align: top
  &tr:nth-child(even)
    background: white
    margin 20px
.coverage-plot-tr-container
  border-bottom 2px solid black
.coverage-plot-tr-container:nth-child(even),
  border-left 2px solid black

.reads-details-tr-container:nth-child(even)
  border-left 2px solid black

.toggleReads
  background: lightpink
  padding 0.5rem
  border-radius 5px

  &:hover
    filter: drop-shadow(1px 1px 10px grey)
    filter: invert(100%)

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
        filter: drop-shadow(1px 1px 3px gray)
        font-weight 600
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
