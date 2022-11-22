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
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "SizeDistibutionBarChart",
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
      default: 200,
    },
    height: {
      type: Number,
      default: 150,
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
    lengthData: Object

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
        labels: Object.keys(this.lengthData),
        datasets: [
          {
            data: Object.values(this.lengthData),
            backgroundColor: "black",
          },

        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
        }
      },
    //   options: {
    //     plugins: {
    //         legend: {
    //             display: false
    //         },
    //     }
    // }

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