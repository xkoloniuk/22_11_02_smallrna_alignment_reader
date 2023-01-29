<template>
  <div @click="toggleShowPlots">
    <span class="plots-show-info">
      Current settings: "{{ showPlots? 'Show all plots': 'No plots' }}"
    </span>
  </div>
  <div class="container">
    <h1 v-show="!processedFiles.length">Upload mapping of small RNA in FASTA format</h1>
    <div @click="showStore" class="show-files-btn">show processed fasta data</div>
    <input v-if="!processedFiles.length" ref="csvLoader" type="file" accept=".fasta" multiple @change="processFiles" />
    <div v-else class="file-list">
      <div class="header"> {{ 'Recieved data: ' + processedFiles.length + ' files' }} </div>

      <div v-if="!loading" class="table-container">
        <template v-for="dataset in datasets" :key="dataset+ ' dataset'">

        <h2>
          Mappings of the {{ dataset }} reads against the viral references.
          </h2>
          <template v-for="(file, index) in processedFiles.filter(file => file.seqDetails.dataset === dataset)" :key="'file' + index">
          <table class="table-mapped-overview">
            <thead>
              <tr>
                <th>
                  Dataset
                </th>
                <th>
                  Input reads
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
                  Mapped reads, %
                </th>
                <th>
                  RPKM
                </th>
                <th>
                  Forward/Reverse balance
                </th>
                <th>
                  Nonredundant, %
                </th>
                <th>
                  Strain specific
                </th>
                <th>
                  Strain specific, % from total mapped reads
                </th>
                <th>
                  Strain specific, RPKM
                </th>

              </tr>
            </thead>

            <tbody>

              <tr class="reads-details-tr-container">
                <td>
                  {{ file.seqDetails.dataset }}
                </td>
                <td>
                  {{ file.seqDetails.inputReads }}
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
                  {{ ((file.seqDetails.totalCount / file.seqDetails.inputReads) * 100).toFixed(3) }}
                </td>
                <td>
                  {{ file.seqDetails.rpkm.toFixed(1) }}
                </td>
                <td>
                  {{ file.seqDetails.frRvRatio }}
                </td>
                <td>
                  {{ file.seqDetails.nonRedundantPerc }}

                </td>
                <td>
                  {{ filterFn(index, 'variantSpecific').length }}
                </td>
                <td>
                  {{ fixedNumber(100 * (filterFn(index, 'variantSpecific').length / file.seqDetails.totalCount), 1) }}
                </td>
                <td>
                  {{ file.seqDetails.rpkmVariantSpecific.toFixed(1) }}
                </td>

              </tr>
              <template v-if="showPlots">

                <tr class="coverage-plot-tr-container">
                  <td colspan="10" class="td-align-bottom td-center-text">
                    <i-coverage-plot
                        :reads="filterFn(index, 'seq')"
                        :refLength="file.seqDetails.ref.seqLength" />
                    <strong>Mapping coverage of <span class="text-red">all reads</span> matching {{
                      file.seqDetails.ref.seqName
                    }} ({{ filterFn(index, 'seq').length }} reads)</strong>
                  </td>
                  <td colspan="2" class="td-align-bottom td-center-text">
                    <div class="width-475">

                      <i-length-barplot :data="file.seqDetails.reads.map(read => read.seq)" />
                    </div>
                    <strong>Length distribution of the reads</strong>
                  </td>



                </tr>



                <tr class="coverage-plot-tr-container" >
                  <td colspan="10" class="td-align-bottom td-center-text">
                    <i-coverage-plot
                        :ref="file.name + '_plot'"
                        :reads="filterFn(index, 'variantSpecific')"
                        :refLength="file.seqDetails.ref.seqLength" />
                    <strong>Mapping coverage of {{ file.seqDetails.ref.seqName }} <span class="text-red">specific
                        reads</span> ({{ filterFn(index, 'variantSpecific').length }} reads)</strong>

                  </td>
                  <td colspan="2" class="td-align-bottom td-center-text">
                    <i-length-barplot :data="filterFn(index, 'variantSpecific').map(read => read.seq)" />
                    <strong>Length distribution of the reads</strong>

                  </td>
                </tr>

                <!-- <tr class="coverage-plot-tr-container">
        <td colspan="3">
          <i-length-barplot :data="filterFn(index, 'variantSpecificUnique').map(read => read.seq)"/>
          </td>
          <td colspan="9" >
            Variant specific without duplicates  {{ filterFn(index, 'variantSpecificUnique').length }}
            
            <i-coverage-plot 
            :ref="file.name + '_plot'"
            :reads="filterFn(index, 'variantSpecificUnique')"
            :refLength="file.seqDetails.ref.seqLength"
            />
          </td>
        </tr> -->
              </template>




            </tbody>
          </table>
        </template>
      </template>

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
  data() {
    return {
      files: [],
      readsToShow: 'total',
      showPlots: false
    }
  },
  methods: {
    showStore() {
      console.log(store.state.processedFiles)
      console.log(this.datasets)

    },
    toggleShowPlots() {
      this.showPlots = !this.showPlots
    },
    onToggledData() {
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
    },
    toggleReadsToShow() {
      this.readsToShow = this.readsToShow === 'total' ? 'unique' : 'total'
    },
    fixedNumber(n) {
      return n.toFixed(1)
    },
    processFiles() {

      const filesCount = this.$refs.csvLoader.files.length;

      for (const file of this.$refs.csvLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            const nameAndSeq = { name: file.name, seqDetails: processCsvFile(data, file.name), filesCount: filesCount }
            store.commit("addEntry", nameAndSeq);
          })
          .catch((e) => console.error(e));
      }
    },

    filterFn(index, par) {
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
    datasets() {
      const datasets = store.state.processedFiles.map(file => file.seqDetails.dataset)
      return new Set(datasets)
    },

  },
};
</script>

<style lang="stylus" scoped>
h1
    padding 1rem

@media print
  h1 
    page-break-before always
    display: none
  .header, .plots-show-info, .show-files-btn
    display: none


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
  &tr:nth-child(3n+1)
    background: lightblue
    // background: white
    margin 20px
  &tbody tr:nth-child(3n)
    border-bottom 4px solid black
thead tr:first-child
  background: lightpink

// .coverage-plot-tr-container
//   border-top 2px solid black
.coverage-plot-tr-container
    border-top 1px solid black


// .reads-details-tr-container:nth-child(3n+1)
//   border-left 2px solid black

.toggleReads
  background: lightpink
  padding 0.5rem
  border-radius 5px

  &:hover
    filter: drop-shadow(1px 1px 10px grey)
    filter: invert(100%)

.td-align-bottom
  vertical-align: bottom
.td-align-top
  vertical-align: top
.td-center-text
  text-align: center
    

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
.plots-show-info
    background yellow
    border-radius 5px
    cursor pointer

.width-475
  width 475px

.text-red
  color red

</style>
