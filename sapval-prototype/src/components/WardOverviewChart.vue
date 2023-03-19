

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'
import wardsdata from '../records/inpatientWards.json';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
    name: "WardOverviewChart",
       components: { Bar },
      data: function () {
        return {
      chartData: {
        labels: [ ],
        datasets: [ 
          { label: 'beds',
            data: [] 
          } ]
      },
      chartOptions: {
        responsive: true
      },
      ward: wardsdata.wardsInfo
    }
    
    },
      created: function () {
        // Checking if everything works, delete this right after you see that everything works
        //console.log(this.ward);        
        this.ward.map((item) => {
          console.log(item.Avdelning + " : " + item.numPlatser);
          this.chartData.labels.push(item.Address)
          this.chartData.datasets[0].data.push(parseInt(item.numPlatser))
        })
    },
    //components: { BarController }
};
</script>

<template>      
  <Bar
      id="ward-warning-chart"
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

