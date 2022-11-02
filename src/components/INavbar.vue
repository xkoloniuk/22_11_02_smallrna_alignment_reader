

  <template>
<nav>

      <router-link to="/index"
      :class="{
          'link-active': ['/', '/index'].includes($route.path)
        }">
        File manager
        </router-link>

      <template v-if="showLinks">

        <router-link 
        to="/targets"
        :class="{
          'link-active': $route.path === '/targets'
        }"
        >Targets manager</router-link>

        <router-link 
        to="/cqs"
        :class="{
          'link-active': $route.path === '/cqs'
        }"
        >Cq overview</router-link>
      </template>

  </nav>
  </template>
  
  <script>
import store from "@/store/index";


    export default {
        name: 'INavbar',
        computed: {
    showLinks() {
      return store.state.csvProcessedFiles.length > 1;
    },
  },
    }
  </script>


  <style lang="stylus" scoped>
@import '../styles/variables.styl'

nav
  position: fixed
  top:0px;
  width 100%;
  height: 40px
  background: white
  font-size 1.25rem
  display: flex
  justify-content: space-around
  gap 5px
  z-index 1

@media screen and (max-width 1400px)
  nav
    justify-content: center
    gap 40px
a
  padding 0.5rem
  color $text-color
  text-decoration: none
  position: relative
  &::after
    content: ''
    height: 2px
    width: 100%
    background: black
    transition: transform .1s ease
    transform: scaleX(0)
    position: absolute
    top: 100%
    left: 0
    transform-origin: center
  &:hover::after
    transform: scaleX(0.9)
.link-active
    background: $secondary
    font-weight: bold
    border-radius $border-radius

  </style>