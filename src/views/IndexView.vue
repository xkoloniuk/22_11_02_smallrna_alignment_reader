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

      <div v-for="(file, index) in csvProcessedFiles" :key="index + '_read'">
        <span>{{ file.seq }}</span>

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
  methods: {
    showStore (){
      console.log(store.state.csvProcessedFiles)
    },
    showFiles() {
      for (const file of this.$refs.csvLoader.files) {
        file
          .text()
          .then((data) => data)
          .then((data) => {
            store.commit("addEntry", processCsvFile(data));
          })
          .catch((e) => console.error(e));
      }
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
