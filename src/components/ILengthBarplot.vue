<template>
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";


ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
    );
    
export default {
    name: "ILengthBarplot",
    components: { Bar },


    props: {
        chartId: {
            type: String,
            default: "bar-chart",
        },
        datasetIdKey: {
            type: String,
            default: "label",
        },
        width: {
            type: Number,
            default: 250,
        },
        height: {
            type: Number,
            default: 200,
        },
        cssClasses: {
            default: "",
            type: String,
        },
        styles: {
            type: Object,
            default: () => { },
        },
        plugins: {
            type: Object,
            default: () => { },
        },
        data: Array
    },
    watch: {
        chartData: function () {
            this._chart.destroy();
            this.renderChart(this.chartData);
        }
    },
    onMount(){
        // console.log(this.binByLength)

    },
    data() {
        return {

            chartOptions: {
                responsive: true,
                // THIS REMOVES CHART LABEL
                plugins: {
                    legend: {
                        display: false
                    },
                    
            },

            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Reads, n'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Read size, nt'
                }
              }
            },

            },

        }

    },

    methods: {
        showBinData() {
            console.log(this.binByLength)
        }
    },
    computed: {
        chartData() {
            return {
                labels: [18,19,20,21,22,23,24,25,26,27,28,29,30],
                datasets: [
                    {
                        maxBarThickness: 20,
                        maxBarLength: 0,
                        data: Object.values(this.binByLength.lengthCounts),
                        backgroundColor: [
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.5)',
                        ]
                    },
                    
                ],
            }
            },
        binByLength() {
            const lengthCounts = this.data.reduce((acc, cur) => {
                return acc[cur.length] ? ++acc[cur.length] : acc[cur.length] = 1, acc
            }, {})
            return { max: Math.max(...Object.values(lengthCounts)), lengthCounts }
        },
        actualRange() {
            const lengths = this.data.map(i => i.length)

            console.log(Math.max(...lengths))
            const arr = Array.from({ length: (Math.max(...lengths) - Math.min(...lengths) + 1) }).fill(Math.min(...lengths)).map((l, i) => l + i)
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
