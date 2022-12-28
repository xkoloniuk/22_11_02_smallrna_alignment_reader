<template>
    <div class="barplot">
        <div v-for="length in actualRange" 
            :key="length + 'len'"
            :style="{height: (180 / binByLength.max) * binByLength.lengthCounts[length] + 'px' }"
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
        },
        actualRange (){
            const lengths = this.data.map(i => i.length)

            console.log(Math.max(...lengths))
            const arr = Array.from({length: (Math.max(...lengths) - Math.min(...lengths) + 1)}).fill(Math.min(...lengths)).map((l,i) => l+i )
            console.log(arr)
            return arr
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