<template>

  <div class="container">
    <h1 v-show="!fastaProcessedFiles.length">Upload mapping of small RNA in FASTA format</h1>
    <div @click="showStore" >show processed fasta data</div>
    <input
      v-if="!fastaProcessedFiles.length"
      ref="fastaLoader"
      type="file"
      accept=".fasta"
      multiple
      @change="processFastaMappings"
    />
    <div v-else class="file-list">
      <div :class="{ header: true,
          'limegreen-bg': allFilesRead
          }"> 
          <span>{{ allFilesRead ? 'Done, recieved ' : 'Recieving data: ' }}  </span>
          <span>{{ fastaProcessedFiles.length +' out of ' + fastaSelectedFilesCount +' files'  }} </span>
       </div>
       <div>
        <button
                    class="show-size-distribution-plot" 
                    @click="toggleToShowSizeDistributionPlot('all')"
                    id="showAllSizeDistributionPlots">
                    Show all size dist plots
                  </button>
                  <button
                    class="show-coverage-plot" 
                    @click="toggleToShowCoveragePlot('all')"
                    id="toggleToShowCoveragePlot">
                    Show all coverage plots
                  </button>
       </div>
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
                Mapped reads (nonredundant)
              </th>
              <th>
                Forward/Reverse balance
              </th>
              <th>
                Variant specific (%)
              </th>
              <th>
         
                <!-- <div class="barplot-bar" :style="{width: '200px', background: 'darkorange', 'font-size': '0.75rem', 'text-align': 'right'}" ref="Count scale">Scale: 10,000 reads</div> -->

              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(file, index) in fastaProcessedFiles"
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
                  <div class="barplot-reads">
                    <div class="barplot-bar" :style="{width: file.seqDetails.totalCount / 50 + 'px' }" :ref="index +'_cnt'">
                    </div>
                    <span>
                      {{ file.seqDetails.totalCount + '  (' + file.seqDetails.nonRedundantPerc + '%)' }}
                    </span>
                    
                  </div>
                  <i-length-barplot 
                  v-if="showSizeDistributionPlot[index] || showAllSizeDistributionPlots"
                  :data="file.seqDetails.reads.map(item => item.seq)"
                  :dataVariants="getVariantSpecific(index)"/>
                </td>
                <td>
                  {{ file.seqDetails.frRvRatio }}
                </td>

                <td>
                  {{ getVariantSpecific(index).length + ' ' + '(' + fixedNumber(100 * (getVariantSpecific(index).length / file.seqDetails.totalCount)) + '%)' }}

                </td>
                <td class="v-align-btm">

                  <button
                    class="show-size-distribution-plot" 
                    @click="showSizeDistributionPlot[index] = !showSizeDistributionPlot[index]"
                    :ref="'showSizeDistributionPlot'+ index">
                    {{ ' size dist plot'}}
                  </button>
                  <button
                    class="show-coverage-plot" 
                    @click="toggleToShowCoveragePlot(index)"
                    :ref="'showCoveragePlot'+ index">
                    {{  +' coverage plot'}}
                  </button>

                </td>
              </tr>
              <tr class="coverage-plot-tr-container">
                <td v-if="showCoveragePlot[index]" colspan="8" >
                  <i-coverage-container 
                  :ref="file.name + '_plot'"
                  :reads="readsVariantSpecific(index)"
                  :refLength="file.seqDetails.ref.seqLength"
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
import ICoverageContainer from "@/components/ICoverageContainer.vue"
import processFastaMappingFile from "@/utils/processFastaMappingFile.js";


