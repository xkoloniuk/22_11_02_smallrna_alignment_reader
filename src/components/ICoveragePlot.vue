<template>
<bar-chart 
    :barPosChartData="computedCoverage.position" 
    :barMinusChartData="computedCoverage.minus" 
    :barPlusChartData="computedCoverage.plus" />
    <div @click="onClick">show computed </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue'
// import store from "@/store/index";

    export default {
        name: 'ICoveragePlot',
        components: {
            BarChart
        },
        data () {
            return {

                coverage: Object
            }
        },
        props:{
            reads: Array,
            refLength: Number
            
        },
        methods: {
            onClick () {
                console.log(this.computedCoverage)
            }
            // toggleData (){
            //     this.$emit('toggledData')
            // }
        },
        created (){
            // console.log(this.dataset)
            // console.log(this.selection)
            // this.coverage = store.state.csvProcessedFiles[this.dataset].seqDetails.ref.coverage
        },
        beforeUpdate(){
            console.log('before update')
        },
        updated(){
            console.log('updated')
            // console.log(this.dataset)
            // console.log(this.selection)
            // console.log(this.coverage)
        },
        computed: {
            // selectedCoverage (){
            //     const selCov = {position: this.coverage[this.selection].position,
            //     minus: this.coverage[this.selection].minus,
            //     plus: this.coverage[this.selection].plus}

            //     return selCov

            // }
            computedCoverage () {
                const zeroesArray = Array.from({length:this.refLength}).fill(0)
                const coverage = {
                            minus: zeroesArray.slice(),
                            plus: zeroesArray.slice(),
                            position: zeroesArray.map((_ , i) => 1 + i)
                    }

                this.reads.forEach(read => {
                    if (!read) return
                   
                    const readLengthArray = Array.from({length: read.seqLength}).fill(0).map((_ , i) => 1 + i + read.start)

                    if(read.reverse) {
                        readLengthArray.map(pos => {
                        coverage.minus[pos]--
                        })
                        } else { 
                            readLengthArray.map(pos => coverage.plus[pos]++ ) 
                        } 
                    })

                return coverage

            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>