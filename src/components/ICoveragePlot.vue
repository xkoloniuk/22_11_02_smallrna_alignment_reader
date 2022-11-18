<template>
<bar-chart :barPosChartData="selectedCoverage.position" :barMinusChartData="selectedCoverage.minus" :barPlusChartData="selectedCoverage.plus" />
</template>

<script>
import BarChart from '@/components/BarChart.vue'
import store from "@/store/index";

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
            dataset: Number,
            selection: String,
            
        },
        created (){
            console.log(this.dataset)
            console.log(this.selection)
            this.coverage = store.state.csvProcessedFiles[this.dataset].seqDetails.ref.coverage
        },
        beforeUpdate(){
            console.log('before update')
        },
        updated(){
            console.log('updated')
            console.log(this.dataset)
            console.log(this.selection)
            console.log(this.coverage)
        },
        computed: {
            selectedCoverage (){
                const selCov = {position: this.coverage[this.selection].position,
                minus: this.coverage[this.selection].minus,
                plus: this.coverage[this.selection].plus}

                return selCov

            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>