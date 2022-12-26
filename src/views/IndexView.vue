<template>
<div @click="toggleShowPlots">{{ showPlots ? 'Hide plots' : 'Show plots' }}</div>
  <div class="container">
    <h1 v-show="!processedFiles.length">Upload mapping of small RNA in FASTA format</h1>
    <div @click="showStore" >show processed fasta data</div>
    <input
      v-if="!processedFiles.length"
      ref="csvLoader"
      type="file"
      accept=".fasta"
      multiple
      @change="processFiles"
    />
    <div v-else class="file-list">
      <div class="header"> {{ 'Recieved data: ' + processedFiles.length +' files' }} </div>

      <div v-if="!loading" class="table-container"> 
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

            </tr>
          </thead>

          <tbody>
            <template v-for="(file, index) in processedFiles"
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
                </td>
                <td>
                  {{ file.seqDetails.frRvRatio }}
                </td>
                <td>
                  {{ file.seqDetails.nonRedundantPerc }}

                </td>
                <td>
                  {{ filterFn(index, 'variantSpecific').length + ' ' + '(' + fixedNumber(100 * (filterFn(index, 'variantSpecific').length / file.seqDetails.totalCount)) + '%)' }}
                </td>

              </tr>
<template v-if="showPlots">
  <tr class="coverage-plot-tr-container">
    <td colspan="3">
      <i-length-barplot :data="file.seqDetails.reads.map(read => read.seq)" />
      </td>
      <td colspan="5" >
        all mapped  {{ filterFn(index, 'seq').length }}
        <i-coverage-plot 
        :reads="filterFn(index, 'seq')"
        :refLength="file.seqDetails.ref.seqLength"
        />
      </td>
    </tr>
    
    <tr class="coverage-plot-tr-container">
      <td colspan="3">
        <i-length-barplot :data="filterFn(index, 'variantSpecific').map(read => read.seq)"/>
        </td>
        <td colspan="5" >
          Variant specific {{ filterFn(index, 'variantSpecific').length }}
          
          <i-coverage-plot 
          :ref="file.name + '_plot'"
          :reads="filterFn(index, 'variantSpecific')"
          :refLength="file.seqDetails.ref.seqLength"
          />
        </td>
      </tr>
      
      <tr class="coverage-plot-tr-container">
        <td colspan="3">
          <i-length-barplot :data="filterFn(index, 'variantSpecificUnique').map(read => read.seq)"/>
          </td>
          <td colspan="5" >
            Variant specific without duplicates  {{ filterFn(index, 'variantSpecificUnique').length }}
            
            <i-coverage-plot 
            :ref="file.name + '_plot'"
            :reads="filterFn(index, 'variantSpecificUnique')"
            :refLength="file.seqDetails.ref.seqLength"
            />
          </td>
        </tr>
      </template>
        


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
    ILengthBarplot, ICoveragePlot, 
  },
  data (){
    return{
      files: [],
      readsToShow: 'total',
      showPlots: true
    }
  },
  methods: {
    showStore (){
      console.log(store.state.processedFiles)
      console.log(this.datasets)

    },
    toggleShowPlots (){
      this.showPlots = !this.showPlots
    },
    onToggledData () {
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
    },
    toggleReadsToShow (){
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
    },
    fixedNumber (n) {
      return n.toFixed(1)
    },
    processFiles() {

      const filesCount = this.$refs.csvLoader.files.length;

      for (const file of this.$refs.csvLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            const nameAndSeq = {name: file.name, seqDetails: processCsvFile(data, file.name), filesCount: filesCount}
            store.commit("addEntry", nameAndSeq);
          })
          .catch((e) => console.error(e));
      }
    },

    filterFn (index, par){
      return store.state.processedFiles[index].seqDetails.reads.filter(read => read[par])
    },
  },
  computed: {
    processedFiles() {
         return store.state.processedFiles;
    },
    loading() {
      return store.state.loading
    },
    datasets () {
      const datasets = store.state.processedFiles.map(file => file.seqDetails.dataset)
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
  margin 2rem 2rem
  text-align: left

.table-mapped-overview
    border-collapse: collapse;
    width 100%
  &th,td
    padding 0.5rem
    vertical-align: top
  &tr:nth-child(4n+1)
    background: lightblue
    // background: white
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
