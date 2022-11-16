<template>
<bar-chart :barPosChartData="position" :barMinusChartData="minus" :barPlusChartData="plus" />
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
            minus: Array,
            position: Array
        }
    }
</script>

<style lang="stylus" scoped>

</style>