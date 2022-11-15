<template>
    <div class="barplot">
        <div v-for="length in Object.keys(binByLength.lengthCounts)" 
            :key="length + 'len'"
            :style="{height: (200 / binByLength.max) * binByLength.lengthCounts[length] + 'px' }"
            class="barplot-bar"
            >
            <span>
                {{ length }}
            </span>
        </div>
        </div>
</template>

<script>

export default {
    name: "ILengthBarplot",
    props: {
        data: Array
    },
    methods:{
        showBinData (){
            console.log(this.binByLength)
        }
    },
    computed: {
        binByLength (){
           const lengthCounts = this.data.reduce((acc, cur) =>{
                return acc[cur.length] ? ++acc[cur.length] : acc[cur.length] = 1, acc
            },{})
            return {max: Math.max(...Object.values(lengthCounts)), lengthCounts}
        }
    }
}
</script>

<style lang="stylus" scoped>
.barplot
    display: flex
    align-items: flex-end
    padding 20px
.barplot-bar
  background: gray
  width: 20px
  position: relative
.barplot-bar>span
    position absolute
    bottom -20px
    font-size 0.8rem
    text-align center
</style>