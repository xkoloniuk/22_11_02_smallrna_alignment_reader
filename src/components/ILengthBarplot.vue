<template>
    <div class="barplot">
        <!-- <div v-for="length in Object.keys(binByLength.lengthCounts)" 
            :key="length + 'len'"
            :style="{height: (100 / binByLength.max) * binByLength.lengthCounts[length] + 'px' }"
            class="barplot-bar"
            >
            <span>
                {{ length }}
            </span>
        </div> -->
        <size-distibution-bar-chart 
            :lengthData="binByLength.lengthCounts" 
            :lengthDataVariants="binByLength.lengthCountsVariants"/>
    </div>
</template>

<script>
import SizeDistibutionBarChart from '@/components/SizeDistibutionBarChart.vue'

export default {
    name: "ILengthBarplot",
    components: {
            SizeDistibutionBarChart
        },
    props: {
        data: Array,
        dataVariants: Array
    },
    created (){
        // console.log(this.dataVariants)


    },
    methods:{
        showBinData (){
            console.log(this.binByLength)
        }
    },
    computed: {
        importedData (){
            return this.data
        },
        binByLength (){
           const lengthCounts = this.data.reduce((acc, cur) =>{
                return acc[cur.length] ? ++acc[cur.length] : acc[cur.length] = 1, acc
            },{})
           const lengthCountsVariants = this.dataVariants.reduce((acc, cur) =>{
                return acc[cur.length] ? ++acc[cur.length] : acc[cur.length] = 1, acc
            },{})
            
            return {max: Math.max(...Object.values(lengthCounts)), lengthCounts, lengthCountsVariants}
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