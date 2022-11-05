<template>
    <button @click="showData">Button</button>
 <!-- <table class="table-mapped-overview">
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
            <tr v-for="(file, index) in csvProcessedFiles"
              :key="'file' + index">  
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
                 variant-specific
              </td>
              <td >
                <div class="barplot-bar" :style="{width: file.seqDetails.totalCount / 50 + 'px' }" :ref="index+'_cnt'"></div>
                
              </td>
            </tr>
          </tbody>
        </table> -->
</template>

<script>
import store from "@/store/index";

    export default {
        name: 'ITableOverview',
        props: {
            datasets: Array
        },
        computed: {
            filteredDatasets (){
                // return store.state.csvProcessedFiles
                const filteredDataset = this.datasets.map(dataset => {
                    store.state.csvProcessedFiles.filter(file => {
                        file.seqDetails.dataset === dataset
                    })
                })
                return filteredDataset
            }
        },
        methods: {
            showData (){
                console.log(this.filteredDatasets)
            }
        }
        
    }
</script>

<style lang="stylus" scoped>
.table-mapped-overview
    background: lightblue
    width 100%
  &th,td
    padding 0.5rem

.barplot-bar
  background: gray
  height: 20px
</style>