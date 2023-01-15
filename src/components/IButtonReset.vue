<template>
  <div v-if="showButton" class="btn-reset" @click="resetFiles">Reset</div>
</template>

<script>
import store from "@/store/index";

export default {
  name: "IButtonReset",
  methods: {
    resetFiles() {
      store.commit("resetFiles");
    },
  },
  props: {
    title: String,
  },
  computed: {
    showButton() {
      return store.state.processedFiles.length >= 1 || store.state.readsDatasets.length >= 1;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn-reset
    width 50px
    height 20px
    z-index 2
    position sticky
    top 10%
    left 95%
    background white
    color red
    border 2px solid red
    border-radius 5px
    padding 0.5rem 1rem
    cursor pointer
    justify-self end
    &:hover
      filter: drop-shadow(1px 1px 3px gray)
      font-weight 600

@media print
  .btn-reset
    display: none
</style>
