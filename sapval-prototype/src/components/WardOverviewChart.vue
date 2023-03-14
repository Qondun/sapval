
<template>
  <!--     <h1>Ward Warnings</h1>
       <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="125" height="125" /> 
      <Bar
      id="ward_warning_chart"
      :options="chartOptions"
      :data="chartData"
    /> -->
  </template>
  

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import wardsdata from '../records/wards.json';

 
import Papa from 'papaparse';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
/* console.log(Papa.parse('../records/wards.csv')) */

export default {
  name: 'WardOverviewChart',
/*   components: { Bar },
 */  data: function() {
    return {
      stuff: wardsdata.wardsInfo,
    };
  },

/*   
       chartData: {
        labels: [ ],
        datasets: [{
          label: '',
          data: [] } ] 
      },
      chartOptions: {
        responsive: true
      }
    }
  }, */
  mounted: function() {
    // Checking if everything works, delete this right after you see that everything works
    console.log(this.stuff);
  },
/*     created() {
      wardsdata.accounts.map((item) => {
        this.chartData.labels.push( item.name );
        this.chartData.datasets.push( {label: item.name, "data": [item.pet]} );
      });
    } */
};
</script>


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

