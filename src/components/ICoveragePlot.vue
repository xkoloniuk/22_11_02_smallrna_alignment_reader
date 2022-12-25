<template>
    <bar-chart 
        :barChartData="computedCoverage" />
    </template>
    
    <script>
    import BarChart from '@/components/BarChart.vue'
    
        export default {
            name: 'ICoveragePlot',
            components: {
                BarChart
            },
            data () {
                return {
                    passAllReads: true,
                    coverage: Object
                }
            },
            props:{
                reads: Array,
                refLength: Number
                
            },
            computed: {
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
                },
            }
        }
    </script>
    
    <style lang="stylus" scoped>
    
    </style>