export default {
  name: "IndexView",
  components: {
    ILengthBarplot, 
    ICoverageContainer
  },
  data (){
    return{
      loading: false,
      showCoveragePlot: {},
      showSizeDistributionPlot: {},
      showAllSizeDistributionPlots: false
    }
  },
  updated (){
    // this.fastaProcessedFiles.map((_, i) => this.showSizeDistributionPlot[i] = false)
    // console.log(this.showSizeDistributionPlot)

    Object.keys(this.showSizeDistributionPlot).map((_, i) => this.showSizeDistributionPlot[i] = !this.showSizeDistributionPlot[i])
  },
  methods: {
    showStore (){
      console.log(store.state.fastaProcessedFiles)
      console.log(this.datasets)


    },
    onToggledData () {
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
    },
    toggleToShowCoveragePlot (index){
      this.showCoveragePlot[index] = !this.showCoveragePlot[index]
      const el = this.$refs['showCoveragePlot'+ index][0]
      el.textContent = this.showCoveragePlot[index] ? 'Hide coverage plot' : 'Show coverage plot'
      el.classList.toggle('thick-border')


    },
    toggleToShowSizeDistributionPlot (par){

      if (par === 'all') {
        console.log('all')
          this.showAllSizeDistributionPlots = !this.showAllSizeDistributionPlots
          const el = document.querySelector('#showAllSizeDistributionPlots')
        el.textContent = this.showAllSizeDistributionPlots ? 'ALL: Hide size dist plots' : 'ALL: Show size dist plots'
        el.classList.toggle('thick-border')

      } else { 
        this.showSizeDistributionPlot[par] = !this.showSizeDistributionPlot[par]
        const el = this.$refs['showSizeDistributionPlot'+ par][0]
        el.textContent = this.showSizeDistributionPlot[par] ? 'Hide size dist plot' : 'Show size dist plot'
        el.classList.toggle('thick-border')
      }

    },
    fixedNumber (n) {
      return n.toFixed(1)
    },
    processFastaMappings() {
      // TODO fix reset of files count, i.e. change of header from green to orange
      if(this.$refs.fastaLoader.files.length > 1) store.commit('setFastaSelectedFilesCount', this.$refs.fastaLoader.files.length)

      for (const file of this.$refs.fastaLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            const nameAndSeq = {name: file.name, seqDetails: processFastaMappingFile(data, file.name)}
            store.commit("addEntry", nameAndSeq);
          })
          .catch((e) => console.error(e));
      }
    },
    getVariantSpecific (index){
      const comparedSeqs = store.state.fastaProcessedFiles[index].seqDetails.reads.map(read => read.seq);
      const currentDataset = store.state.fastaProcessedFiles[index].seqDetails.dataset
      const currentVirus = store.state.fastaProcessedFiles[index].seqDetails.virus
      const currentRef = store.state.fastaProcessedFiles[index].seqDetails.ref.seqName
      const otherVariantsFromTheSameDataset = store.state.fastaProcessedFiles.filter(file => file.seqDetails.dataset === currentDataset && file.seqDetails.virus === currentVirus && file.seqDetails.ref.seqName !== currentRef)


      const otherSeqs = new Set (otherVariantsFromTheSameDataset.map(file => file.seqDetails.reads.map(read => read.seq)).flat());
      const variantSpecific = comparedSeqs.filter(read => !otherSeqs.has(read));
      this.loading = true;
  

      return variantSpecific
    },
    readsVariantSpecific (index){
      const comparedSeqs = store.state.fastaProcessedFiles[index].seqDetails.reads;
      const currentDataset = store.state.fastaProcessedFiles[index].seqDetails.dataset
      const currentVirus = store.state.fastaProcessedFiles[index].seqDetails.virus
      const currentRef = store.state.fastaProcessedFiles[index].seqDetails.ref.seqName
      const otherVariantsFromTheSameDataset = store.state.fastaProcessedFiles.filter(file => file.seqDetails.dataset === currentDataset && file.seqDetails.virus === currentVirus && file.seqDetails.ref.seqName !== currentRef)


      const otherSeqs = new Set (otherVariantsFromTheSameDataset.map(file => file.seqDetails.reads.map(read => read.seq)).flat());
      const variantSpecific = comparedSeqs.filter(read => !otherSeqs.has(read));
      this.loading = true;
  
      return variantSpecific
    },
    commonBetweenTwo(a,b){
      return a + b
    },
  },
  watch:{},
  computed: {
    fastaProcessedFiles() {
         return store.state.fastaProcessedFiles;
    },
    fastaSelectedFilesCount() {
         return store.state.fastaSelectedFilesCount;
    },

    datasets () {
      const datasets = store.state.fastaProcessedFiles.map(file => file.seqDetails.dataset)
      return new Set(datasets)
    },
    allFilesRead (){
      return this.fastaProcessedFiles.length === this.fastaSelectedFilesCount
    }
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
  padding 1rem
  background: orange
  border-radius 5px
.limegreen-bg
  background: limegreen
.orange-bg
  background: orange

.container
    width 100%
    margin 40px auto 0
input::file-selector-button
    padding 0.5rem
    font-size 1rem
    color blue
    border-radius 5px

.v-align-btm
  vertical-align: bottom
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

.show-coverage-plot
  // background: lightpink
  // margin-top 50%
  padding 0.5rem
  border 1px solid black
  border-radius 5px
  font-size: 0.75rem
  // justify-content: center
  &:hover
    filter: drop-shadow(1px 1px 10px grey)
    filter: invert(40%)
.show-size-distribution-plot
  // background: lightpink
  // margin-top 50%
  padding 0.5rem
  border 1px solid black
  border-radius 5px
  font-size: 0.75rem
  // justify-content: center
  &:hover
    filter: drop-shadow(1px 1px 10px grey)
    filter: invert(40%)

.thick-border
  border 1.5px solid blue
  filter: drop-shadow(1px 1px 1px blue)

.barplot-reads
  padding-right: 2rem
  display: flex
  flex-direction column
  gap 10px
  // align-items: center
  // justify-content: space-between
.barplot-bar
  background: #5e05b5
  height: 3px



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
