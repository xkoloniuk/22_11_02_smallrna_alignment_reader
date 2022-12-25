<template>
  <nav>
  <i-button-reset />

    <router-link to="/">Analyze Mappings</router-link>
    <router-link to="/reads-datasets">Analyze Datasets</router-link>
  </nav>
  <router-view/>
</template>

<script>

import IButtonReset from './components/IButtonReset.vue';
  export default {
    components: {
      IButtonReset
    }
    
  }
</script>


<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
a
  padding 1rem
</style>
