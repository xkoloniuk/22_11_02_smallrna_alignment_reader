<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
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
  name: "BarChart",
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
      default: 800,
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
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
    barChartData: Object,
  },
  watch: {
    chartData: function() {
      this._chart.destroy();
      this.renderChart(this.chartData);
    }
},
  data() {
    return {
      chartData: {
        labels: this.barChartData.position,
        datasets: [
          {
            label: "negative strand",
            data: this.barChartData.plus,
            backgroundColor: [
            'rgba(0,0,0, 1)',
            ],
          },
          {
            label: "positive strand",
            data: this.barChartData.minus,
            backgroundColor: [
            'rgba(255,0,0, 1)',
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
      options: {
        labels: {
          display: false
        },
        scales: {
          y: {
            // type: 'logarithmic',
            // max: 50,
            // min: -50
            // ticks: {
            //   min: 3,
            //   beginAtZero: true
            //       }
          }
        },
        plugins: {
            legend: {
                display: false
            },

        }
      },
      // options: {

      // },
      }

  },
  methods: {
    beforeUpdate(){
            console.log('before Barchart update')
        },
        updated(){
            console.log('Barchart updated')
            // console.log(this.dataset)
            // console.log(this.selection)
            // console.log(this.coverage)
        },
  }
};
</script>