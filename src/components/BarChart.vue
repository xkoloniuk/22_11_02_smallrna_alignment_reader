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
      default: 1400,
    },
    height: {
      type: Number,
      default: 300,
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
    barPlusChartData: Array,
    barMinusChartData: Array,
    barPosChartData: Array,
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
        labels: this.barPosChartData,
        datasets: [
          {
            label: "plus",
            data: this.barPlusChartData,
            backgroundColor: "black",
          },
          {
            label: "minus",
            data: this.barMinusChartData,
            backgroundColor: "red",
          },
        ],
        // TODO
        // add custom scales
      },
      chartOptions: {
        responsive: true,
      },
      // options: {
      //   scales: {
      //     y: {
      //       type: 'logarithmic',
      //       max: 50
      //       // ticks: {
      //       //   min: 3,
      //       //   beginAtZero: true
      //       //       }
      //     }
      //   }
      // },
      }

  },
};
</script>