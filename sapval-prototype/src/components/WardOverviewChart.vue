<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'WardOverviewChart',
  components: { Bar },
  data() {
    return {
      chartData: {
      
        labels: [ 'January', 'February', 'March' ],
        datasets: [{
          label: 'THIS DATA',
          data: [40, 20, 12] } ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>

<template>
    <h1>Ward Warnings</h1>
    <!-- <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="125" height="125" />  -->
    <Bar
    id="ward_warning_chart"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<style>
/* chart {
    background-color: #c41a1a;
    background: #FFFFFF;
    border: none;
    border-radius: 2px;
    box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);
    width: "640";
    height: "480";
} */
</style>

