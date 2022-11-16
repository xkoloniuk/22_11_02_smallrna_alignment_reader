<template>
<bar-chart :barPosChartData="plus" :barNegChartData="minus" />
</template>

<script>
import BarChart from '@/components/BarChart.vue'

    export default {
        name: 'ICoveragePlot',
        components: {
            BarChart
        },
        props:{
            plus: Array,
            minus: Array
        }
    }
</script>

<style lang="stylus" scoped>

</style>